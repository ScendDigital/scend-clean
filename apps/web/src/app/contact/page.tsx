import ContactForm from "@/components/ContactForm";
import { Mail, MapPin, MessageCircle } from "lucide-react";

const contactOptions = [
  {
    title: "Email",
    value: "motlatsi.lenyatsa@gmail.com",
    href: "mailto:motlatsi.lenyatsa@gmail.com",
    note: "For detailed questions and enquiries",
    icon: Mail,
  },
  {
    title: "WhatsApp",
    value: "072 803 7223",
    href: "https://wa.me/27728037223",
    note: "For a quick message or follow-up",
    icon: MessageCircle,
  },
];

export default function ContactPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <header className="mb-8 overflow-hidden rounded-3xl border border-pink-100 bg-gradient-to-br from-pink-50 via-white to-gray-50 px-6 py-8 shadow-[0_14px_40px_rgba(31,41,55,0.07)] sm:px-9 sm:py-10">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-pink-700">
          We are here to help
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-pink-700 sm:text-4xl">
          Contact Scend
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-7 text-gray-600">
          Send an enquiry, ask a question, share feedback or a compliment. Choose
          whether to prepare your message for email or WhatsApp.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.65fr)]">
        <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-[0_12px_34px_rgba(36,42,50,0.06)] sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold tracking-tight text-gray-900">
              Send us a message
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              We will open your selected app with the message ready to send.
            </p>
          </div>
          <ContactForm />
        </section>

        <aside className="space-y-5">
          <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-[0_12px_34px_rgba(36,42,50,0.06)] sm:p-7">
            <h2 className="text-lg font-semibold text-gray-900">Reach us directly</h2>
            <div className="mt-5 space-y-3">
              {contactOptions.map(({ title, value, href, note, icon: Icon }) => (
                <a
                  key={title}
                  href={href}
                  target={title === "WhatsApp" ? "_blank" : undefined}
                  rel={title === "WhatsApp" ? "noreferrer" : undefined}
                  className="group flex items-start gap-4 rounded-2xl border border-gray-100 bg-gray-50/70 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-pink-200 hover:bg-white hover:shadow-[0_12px_30px_rgba(230,0,126,0.14)]"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-pink-700 ring-1 ring-pink-100 transition group-hover:bg-pink-100">
                    <Icon aria-hidden="true" size={20} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-gray-900">{title}</span>
                    <span className="mt-0.5 block break-all text-sm font-medium text-pink-700">{value}</span>
                    <span className="mt-1 block text-xs leading-5 text-gray-500">{note}</span>
                  </span>
                </a>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-pink-100 bg-gradient-to-br from-pink-50/80 via-white to-gray-50 p-6 sm:p-7">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-pink-700 shadow-sm ring-1 ring-pink-100">
                <MapPin aria-hidden="true" size={19} />
              </span>
              <div>
                <h2 className="text-base font-semibold text-gray-900">Scend Pty Ltd</h2>
                <address className="mt-2 not-italic text-sm leading-6 text-gray-600">
                  11 Ulster Road, 51 Mervlei Complex<br />
                  Meredale, Johannesburg 2091
                </address>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}
