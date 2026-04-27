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

export async function sendEmail({ email, subject, text }: EmailTemplateProps) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'workout-logger@resend.dev',
      to: email,
      subject: subject,
      react: <EmailTemplate email={email} text={text} />,
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
