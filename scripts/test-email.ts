import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789');

async function main() {
  console.log('Sending test email...');
  const from = process.env.RESEND_FROM_EMAIL || 'noreply@petsaathi.com';
  
  try {
    const data = await resend.emails.send({
      from,
      to: ['delivered@resend.dev'], // Safe testing address
      subject: 'PetSaathi Production Readiness Test',
      html: '<p>If you receive this, Resend domain verification is successful!</p>'
    });
    console.log('✅ Email sent successfully:', data);
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    process.exit(1);
  }
}

main();
