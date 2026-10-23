import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mail, MessageCircle, Phone } from "lucide-react";

const directors = [
  {
    name: "Motlatsi Lenyatsa",
    image: "/team/motlatsi-lenyatsa.jpg",
    email: "motlatsi.lenyatsa@gmail.com",
    phone: "072 803 7223",
    phoneLink: "+27728037223",
    whatsapp: "27728037223",
  },
  {
    name: "Thato Lenyatsa",
    image: "/team/thato-lenyatsa.jpg",
    email: "thatosebatjane@yahoo.com",
    phone: "064 651 9166",
    phoneLink: "+27646519166",
    whatsapp: "27646519166",
  },
];

export default function DirectorsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-pink-50/40 px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-10 rounded-3xl border border-pink-100 bg-gradient-to-br from-pink-50 via-white to-gray-50 px-6 py-9 shadow-[0_14px_40px_rgba(31,41,55,0.07)] sm:px-10 sm:py-12">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-pink-700">
            The people behind Scend
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Meet our directors
          </h1>
          <p className="mt-4 max-w-3xl text-[15px] leading-7 text-gray-600">
            Scend Pty Ltd is owned and led by Motlatsi and Thato Lenyatsa. Meet the directors behind Scend and connect with either of them directly.
          </p>
        </header>

        <section aria-label="Scend directors" className="grid gap-6 md:grid-cols-2">
          {directors.map((director) => (
            <article
              key={director.name}
              className="group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-[0_12px_34px_rgba(36,42,50,0.07)] transition duration-200 hover:-translate-y-1 hover:border-pink-200 hover:shadow-[0_18px_42px_rgba(230,0,126,0.14)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 sm:aspect-[16/10]">
                <Image
                  src={director.image}
                  alt={`Portrait of ${director.name}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-top transition duration-500 group-hover:scale-[1.02]"
                  priority
                />
              </div>
              <div className="p-6 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-pink-700">
                  Co-owner and Director
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">
                  {director.name}
                </h2>
                <p className="mt-1 text-sm text-gray-600">Scend Pty Ltd</p>

                <div className="mt-6 flex flex-wrap gap-2.5">
                  <a
                    href={`mailto:${director.email}`}
                    className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm font-medium text-gray-700 transition hover:border-pink-200 hover:bg-pink-50 hover:text-pink-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-700"
                  >
                    <Mail aria-hidden="true" size={16} /> Email
                  </a>
                  <a
                    href={`https://wa.me/${director.whatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`WhatsApp ${director.name}`}
                    className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm font-medium text-gray-700 transition hover:border-pink-200 hover:bg-pink-50 hover:text-pink-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-700"
                  >
                    <MessageCircle aria-hidden="true" size={16} /> WhatsApp
                  </a>
                  <a
                    href={`tel:${director.phoneLink}`}
                    className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm font-medium text-gray-700 transition hover:border-pink-200 hover:bg-pink-50 hover:text-pink-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-700"
                  >
                    <Phone aria-hidden="true" size={16} /> {director.phone}
                  </a>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="mt-10 flex flex-col gap-4 rounded-3xl border border-pink-100 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">How can we help?</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Send an enquiry, question, compliment or feedback to Scend.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-pink-700 px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_22px_rgba(230,0,126,0.20)] transition hover:-translate-y-0.5 hover:bg-pink-800 hover:shadow-[0_12px_30px_rgba(230,0,126,0.30)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-700"
          >
            Contact Scend <ArrowRight aria-hidden="true" size={16} />
          </Link>
        </section>
      </div>
    </main>
  );
}
