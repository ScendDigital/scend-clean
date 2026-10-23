import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Calculator,
  CarFront,
  Scale,
  ShieldCheck,
} from "lucide-react";

const tools = [
  {
    title: "Tax Tool",
    description:
      "Explore a clear estimate of PAYE, rebates and medical tax credits.",
    href: "/tax",
    label: "Open Tax Tool",
    Icon: Calculator,
    available: true,
  },
  {
    title: "Loan Qualification Tool",
    description:
      "Review an affordability estimate, repayment and key lending factors.",
    href: "/loan",
    label: "Open Loan Tool",
    Icon: CarFront,
    available: true,
  },
  {
    title: "UIF Benefit Estimator",
    description:
      "Estimate UIF benefits and see the documents commonly needed to claim.",
    href: "/uif",
    label: "Open UIF Tool",
    Icon: ShieldCheck,
    available: true,
  },
  {
    title: "Price Compare Tool",
    description:
      "A simpler way to compare prices across South African retailers.",
    href: "/price-compare",
    label: "In development",
    Icon: Scale,
    available: false,
  },
  {
    title: "Publishing",
    description:
      "Plan your book project with a practical publishing checklist for eBook, print and audiobook editions.",
    href: "/publishing",
    label: "Open Publishing Tool",
    Icon: BookOpen,
    available: true,
  },
];

export default function Home() {
  return (
    <div className="w-full space-y-12 pb-10">
      <section className="relative isolate overflow-hidden rounded-[2rem] border border-pink-100 bg-gradient-to-br from-white via-pink-50 to-gray-100 px-6 py-12 shadow-sm sm:px-10 sm:py-16 lg:px-14">
        <div
          aria-hidden="true"
          className="absolute -right-20 -top-24 -z-10 h-72 w-72 rounded-full bg-pink-200/50 blur-3xl"
        />
        <div className="max-w-3xl">
          <span className="inline-flex items-center rounded-full border border-pink-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-pink-700">
            Digital tools by Scend
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Make your next decision with more clarity.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
            Practical tools to help you understand tax, borrowing and UIF, with
            useful guidance for the questions that matter in everyday life.
          </p>
          <Link
            href="#tools"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-pink-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-pink-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-700"
          >
            Explore our tools <ArrowRight aria-hidden="true" size={17} />
          </Link>
        </div>
      </section>

      <section id="tools" className="scroll-mt-8">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-pink-700">
              Scend tools
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Choose a tool to get started
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-gray-600">
            Estimates are for information and planning. Check the relevant
            official guidance or provider before making a financial decision.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {tools.map(({ title, description, href, label, Icon, available }) => {
            const card = (
              <>
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-pink-700 ring-1 ring-pink-100">
                    <Icon aria-hidden="true" size={23} strokeWidth={1.8} />
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      available
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {available ? "Available" : "In development"}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-bold text-gray-900">{title}</h3>
                <p className="mt-2 min-h-12 text-sm leading-6 text-gray-600">
                  {description}
                </p>
                {available && (
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-pink-700">
                    {label}
                    <ArrowRight aria-hidden="true" size={16} />
                  </span>
                )}
              </>
            );

            return available ? (
              <Link
                key={title}
                href={href}
                className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-pink-200 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-700 sm:p-6"
              >
                {card}
              </Link>
            ) : (
              <article
                key={title}
                aria-label={`${title}, in development`}
                className="rounded-2xl border border-gray-200 bg-gray-50/80 p-5 shadow-sm sm:p-6"
              >
                {card}
              </article>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white px-6 py-6 shadow-sm sm:flex sm:items-center sm:justify-between sm:gap-8 sm:px-8">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Built for useful answers</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
            Scend brings practical digital tools and publishing together to make
            information easier to understand and act on.
          </p>
        </div>
        <Link
          href="/about"
          className="mt-5 inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-pink-700 hover:text-pink-800 sm:mt-0"
        >
          About Scend <ArrowRight aria-hidden="true" size={16} />
        </Link>
      </section>
    </div>
  );
}
