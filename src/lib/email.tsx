import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailTemplateProps {
  email: string;
  subject: string;
  text: string;
}

function EmailTemplate({ email, text }: { email: string; text: string }) {
  return (
    <>
      <h1>Hello {email}!</h1>
      <p>{text}</p>
    </>
  );
}

export async function sendEmail({
  email,
  subject,
  text,
}: EmailTemplateProps): Promise<{ id: string }> {
  const { data, error } = await resend.emails.send({
    from: 'workout-logger@resend.dev',
    to: email,
    subject,
    react: <EmailTemplate email={email} text={text} />,
  });

  if (error || !data) {
    console.error('Failed to send email via Resend', error);
    throw new Error('Failed to send email', { cause: error ?? undefined });
  }

  return { id: data.id };
}
