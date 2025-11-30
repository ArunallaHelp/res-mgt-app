# Test Cases for Flood Relief Education App

This document outlines the manual test cases for the core features of the Flood Relief Education App, specifically focusing on Manager workflows and Admin capabilities.

## 1. Manager Registration (Public)

**Pre-conditions:** None.

| ID  | Test Case               | Steps                                                                                                                      | Expected Result                                                                                                             |
| --- | ----------------------- | -------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| 1.1 | Successful Registration | 1. Navigate to Manager Registration page.<br>2. Fill in all required fields (Name, Email, Phone, etc.).<br>3. Submit form. | Form submits successfully. Success message shown. Data is stored in `managers` table with `verification_status: 'pending'`. |
| 1.2 | Validation Error        | 1. Navigate to Manager Registration page.<br>2. Leave required fields empty.<br>3. Submit form.                            | Form validation errors are displayed. Form is not submitted.                                                                |
| 1.3 | Duplicate Email         | 1. Register with an email that already exists in `managers` table.<br>2. Submit form.                                      | Error message indicating email already in use.                                                                              |

## 2. Manager Onboarding / Setup (Auth)

**Pre-conditions:** A manager record exists in the `managers` table with `verification_status: 'pending'` (or 'approved' if manual approval is required first).

| ID  | Test Case                   | Steps                                                                                   | Expected Result                                                                                 |
| --- | --------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| 2.1 | Request OTP (Valid)         | 1. Navigate to `/manager/setup`.<br>2. Enter registered email.<br>3. Click "Send Code". | Success message. OTP is generated and stored in DB. Email is sent (check logs/mailtrap).        |
| 2.2 | Request OTP (Invalid Email) | 1. Enter an email not in `managers` table.<br>2. Click "Send Code".                     | Error message: "Email not found".                                                               |
| 2.3 | Verify OTP (Valid)          | 1. Enter valid OTP received in email.<br>2. Click "Verify".                             | OTP is verified. User proceeds to Password Setup step.                                          |
| 2.4 | Verify OTP (Invalid)        | 1. Enter incorrect OTP.<br>2. Click "Verify".                                           | Error message: "Invalid verification code".                                                     |
| 2.5 | Verify OTP (Expired)        | 1. Wait 15 minutes after requesting OTP.<br>2. Enter OTP.<br>3. Click "Verify".         | Error message: "Verification code expired".                                                     |
| 2.6 | Complete Setup              | 1. After OTP verification, enter Password.<br>2. Click "Create Account".                | Auth user is created in Supabase. Manager record updated to `verified`. User is auto-logged in. |
| 2.7 | Magic Link Flow             | 1. Click Magic Link from email (simulated).<br>2. Page loads.                           | Email and OTP fields are pre-filled. User can proceed directly to verification/password setup.  |

## 3. Admin: View & Manage Managers

**Pre-conditions:** Logged in as Admin.

| ID  | Test Case            | Steps                                                                                                          | Expected Result                                                    |
| --- | -------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| 3.1 | View Managers List   | 1. Navigate to Admin Dashboard -> Managers.<br>2. Observe list.                                                | List of managers is displayed. RLS policy allows Admin to see all. |
| 3.2 | View Manager Details | 1. Click on a manager from the list.                                                                           | Detailed view of manager (profile, groups, tags) is shown.         |
| 3.3 | RLS Security Check   | 1. Log in as a non-admin user (or anonymous).<br>2. Attempt to fetch `managers` table via API/Supabase client. | Access denied (empty list or error), ensuring data privacy.        |

## 4. Admin: Manager Groups & Tags

**Pre-conditions:** Logged in as Admin.

| ID  | Test Case            | Steps                                                                                                            | Expected Result                                  |
| --- | -------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| 4.1 | Create Group         | 1. Navigate to Groups section.<br>2. Click "Create Group".<br>3. Enter name (e.g., "Math Teachers").<br>4. Save. | Group is created and appears in list.            |
| 4.2 | Add Manager to Group | 1. Select a Group.<br>2. Add a Manager to it.                                                                    | Manager is linked to the group.                  |
| 4.3 | Add Tags to Manager  | 1. Select a Manager.<br>2. Add tags (e.g., "Urgent", "Verified").                                                | Tags are saved and displayed on Manager profile. |

## Automated Testing Recommendations

Since there is currently no automated testing infrastructure, we recommend setting up the following:

1.  **Unit/Integration Tests (Jest + React Testing Library)**:

    - Test `ManagerSetupForm` validation logic.
    - Test `manager-auth.ts` server actions (requires mocking Supabase).

2.  **E2E Tests (Playwright)**:
    - Simulate the full user flow: Registration -> Admin View -> Manager Setup -> Login.
    - This is the most robust way to "cover all major cases".
