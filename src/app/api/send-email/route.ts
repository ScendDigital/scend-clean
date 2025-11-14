export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

type Payload = { to: string; subject: string; text?: string; html?: string };

export async function POST(req: Request) {
  try {
    const { to, subject, text, html }: Payload = await req.json();
    if (!to || !subject || (!text && !html)) {
      return NextResponse.json(
        { ok: false, error: "Missing 'to', 'subject', and one of 'text' or 'html'." },
        { status: 400 }
      );
    }

    const host = process.env.SMTP_HOST!;
    const port = Number(process.env.SMTP_PORT ?? 587);
    const user = process.env.SMTP_USER!;
    const pass = process.env.SMTP_PASS!;
    const from = process.env.SMTP_FROM ?? user;
    if (!host || !user || !pass) {
      return NextResponse.json(
        { ok: false, error: "SMTP env vars missing (SMTP_HOST, SMTP_USER, SMTP_PASS)." },
        { status: 500 }
      );
    }

    const secure = port === 465; // 465=SSL, 587/25 STARTTLS/plain
    const transporter = nodemailer.createTransport({ host, port, secure, auth: { user, pass } });

    await transporter.verify(); // clear error if auth/network wrong

    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
      headers: { "X-Scend-Env": process.env.NODE_ENV ?? "development" },
      replyTo: from,
    });

    console.log("SMTP response:", {
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
      response: info.response,
      envelope: info.envelope,
    });

    const ok = Array.isArray(info.accepted) && info.accepted.length > 0 && (info.rejected?.length ?? 0) === 0;
    return NextResponse.json(
      { ok, id: info.messageId, accepted: info.accepted, rejected: info.rejected, response: info.response },
      { status: ok ? 200 : 502 }
    );
  } catch (e: any) {
    console.error("send-email error:", e);
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
