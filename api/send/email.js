import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { email, nome } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email obrigatório" });
    }

    const data = await resend.emails.send({
      from: "Open Screener <app@openadvisor.com.br>",
      to: [email],
      subject: "Teste Open Screener",
      html: `<p>Olá ${nome || "investidor"}, tudo certo?</p>`
    });

    return res.status(200).json({ success: true, data });

  } catch (error) {
    console.error("ERRO:", error);
    return res.status(500).json({ error: error.message });
  }
}