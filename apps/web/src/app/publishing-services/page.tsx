"use client";

import { useState, type FormEvent } from "react";

const services = [
  {
    title: "Manuscript Editing",
    description:
      "Editorial review, language improvement, structure and clarity."
  },
  {
    title: "Proofreading",
    description:
      "Final checks for spelling, grammar, punctuation and consistency."
  },
  {
    title: "Book Cover Design",
    description:
      "Professional covers prepared for your chosen publication formats."
  },
  {
    title: "Book Formatting",
    description:
      "Print-ready interiors and eBook formatting, including EPUB preparation."
  },
  {
    title: "ISBN Assistance",
    description:
      "Support with ISBN requirements and publication metadata."
  },
  {
    title: "Publishing Assistance",
    description:
      "Preparation and submission support for selected publishing platforms."
  },
  {
    title: "Book Marketing Support",
    description:
      "Book descriptions, launch preparation and promotional materials."
  },
  {
    title: "Complete Publishing Package",
    description:
      "A tailored combination of editorial, design and publishing services."
  }
];

const books = [
  {
    title: "Silent Pain",
    subtitle:
      "The Untold Struggles of South Africa's Black Men",
    author: "Motlatsi Charles Lenyatsa",
    url: "https://www.amazon.com/s?k=Silent+Pain+Motlatsi+Charles+Lenyatsa"
  },
  {
    title: "A Letter From a Divorced Woman",
    subtitle:
      "What I Lost, What I Learned, and How I Found Myself Again",
    author: "Motlatsi Charles Lenyatsa",
    url: "https://www.amazon.com/dp/1048364801"
  }
];

export default function PublishingServicesPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    title: "",
    genre: "",
    wordCount: "",
    stage: "Completed manuscript",
    service: "Complete Publishing Package",
    format: "Paperback and eBook",
    message: ""
  });

  const update = (key: keyof typeof form, value: string) =>
    setForm((previous) => ({ ...previous, [key]: value }));

  const enquiry = () =>
    [
      "SCEND PUBLISHING ENQUIRY",
      "",
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Phone: ${form.phone}`,
      `Book title: ${form.title}`,
      `Genre: ${form.genre}`,
      `Approximate word count: ${form.wordCount}`,
      `Manuscript stage: ${form.stage}`,
      `Service: ${form.service}`,
      `Format: ${form.format}`,
      "",
      "Project description:",
      form.message
    ].join("\n");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const subject = encodeURIComponent(
      `Publishing Quote Request - ${form.title || form.name}`
    );

    const body = encodeURIComponent(enquiry());

    window.location.href =
      `mailto:info@scend.co.za?subject=${subject}&body=${body}`;
  }

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900";

  return (
    <main className="min-h-screen bg-stone-50 text-gray-900">
      <section className="bg-[#17362e] px-6 py-20 text-center text-white">
        <p className="mb-3 text-sm font-semibold tracking-widest text-amber-200">
          SCEND PUBLISHING
        </p>

        <h1 className="mx-auto max-w-4xl text-4xl font-bold md:text-6xl">
          Your Story. Our Expertise. Published.
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-stone-200">
          Professional editing, book design, formatting and
          publishing assistance for aspiring and established authors.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a
            href="#quote"
            className="rounded-lg bg-amber-200 px-7 py-3 font-semibold text-[#17362e]"
          >
            Request a Publishing Quote
          </a>

          <a
            href="#portfolio"
            className="rounded-lg border border-white px-7 py-3 font-semibold"
          >
            View Our Published Works
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-center text-3xl font-bold">
          Our Publishing Services
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-center text-gray-600">
          Every manuscript is different. We assess your publishing
          requirements and prepare a quotation based on the services needed.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <article
              key={service.title}
              className="rounded-xl border bg-white p-6 shadow-sm"
            >
              <h3 className="text-lg font-bold text-[#17362e]">
                {service.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                {service.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section id="portfolio" className="bg-white px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold">
            Our Published Works
          </h2>

          <p className="mt-3 text-center text-gray-600">
            Explore books by Motlatsi Charles Lenyatsa,
            published under Scend Publishing.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {books.map((book) => (
              <article
                key={book.title}
                className="rounded-xl border bg-stone-50 p-7"
              >
                <h3 className="text-xl font-bold">{book.title}</h3>
                <p className="mt-2 text-gray-600">{book.subtitle}</p>
                <p className="mt-4 text-sm">By {book.author}</p>
                <a
                  href={book.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-block rounded-lg bg-[#17362e] px-5 py-3 text-white"
                >
                  Explore on Amazon
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="quote" className="mx-auto max-w-3xl px-6 py-16">
        <h2 className="text-center text-3xl font-bold">
          Request a Publishing Quote
        </h2>

        <p className="mt-4 text-center text-gray-600">
          Tell us about your manuscript and the assistance you need.
          We will review your enquiry before discussing a quotation.
        </p>

        <form onSubmit={submit} className="mt-10 space-y-5 rounded-xl border bg-white p-6 shadow-sm">
          {[
            ["Full Name", "name"],
            ["Email Address", "email"],
            ["Phone Number", "phone"],
            ["Book Title", "title"],
            ["Genre", "genre"],
            ["Approximate Word Count", "wordCount"]
          ].map(([label, key]) => (
            <label key={key} className="block">
              <span className="mb-2 block font-medium">{label}</span>
              <input
                className={inputClass}
                type={key === "email" ? "email" : "text"}
                required={["name", "email", "title"].includes(key)}
                value={form[key as keyof typeof form]}
                onChange={(event) =>
                  update(key as keyof typeof form, event.target.value)
                }
              />
            </label>
          ))}

          {[
            {
              label: "Manuscript Stage",
              key: "stage",
              options: [
                "Idea stage",
                "Draft in progress",
                "Completed manuscript",
                "Previously published"
              ]
            },
            {
              label: "Service Required",
              key: "service",
              options: services.map((service) => service.title)
            },
            {
              label: "Preferred Format",
              key: "format",
              options: [
                "Paperback and eBook",
                "Paperback only",
                "eBook only",
                "Audiobook enquiry"
              ]
            }
          ].map((field) => (
            <label key={field.key} className="block">
              <span className="mb-2 block font-medium">{field.label}</span>
              <select
                className={inputClass}
                value={form[field.key as keyof typeof form]}
                onChange={(event) =>
                  update(
                    field.key as keyof typeof form,
                    event.target.value
                  )
                }
              >
                {field.options.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
          ))}

          <label className="block">
            <span className="mb-2 block font-medium">
              Tell Us About Your Book
            </span>
            <textarea
              className={inputClass}
              rows={5}
              value={form.message}
              onChange={(event) => update("message", event.target.value)}
              placeholder="Describe your project and publishing requirements."
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-lg bg-[#17362e] p-4 font-semibold text-white"
          >
            Prepare Publishing Enquiry
          </button>

          <p className="text-xs text-gray-500">
            This opens your email application with the enquiry details.
            Your information is not uploaded through this form.
            Do not include confidential manuscript content at this stage.
          </p>
        </form>
      </section>

      <footer className="bg-[#17362e] px-6 py-10 text-center text-white">
        <h2 className="text-xl font-bold">Scend Publishing</h2>
        <p className="mt-2">Scend - We Got You Covered</p>
        <a
          href="/books"
          className="mt-4 inline-block underline"
        >
          Browse Our Books
        </a>
        <p className="mt-5 text-sm">
          © 2026 Scend. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
