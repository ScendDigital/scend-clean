import Link from "next/link";
import {
  BookOpen, Code2, BriefcaseBusiness,
  Workflow, ArrowRight, CheckCircle2, FileText
} from "lucide-react";

const services = [
  {
    icon: BookOpen,
    number: "01",
    title: "Scend Publishing",
    tagline: "Your story deserves a professional finish.",
    description:
      "From manuscript to marketplace, we help authors prepare their work with confidence and care.",
    features: [
      "Editing and proofreading",
      "Cover design and book formatting",
      "ISBN and publication support",
      "Paperback and eBook preparation",
      "Book marketing and launch support"
    ],
    href: "/publishing-services",
    cta: "Explore Publishing Services"
  },
  {
    icon: Code2,
    number: "02",
    title: "Digital Solutions",
    tagline: "Technology built around real needs.",
    description:
      "Practical websites, digital experiences and tailored software solutions for organisations and growing businesses.",
    features: [
      "Business websites",
      "Web application development",
      "Digital tool development",
      "Website enhancements",
      "Workflow-focused software"
    ],
    href: "/contact",
    cta: "Discuss a Digital Project"
  },
  {
    icon: BriefcaseBusiness,
    number: "03",
    title: "Payroll & HR Technology",
    tagline: "Smarter systems. Stronger processes.",
    description:
      "Technology-focused payroll and HR solutions designed around accurate processing, reporting and operational control.",
    features: [
      "Payroll workflow analysis",
      "Payroll reporting and reconciliation",
      "HR and payroll system design",
      "Process automation",
      "Compliance-oriented functionality"
    ],
    href: "/contact",
    cta: "Enquire About Payroll Solutions"
  },
  {
    icon: Workflow,
    number: "04",
    title: "Digital Tools & Business Support",
    tagline: "Making everyday decisions easier.",
    description:
      "Scend develops practical tools that make information more accessible and support informed financial decisions.",
    features: [
      "Tax calculation tools",
      "Loan affordability tools",
      "UIF information and calculations",
      "Price comparison tools",
      "Digital process improvements"
    ],
    href: "/contact",
    cta: "Talk to Scend"
  },
  {
    icon: FileText,
    number: "05",
    title: "SARS Submission Query Support",
    tagline: "A trusted second opinion when SARS comes back with questions.",
    description:
      "Received a SARS query about a payroll or tax submission? We help you understand the request, review the information submitted and supporting documents, and identify practical next steps—so you can prepare a clear, confident response.",
    features: [
      "Understand what SARS is asking for",
      "Review payroll submission information and supporting documents",
      "Identify gaps and practical next steps",
      "Prepare a clear, considered response",
      "Get a second opinion before you reply"
    ],
    href: "/contact",
    cta: "Get Support With a SARS Query"
  }
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-gray-100 px-3 py-5 text-[#242a32] sm:px-6 sm:py-8">
      <div className="mx-auto max-w-7xl space-y-8">
      <section className="rounded-3xl bg-gradient-to-br from-pink-50 via-white to-white px-6 py-10 shadow-sm ring-1 ring-pink-100 sm:px-10 sm:py-14">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-pink-600">
            SCEND (PTY) LTD
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight tracking-tight text-pink-600 sm:text-5xl">
            Real Expertise.
            <span className="block">
              Meaningful Solutions.
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Publishing, technology and practical digital solutions
            designed to help individuals, authors and businesses
            move forward with confidence.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link href="#our-services"
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-pink-600 px-6 py-3 text-center font-semibold text-white shadow-sm transition hover:bg-pink-700 focus:outline-none focus:ring-4 focus:ring-pink-100">
              Explore Our Services
            </Link>
            <Link href="/contact"
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-pink-200 bg-white px-6 py-3 text-center font-semibold text-pink-700 transition hover:bg-pink-50 focus:outline-none focus:ring-4 focus:ring-pink-100">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      <section id="our-services" className="rounded-3xl bg-white px-6 py-10 shadow-sm ring-1 ring-gray-200/70 sm:px-10 sm:py-14">
        <div className="mb-9 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-pink-600">
            What We Do
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Services Built Around You
          </h2>
          <p className="mt-3 leading-7 text-slate-600">
            Whether you are publishing a book, exploring a digital
            solution or improving business processes, Scend brings
            practical thinking and a commitment to quality.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <article key={service.number}
                className={`group flex flex-col rounded-2xl border border-gray-200/70 bg-white p-6 shadow-sm transition hover:border-pink-200 hover:shadow-md sm:p-7 ${service.number === "05" ? "md:col-span-2" : ""}`}>
                <div className="flex items-start justify-between">
                  <div className="rounded-xl bg-pink-50 p-3.5 text-pink-700">
                    <Icon size={26} strokeWidth={1.8} />
                  </div>
                  <span className="text-3xl font-semibold text-pink-100">
                    {service.number}
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-bold text-slate-900 sm:text-2xl">
                  {service.title}
                </h3>
                <p className="mt-2 font-semibold text-pink-700">
                  {service.tagline}
                </p>
                <p className="mt-3 leading-7 text-slate-600">
                  {service.description}
                </p>
                <ul className="mt-5 space-y-3">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-slate-700">
                      <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-pink-600" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-9">
                  <Link href={service.href}
                    className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-pink-600 px-5 py-3 font-semibold text-white transition hover:bg-pink-700 focus:outline-none focus:ring-4 focus:ring-pink-100">
                    {service.cta}
                    <ArrowRight size={17} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="rounded-3xl bg-gradient-to-br from-pink-50 via-white to-white px-6 py-10 text-center shadow-sm ring-1 ring-pink-100 sm:px-10 sm:py-12">
        <h2 className="text-3xl font-bold tracking-tight text-pink-600 sm:text-4xl">
          Have a Project in Mind?
        </h2>
        <p className="mx-auto mt-3 max-w-xl leading-7 text-slate-600">
          Tell us what you want to achieve. We will discuss your
          requirements and the appropriate next steps.
        </p>
        <Link href="/contact"
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-pink-600 px-7 py-3 font-semibold text-white shadow-sm transition hover:bg-pink-700 focus:outline-none focus:ring-4 focus:ring-pink-100">
          Let's Talk About Your Project
        </Link>
        <p className="mt-6 text-sm text-slate-500">
          Scend — We Got You Covered
        </p>
      </section>
      </div>
    </main>
  );
}
