import PublishingToolClient from "@/components/PublishingToolClient";
import Image from "next/image";

const publishedBooks = [
  {
    title: "Silent Pain: The Untold Struggles of South Africa's Black Men",
    cover: "/books/silent-pain-cover.jpg",
    alt: "Cover of Silent Pain by Motlatsi Charles Lenyatsa",
    description:
      "A compelling look at the often-unspoken struggles of South Africa's Black men—and the strength it takes to break the silence.",
    amazonUrl: "https://www.amazon.com/s?k=9781049202013",
  },
  {
    title: "A Letter From a Divorced Woman: What I Lost, What I Learned, and How I Found Myself Again",
    cover: "/books/letter-from-divorced-woman-cover.jpg",
    alt: "Cover of A Letter From a Divorced Woman by Motlatsi Charles Lenyatsa",
    description:
      "An intimate journey through heartbreak, hard-won lessons, and the courage to find yourself again.",
    amazonUrl: "https://www.amazon.com/s?k=9781048364804",
  },
];

export default function PublishingPage() {
  return (
    <main className="scend-tool-ui w-full px-4 py-8 md:px-8">
      <div className="mx-auto w-full max-w-7xl space-y-8">
        <section
          aria-labelledby="published-books-heading"
          className="rounded-3xl border border-pink-100 bg-gradient-to-br from-pink-50 via-white to-gray-50 p-6 shadow-sm sm:p-8"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-pink-700">
            Scend Publishing
          </p>
          <h1
            id="published-books-heading"
            className="mt-2 text-2xl font-bold tracking-tight text-pink-700 sm:text-3xl"
          >
            Books by Motlatsi Charles Lenyatsa
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600">
            Find a story that speaks to you. Explore the books below and order your copy on Amazon.
          </p>

          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {publishedBooks.map((book) => (
              <li
                key={book.title}
                className="flex flex-col gap-5 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:p-5"
              >
                <div className="relative aspect-[2/3] w-32 shrink-0 self-center overflow-hidden rounded-lg bg-[#f7efe2] shadow-md ring-1 ring-black/5 sm:w-36">
                  <Image
                    src={book.cover}
                    alt={book.alt}
                    fill
                    sizes="(max-width: 640px) 128px, 144px"
                    className="object-contain"
                  />
                </div>
                <div>
                  <h2 className="font-semibold leading-6 text-gray-900">
                    {book.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {book.description}
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    By Motlatsi Charles Lenyatsa
                  </p>
                  <a
                    href={book.amazonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex rounded-xl bg-pink-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-pink-700 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-700"
                  >
                    Buy on Amazon
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </section>
        <PublishingToolClient />
      </div>
    </main>
  );
}