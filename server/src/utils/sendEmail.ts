import nodemailer from 'nodemailer';

const sendEmail = async ({ to, subject, html }: { to: string; subject: string; html: string }) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.NODE_MAILER_USER,
            pass: process.env.NODE_MAILER_PASSWORD,
        },
    });

    await transporter.sendMail({
        from: process.env.NODE_MAILER_USER,
        to,
        subject,
        html,
    });
};

export { sendEmail };
