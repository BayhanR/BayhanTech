import { NextResponse } from "next/server"
import { Resend } from "resend"

interface ContactPayload {
  name?: string
  email?: string
  message?: string
  services?: string[]
}

const getRecipientList = () => {
  const raw =
    process.env.RESEND_CONTACT_RECIPIENTS ||
    process.env.CONTACT_RECIPIENT_EMAIL ||
    process.env.RESEND_DEFAULT_RECIPIENT ||
    process.env.CONTACT_EMAIL

  if (!raw) return []

  return raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.RESEND_FROM_EMAIL
  const recipients = getRecipientList()

  if (!apiKey || !fromEmail || recipients.length === 0) {
    return NextResponse.json(
      {
        error:
          "E-posta yapılandırması eksik. Lütfen RESEND_API_KEY, RESEND_FROM_EMAIL ve RESEND_CONTACT_RECIPIENTS değerlerini .env dosyasında tanımlayın.",
      },
      { status: 500 },
    )
  }

  let payload: ContactPayload
  try {
    payload = (await request.json()) as ContactPayload
  } catch {
    return NextResponse.json({ error: "Geçersiz istek gövdesi." }, { status: 400 })
  }

  const name = payload.name?.trim()
  const email = payload.email?.trim()
  const message = payload.message?.trim()
  const services = payload.services || []

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Lütfen isim, e-posta ve mesaj alanlarını doldurun." },
      { status: 400 },
    )
  }

  const resend = new Resend(apiKey)

  try {
    await resend.emails.send({
      from: fromEmail,
      to: recipients,
      reply_to: email,
      subject: `🎯 Yeni Danışma Talebi - ${name}`,
      html: `
        <!DOCTYPE html>
        <html lang="tr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); padding: 40px 30px; text-align: center;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                        🎯 Yeni Danışma Talebi
                      </h1>
                      <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 14px; opacity: 0.9;">
                        bayhan.tech
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <!-- İletişim Bilgileri -->
                      <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 8px; padding: 25px; margin-bottom: 25px; border-left: 4px solid #dc2626;">
                        <h2 style="margin: 0 0 20px 0; color: #0f172a; font-size: 18px; font-weight: 600; display: flex; align-items: center;">
                          <span style="font-size: 24px; margin-right: 10px;">👤</span>
                          İletişim Bilgileri
                        </h2>
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                              <strong style="color: #64748b; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 5px;">İsim</strong>
                              <span style="color: #0f172a; font-size: 16px; font-weight: 500;">${name}</span>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 12px 0;">
                              <strong style="color: #64748b; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 5px;">E-posta</strong>
                              <a href="mailto:${email}" style="color: #dc2626; font-size: 16px; font-weight: 500; text-decoration: none;">${email}</a>
                            </td>
                          </tr>
                        </table>
                      </div>

                      ${services.length > 0 ? `
                      <!-- Hizmetler -->
                      <div style="background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); border-radius: 8px; padding: 25px; margin-bottom: 25px; border-left: 4px solid #dc2626;">
                        <h2 style="margin: 0 0 20px 0; color: #0f172a; font-size: 18px; font-weight: 600; display: flex; align-items: center;">
                          <span style="font-size: 24px; margin-right: 10px;">✨</span>
                          İlgilendiği Hizmetler
                        </h2>
                        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                          ${services.map((service) => `
                            <span style="display: inline-block; background-color: #ffffff; color: #dc2626; padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 500; border: 1px solid #fecaca;">
                              ${service}
                            </span>
                          `).join("")}
                        </div>
                      </div>
                      ` : ""}

                      <!-- Mesaj -->
                      <div style="background: #ffffff; border-radius: 8px; padding: 25px; border: 2px solid #e2e8f0;">
                        <h2 style="margin: 0 0 20px 0; color: #0f172a; font-size: 18px; font-weight: 600; display: flex; align-items: center;">
                          <span style="font-size: 24px; margin-right: 10px;">💬</span>
                          Mesaj
                        </h2>
                        <div style="background: #f8fafc; border-left: 4px solid #dc2626; padding: 20px; border-radius: 6px; white-space: pre-line; color: #334155; font-size: 15px; line-height: 1.6;">
                          ${message.replace(/\n/g, "<br>")}
                        </div>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                      <p style="margin: 0; color: #64748b; font-size: 13px; line-height: 1.6;">
                        Bu e-posta <a href="https://bayhan.tech" style="color: #dc2626; text-decoration: none; font-weight: 500;">bayhan.tech</a> web sitesinden gönderilmiştir.<br>
                        <span style="color: #94a3b8; font-size: 12px; margin-top: 10px; display: block;">
                          ${new Date().toLocaleString("tr-TR", { dateStyle: "long", timeStyle: "short" })}
                        </span>
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Resend API error:", error)
    return NextResponse.json(
      { error: "Mesaj gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin." },
      { status: 500 },
    )
  }
}


