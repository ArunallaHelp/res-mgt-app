'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import db from "@/lib/db"
import { sendOtpEmail } from '@/lib/email'
import { randomInt } from 'crypto'

// Helper to generate 6-digit OTP
function generateOtp() {
  return randomInt(100000, 999999).toString()
}

export async function sendVerificationEmail(email: string) {
  // const supabase = createAdminClient() // Not needed for DB

  try {
    // 1. Check if manager exists
    const managers = await db.managers.findMany({
      where: { email },
      select: { id: true, email: true, verification_status: true },
      take: 1,
    })
    const manager = managers[0]

    if (!manager) {
      return {
        success: false,
        error: 'Email not found in manager records. Please contact support.'
      }
    }

    // 2. Generate OTP and expiry
    const otp = generateOtp()
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 mins

    // 3. Store OTP in DB
    await db.managers.update({
      where: { id: manager.id },
      data: {
        otp_code: otp,
        otp_expires_at: expiresAt,
      },
    })

    // 4. Send Email
    const emailResult = await sendOtpEmail(email, otp)
    if (!emailResult.success) {
      return {
        success: false,
        error: 'Failed to send verification email.'
      }
    }

    return {
      success: true,
      message: 'Verification code sent.'
    }
  } catch (error) {
    console.error('Error in sendVerificationEmail:', error)
    return {
      success: false,
      error: 'An unexpected error occurred.'
    }
  }
}

export async function verifyManagerOtp(email: string, otp: string) {
  // const supabase = createAdminClient() // Not needed for DB

  try {
    const managers = await db.managers.findMany({
      where: { email },
      select: { otp_code: true, otp_expires_at: true },
      take: 1,
    })
    const manager = managers[0]

    if (!manager) {
      return { success: false, error: 'Invalid request.' }
    }

    if (manager.otp_code !== otp) {
      return { success: false, error: 'Invalid verification code.' }
    }

    if (!manager.otp_expires_at || new Date(manager.otp_expires_at) < new Date()) {
      return { success: false, error: 'Verification code expired.' }
    }

    return { success: true }
  } catch (error) {
    console.error('Error verifying OTP:', error)
    return { success: false, error: 'An unexpected error occurred.' }
  }
}

export async function createManagerAccount(email: string, password: string, otp: string) {
  const supabase = createAdminClient()

  try {
    // 1. Re-verify OTP (Security check)
    const verifyResult = await verifyManagerOtp(email, otp)
    if (!verifyResult.success) {
      return verifyResult
    }

    // 2. Create Supabase Auth User
    const { data: authUser, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true // Auto-confirm email since we verified it via OTP
    })

    if (createError) {
      // Handle case where user might already exist
      if (createError.message.includes('already registered')) {
         // If user exists, we might want to just update password? 
         // For now, let's return error or handle gracefully.
         // Requirement: "if email verified then open password add page to create account"
         // If account exists, maybe we should update it?
         // Let's try updating if create fails.
         // const { data: user } = await supabase.from('auth.users').select('id').eq('email', email).single()
         // Note: accessing auth.users directly via client is not standard, better to use admin.updateUserById if we had ID.
         // But we don't have ID easily without listing.
         // Let's just return the error for now, assuming clean slate for "onboarding".
         return { success: false, error: 'Account already exists. Please log in.' }
      }
      return { success: false, error: createError.message }
    }

    // 3. Update Manager Record (Clear OTP, set verified)
    await db.managers.updateMany({
      where: { email },
      data: {
        verification_status: 'verified',
        otp_code: null,
        otp_expires_at: null,
      },
    })



    // 4. Auto-login
    const supabaseServer = await createClient()
    const { error: signInError } = await supabaseServer.auth.signInWithPassword({
      email,
      password
    })

    if (signInError) {
      console.error('Error signing in after creation:', signInError)
      return { success: true, message: 'Account created, but failed to sign in automatically. Please log in.' }
    }

    return { success: true }
  } catch (error) {
    console.error('Error creating account:', error)
    return { success: false, error: 'An unexpected error occurred.' }
  }
}
