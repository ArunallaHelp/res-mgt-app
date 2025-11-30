import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendOtpEmail(email: string, otp: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Arunalla App <onboarding@arunalla.help>',
      to: [email],
      subject: 'Your Verification Code',
      html: `
        <h1>Verification Code</h1>
        <p>Your verification code is: <strong>${otp}</strong></p>
        <p>This code will expire in 15 minutes.</p>
        <p>Or click the link below to verify automatically:</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/manager/setup?email=${encodeURIComponent(email)}&otp=${otp}">Verify Account</a>
      `,
    })

    if (error) {
      console.error('Error sending email:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error }
  }
}
