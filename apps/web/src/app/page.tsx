"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MessageCircle } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.1 * i,
      duration: 0.4,
    },
  }),
};

export default function Contact() {
  return (
    <div className="space-y-14">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--scend-pink-50)] via-white to-white p-8 shadow-sm md:p-12">
        <div className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-[var(--scend-pink-200)]/30 blur-3xl" />
        <div className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-[var(--scend-gray-100)]/60 blur-2xl" />

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative max-w-3xl"
        >
          <h1 className="text-3xl font-bold text-[var(--scend-gray-900)] md:text-4xl">
            Contact Scend
          </h1>
          <p className="mt-3 text-[15px] text-[var(--scend-gray-700)] leading-relaxed">
            We know you are busy with other important matters – let Scend handle this
            one professionally and efficiently for you. Reach out and we will respond
            as soon as possible.
          </p>
        </motion.div>
      </section>

      {/* MAIN GRID */}
      <section>
        <div className="grid gap-8 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          {/* CONTACT FORM (visual, simple & corporate) */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            custom={0}
            className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[var(--scend-gray-200)]/70"
          >
            <h2 className="text-lg font-semibold text-[var(--scend-gray-900)]">
              Send us a message
            </h2>
            <p className="mt-1 text-[14px] text-[var(--scend-gray-700)]">
              Share a brief summary of what you need help with – tools, integration,
              publishing or collaboration.
            </p>

            <form className="mt-5 space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-[13px] font-medium text-[var(--scend-gray-800)]"
                >
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="mt-1 w-full rounded-xl border border-[var(--scend-gray-200)] bg-white px-3 py-2 text-[14px] text-[var(--scend-gray-900)] shadow-sm focus:border-[var(--scend-pink-500)] focus:outline-none focus:ring-1 focus:ring-[var(--scend-pink-500)]"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-[13px] font-medium text-[var(--scend-gray-800)]"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="mt-1 w-full rounded-xl border border-[var(--scend-gray-200)] bg-white px-3 py-2 text-[14px] text-[var(--scend-gray-900)] shadow-sm focus:border-[var(--scend-pink-500)] focus:outline-none focus:ring-1 focus:ring-[var(--scend-pink-500)]"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-[13px] font-medium text-[var(--scend-gray-800)]"
                >
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  className="mt-1 w-full rounded-xl border border-[var(--scend-gray-200)] bg-white px-3 py-2 text-[14px] text-[var(--scend-gray-900)] shadow-sm focus:border-[var(--scend-pink-500)] focus:outline-none focus:ring-1 focus:ring-[var(--scend-pink-500)]"
                  placeholder="e.g. Loan Tool for our HR team"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-[13px] font-medium text-[var(--scend-gray-800)]"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="mt-1 w-full rounded-xl border border-[var(--scend-gray-200)] bg-white px-3 py-2 text-[14px] text-[var(--scend-gray-900)] shadow-sm focus:border-[var(--scend-pink-500)] focus:outline-none focus:ring-1 focus:ring-[var(--scend-pink-500)]"
                  placeholder="Tell us briefly what you need help with..."
                />
              </div>

              <button
                type="submit"
                className="mt-2 inline-flex items-center justify-center rounded-2xl bg-[var(--scend-pink-600)] px-4 py-2 text-[14px] font-semibold text-white hover:bg-[var(--scend-pink-700)]"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Send message
              </button>

              <p className="mt-2 text-[12px] text-[var(--scend-gray-500)]">
                You can also use the direct email and phone details alongside this form.
              </p>
            </form>
          </motion.div>

          {/* CONTACT DETAILS */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            custom={1}
            className="space-y-5"
          >
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[var(--scend-gray-200)]/70">
              <h2 className="text-lg font-semibold text-[var(--scend-gray-900)]">
                Direct contact
              </h2>
              <p className="mt-1 text-[14px] text-[var(--scend-gray-700)]">
                Prefer speaking directly? You&apos;re welcome to call or email us.
              </p>

              <div className="mt-4 space-y-4 text-[14px]">
                {/* Motlatsi */}
                <div>
                  <p className="font-semibold text-[var(--scend-gray-900)]">
                    Motlatsi Lenyatsa
                  </p>
                  <div className="mt-1 flex items-center gap-2 text-[var(--scend-gray-700)]">
                    <Phone className="h-4 w-4" />
                    <a href="tel:+27728037223" className="hover:text-[var(--scend-pink-600)]">
                      072 803 7223
                    </a>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-[var(--scend-gray-700)]">
                    <Mail className="h-4 w-4" />
                    <a
                      href="mailto:motlatsi.lenyatsa@gmail.com"
                      className="hover:text-[var(--scend-pink-600)]"
                    >
                      motlatsi.lenyatsa@gmail.com
                    </a>
                  </div>
                </div>

                {/* Thato */}
                <div>
                  <p className="mt-3 font-semibold text-[var(--scend-gray-900)]">
                    Thato Lenyatsa
                  </p>
                  <div className="mt-1 flex items-center gap-2 text-[var(--scend-gray-700)]">
                    <Phone className="h-4 w-4" />
                    <a href="tel:+27646519166" className="hover:text-[var(--scend-pink-600)]">
                      064 651 9166
                    </a>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-[var(--scend-gray-700)]">
                    <Mail className="h-4 w-4" />
                    <a
                      href="mailto:thatosebatjane@yahoo.com"
                      className="hover:text-[var(--scend-pink-600)]"
                    >
                      thatosebatjane@yahoo.com
                    </a>
                  </div>
                </div>

                {/* Morena */}
                <div>
                  <p className="mt-3 font-semibold text-[var(--scend-gray-900)]">
                    Morena Sehlako
                  </p>
                  <div className="mt-1 flex items-center gap-2 text-[var(--scend-gray-700)]">
                    <Phone className="h-4 w-4" />
                    <a href="tel:+27781363268" className="hover:text-[var(--scend-pink-600)]">
                      078 136 3268
                    </a>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-[var(--scend-gray-700)]">
                    <Mail className="h-4 w-4" />
                    <a
                      href="mailto:morenamcguy@gmail.com"
                      className="hover:text-[var(--scend-pink-600)]"
                    >
                      morenamcguy@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* NOTE / ORGANISATION BLOCK */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              custom={2}
              className="rounded-2xl bg-[var(--scend-pink-50)]/70 p-5"
            >
              <h3 className="text-[15px] font-semibold text-[var(--scend-gray-900)]">
                For organisations & teams
              </h3>
              <p className="mt-1 text-[14px] text-[var(--scend-gray-700)] leading-relaxed">
                If you&apos;re exploring Scend tools for HR, payroll, financial education
                or wellness programmes, feel free to mention this in your message so we
                can tailor our response.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
