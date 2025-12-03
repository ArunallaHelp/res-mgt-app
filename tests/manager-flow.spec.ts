import { test, expect } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase environment variables for testing.");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

test.describe("Manager Flow", () => {
  const timestamp = Date.now();
  const registerEmail = `reg.${timestamp}@example.com`;
  const setupEmail = `setup.${timestamp}@example.com`;
  const testPhone = "0771234567";

  test("1. Manager Registration", async ({ page }) => {
    await page.goto("/manager-registration");

    // 1. Personal Information
    await page.fill('input[name="full_name"]', "Test Manager");
    await page.fill('input[name="email"]', registerEmail);
    await page.fill('input[name="phone"]', testPhone);

    // Select District
    await page.click("text=Select district");
    await page.click('div[role="option"]:has-text("Colombo")'); // Shadcn select option

    await page.fill('input[name="nearest_town"]', "Colombo 07");

    // 2. Professional Information
    await page.click("text=Select role");
    await page.click('div[role="option"]:has-text("Student")');

    await page.click("text=Select experience");
    await page.click('div[role="option"]:has-text("0–1 years")');

    await page.click("text=Select qualification");
    await page.click('div[role="option"]:has-text("O/L")');

    // Checkboxes
    await page.click('label:has-text("Teaching")'); // Professional Skills

    // 3. Support Type
    await page.click('label:has-text("Academic Teaching")');

    // 4. Subjects & Levels
    await page.click('label:has-text("O/L")'); // Grade Levels
    await page.fill('input[name="subjects"]', "Mathematics");

    // 5. Availability
    await page.keyboard.press("Escape"); // Close any open dropdowns
    await page.click('label:has-text("Saturday")');
    await page.click('label:has-text("Morning (8am – 12pm)")');

    // 6. Teaching Mode
    await page.click('label:has-text("Online")');

    // 7. Support Method
    await page.click('label:has-text("Conduct Classes")');

    // Submit
    await page.click('button[type="submit"]');

    // Expect success
    await expect(page.locator("text=Application Submitted!")).toBeVisible({
      timeout: 15000,
    });
  });

  test("2. Manager Setup (OTP Flow)", async ({ page }) => {
    // Seed the database with a pending manager
    // We use a fresh email to ensure clean state
    const { error: insertError } = await supabase.from("managers").insert({
      full_name: "Setup Test",
      email: setupEmail,
      phone: "0777777777",
      verification_status: "pending",
      district: "Colombo",
      nearest_town: "Colombo",
      job_role: "Student",
      experience_years: "0-1 years",
      highest_qualification: "O/L",
      professional_skills: ["Teaching"],
      support_types: ["Academic Teaching"],
      grade_levels: ["O/L"],
      subjects: "Maths",
      available_days: ["Saturday"],
      available_time_slots: ["Morning"],
      teaching_mode: "Online",
      support_methods: ["Conduct Classes"],
    });
    expect(insertError).toBeNull();

    await page.goto("/manager/setup");

    // 1. Request OTP
    // The form uses id="email"
    await page.fill('input[id="email"]', setupEmail);
    await page.click('button:has-text("Verify Email")');

    await expect(page.locator("text=Verification code sent")).toBeVisible({
      timeout: 10000,
    });

    // 2. Fetch OTP from DB
    // Wait a bit for DB update
    await page.waitForTimeout(2000);

    const { data: manager } = await supabase
      .from("managers")
      .select("otp_code")
      .eq("email", setupEmail)
      .single();

    expect(manager).not.toBeNull();
    expect(manager?.otp_code).toBeTruthy();
    const otp = manager?.otp_code;

    // 3. Enter OTP
    await page.fill('input[id="otp"]', otp);
    await page.click('button:has-text("Verify Code")');

    // 4. Setup Password
    await expect(page.locator("text=New Password")).toBeVisible();
    await page.fill('input[id="password"]', "TestPass123!");
    await page.fill('input[id="confirmPassword"]', "TestPass123!");
    await page.click('button:has-text("Create Account")');

    // 5. Verify Redirect/Login
    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/manager\/dashboard/, { timeout: 15000 });
  });

  test("3. Admin Login & View Managers", async ({ page }) => {
    const adminEmail = `admin.${Date.now()}@example.com`;
    const adminPassword = "AdminPass123!";

    // Create Admin User
    const { data: user, error: createError } =
      await supabase.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
      });
    expect(createError).toBeNull();

    await page.goto("/admin/login");

    await page.fill('input[id="email"]', adminEmail);
    await page.fill('input[id="password"]', adminPassword);
    await page.click('button:has-text("Sign In")');

    // Should redirect to /admin
    await expect(page).toHaveURL(/\/admin/);

    // Should redirect to /admin
    await expect(page).toHaveURL(/\/admin/);

    // Click Managers Tab
    await page.click('button[role="tab"]:has-text("Managers")');

    // Check if managers list is visible
    // We can look for the ManagersList component content, e.g. a table or a specific header if it exists.
    // Assuming ManagersList has some unique text or we just wait for the tab content.
    await expect(
      page.locator('div[role="tabpanel"][data-state="active"]')
    ).toBeVisible();
  });
});
