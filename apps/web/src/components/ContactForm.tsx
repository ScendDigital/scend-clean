"use client";

import { useState, type FormEvent } from "react";

type Channel = "email" | "whatsapp";

export default function ContactForm() {
  const [channel, setChannel] = useState<Channel>("email");
  const [status, setStatus] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const topic = String(data.get("topic") ?? "General enquiry");
    const message = String(data.get("message") ?? "").trim();
    const body = [
      `Name: ${name}`,
      email ? `Email: ${email}` : "",
      phone ? `Phone: ${phone}` : "",
      `Topic: ${topic}`,
      "",
      message,
      "",
      "Sent from scend.co.za",
    ]
      .filter((line) => line !== "")
      .join("\n");

    if (channel === "email") {
      const subject = encodeURIComponent(`[Scend Contact] ${topic} - ${name}`);
      const mailto = `mailto:motlatsi.lenyatsa@gmail.com?subject=${subject}&body=${encodeURIComponent(body)}`;
      setStatus("Your email app is opening with the message prepared. Press Send there to deliver it.");
      window.location.href = mailto;
      return;
    }

    const whatsapp = `https://wa.me/27728037223?text=${encodeURIComponent(body)}`;
    setStatus("WhatsApp is opening with the message prepared. Press Send there to deliver it.");
    window.open(whatsapp, "_blank", "noopener,noreferrer");
  }

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-sm text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-pink-500 focus:ring-4 focus:ring-pink-100";
  const labelClass = "block text-sm font-medium text-gray-800";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          Your name <span className="text-pink-700">*</span>
          <input className={inputClass} name="name" autoComplete="name" required maxLength={100} placeholder="e.g. Thabo Mokoena" />
        </label>
        <label className={labelClass}>
          Email address {channel === "email" && <span className="text-pink-700">*</span>}
          <input
            className={inputClass}
            name="email"
            type="email"
            autoComplete="email"
            required={channel === "email"}
            maxLength={254}
            placeholder="you@example.com"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          Phone number <span className="font-normal text-gray-500">(optional)</span>
          <input className={inputClass} name="phone" type="tel" autoComplete="tel" maxLength={30} placeholder="e.g. 07X XXX XXXX" />
        </label>
        <label className={labelClass}>
          What is this about?
          <select className={inputClass} name="topic" defaultValue="General enquiry">
            <option>General enquiry</option>
            <option>Question</option>
            <option>Compliment</option>
            <option>Feedback or suggestion</option>
            <option>Website or tool support</option>
            <option>Publishing</option>
            <option>Partnership</option>
            <option>Other</option>
          </select>
        </label>
      </div>

      <label className={labelClass}>
        Your message <span className="text-pink-700">*</span>
        <textarea
          className={`${inputClass} min-h-36 resize-y leading-6`}
          name="message"
          required
          minLength={5}
          maxLength={5000}
          placeholder="Write your enquiry, question, compliment or feedback..."
        />
        <span className="mt-1 block text-xs font-normal text-gray-500">Please do not include passwords or sensitive financial information.</span>
      </label>

      <fieldset>
        <legend className="text-sm font-medium text-gray-800">How would you like to send it?</legend>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          <label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${channel === "email" ? "border-pink-300 bg-pink-50/70 ring-2 ring-pink-100" : "border-gray-200 bg-white hover:border-pink-200"}`}>
            <input className="mt-0.5 accent-pink-600" type="radio" name="channel" value="email" checked={channel === "email"} onChange={() => { setChannel("email"); setStatus(""); }} />
            <span>
              <span className="block text-sm font-semibold text-gray-900">Email</span>
              <span className="mt-0.5 block text-xs text-gray-600">To motlatsi.lenyatsa@gmail.com</span>
            </span>
          </label>
          <label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${channel === "whatsapp" ? "border-pink-300 bg-pink-50/70 ring-2 ring-pink-100" : "border-gray-200 bg-white hover:border-pink-200"}`}>
            <input className="mt-0.5 accent-pink-600" type="radio" name="channel" value="whatsapp" checked={channel === "whatsapp"} onChange={() => { setChannel("whatsapp"); setStatus(""); }} />
            <span>
              <span className="block text-sm font-semibold text-gray-900">WhatsApp</span>
              <span className="mt-0.5 block text-xs text-gray-600">To 072 803 7223</span>
            </span>
          </label>
        </div>
      </fieldset>

      <button
        type="submit"
        className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-pink-700 px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_22px_rgba(230,0,126,0.20)] transition hover:-translate-y-0.5 hover:bg-pink-800 hover:shadow-[0_12px_30px_rgba(230,0,126,0.30)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-700 sm:w-auto"
      >
        {channel === "email" ? "Send via Email" : "Send via WhatsApp"}
      </button>

      {status && (
        <p role="status" aria-live="polite" className="rounded-xl border border-pink-100 bg-pink-50 px-4 py-3 text-sm leading-6 text-pink-900">
          {status}
        </p>
      )}
      <p className="text-xs leading-5 text-gray-500">
        Your message is not sent until you confirm it in your email or WhatsApp app.
      </p>
    </form>
  );
}
