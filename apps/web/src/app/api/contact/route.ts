import { NextResponse } from "next/server";

type ContactBody = {
  name: string;
  email: string;
  phone?: string;
  message: string;
};

function sanitize(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(req: Request) {
  // Parse JSON safely
  let payload: Partial<ContactBody> = {};
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = (payload.name || "").trim();
  const email = (payload.email || "").trim();
  const phone = (payload.phone || "").trim();
  const message = (payload.message || "").trim();

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Missing required fields: name, email, message" },
      { status: 400 }
    );
  }

  // Basic email shape check
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailOk) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  // Sanitize (defensive)
  const safe = {
    name: sanitize(name),
    email: sanitize(email),
    phone: sanitize(phone),
    message: sanitize(message),
  };

  // TODO: send email or store in DB.
  // For now, just log to server console (visible in Vercel logs / local terminal)
  console.log("[CONTACT FORM]", safe);

  return NextResponse.json({ ok: true });
}
