import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { subject, email, message } = req.body;

    await resend.emails.send({
        from: "Contact <noreply@waellaataoui.tn>",
        to: "laataouiwael@gmail.com",
        subject: subject || "New contact form submission",
        html: `
            <h2>New Contact Message</h2>
            <p><strong>From:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
        `,
    });

    return res.status(200).json({ success: true });
}
