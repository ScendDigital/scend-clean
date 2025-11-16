"use server";

import { NextResponse } from "next/server";

type ContactPayload = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};

export async function POST(req: Request) {
  try {
    const data = (await req.json()) as ContactPayload;
    const { name, email, subject, message } = data;

    // TODO: Plug in real email sending logic here (Resend, Nodemailer, etc.)
    // For now we just log the payload so the route stays safe and type-correct.
    console.log("Contact form submission:", { name, email, subject, message });

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    console.error("send-email error:", e);

    const errorMessage =
      e instanceof Error
        ? e.message
        : typeof e === "string"
          ? e
          : "Unknown error";

    return NextResponse.json(
      { ok: false, error: errorMessage },
      { status: 500 }
    );
  }
}
