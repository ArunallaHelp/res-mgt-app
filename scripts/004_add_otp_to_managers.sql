-- Add OTP columns to managers table
ALTER TABLE managers 
ADD COLUMN IF NOT EXISTS otp_code text,
ADD COLUMN IF NOT EXISTS otp_expires_at timestamp with time zone;
