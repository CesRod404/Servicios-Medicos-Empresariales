import { Resend } from 'resend';
import { NextResponse } from 'next/server';

// El process.env.RESEND_API_KEY será leído automáticamente por el SDK de Resend o lo podemos pasar por si acaso
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { companyName, email, phone, message } = await request.json();

    const { data, error } = await resend.emails.send({
      from: 'Salud Laboral <onboarding@resend.dev>',
      // Usaremos el correo real del administrador validado en el portal de Resend.
      to: ['cesarnef@outlook.com'], 
      subject: 'Nuevo prospecto: Agenda tu cita',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #2563eb;">Nuevo prospecto desde la Landing Page</h2>
            <hr />
            <p><strong>Empresa:</strong> ${companyName}</p>
            <p><strong>Correo de contacto:</strong> ${email}</p>
            <p><strong>Teléfono:</strong> ${phone || 'No proporcionado'}</p>
            <p><strong>Requerimientos:</strong></p>
            <blockquote style="background-color: #f8fafc; padding: 10px; border-left: 4px solid #cbd5e1;">
                ${message}
            </blockquote>
        </div>
      `
    });

    if (error) {
      console.error("Resend Error:", error);
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
