import { BookOpen, PenLine } from "lucide-react";

export default function PublishingPage() {
  return (
    <div className="scend-tool-ui w-full py-4 md:py-6">
      <section className="overflow-hidden rounded-3xl border border-pink-100 bg-gradient-to-br from-pink-50 via-white to-gray-50 px-6 py-8 shadow-[0_14px_40px_rgba(31,41,55,0.07)] sm:px-9 sm:py-10">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-pink-700">Scend Publishing</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-pink-700 sm:text-4xl">Scend Publishing Tools</h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-7 text-gray-600">Practical resources and guidance for authors and creators.</p>
        <div className="mt-8 grid max-w-3xl gap-4 sm:grid-cols-2">
          <article className="rounded-2xl border border-pink-100 bg-white/90 p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-pink-200 hover:shadow-[0_12px_30px_rgba(230,0,126,0.16)] sm:p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-50 text-pink-700 ring-1 ring-pink-100"><BookOpen aria-hidden="true" size={21} /></span>
            <h2 className="mt-4 text-lg font-semibold text-gray-900">Author resources</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">Publishing guidance and resources are being prepared.</p>
            <span className="mt-4 inline-flex rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">In development</span>
          </article>
          <article className="rounded-2xl border border-pink-100 bg-white/90 p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-pink-200 hover:shadow-[0_12px_30px_rgba(230,0,126,0.16)] sm:p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-50 text-pink-700 ring-1 ring-pink-100"><PenLine aria-hidden="true" size={21} /></span>
            <h2 className="mt-4 text-lg font-semibold text-gray-900">Creator tools</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">Tools to support your writing and publishing journey are coming.</p>
            <span className="mt-4 inline-flex rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">In development</span>
          </article>
        </div>
      </section>
    </div>
  );
}
