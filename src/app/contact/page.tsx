export default function Page() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold">Contact Us</h1>
      <p className="mb-6 opacity-80">
        We know you are busy with other important matters, let Scend handle this one professionally and efficiently for you.
      </p>

      <form className="grid gap-4 mb-8">
        <div>
          <label className="mb-1 block text-sm font-medium">Full Name</label>
          <input className="w-full rounded-xl border p-3 outline-none" placeholder="Your name" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input type="email" className="w-full rounded-xl border p-3 outline-none" placeholder="you@example.com" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Phone</label>
          <input className="w-full rounded-xl border p-3 outline-none" placeholder="+27 ..." />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Message</label>
          <textarea rows={5} className="w-full rounded-xl border p-3 outline-none" placeholder="How can we help?"></textarea>
        </div>
        <button type="button" className="rounded-2xl px-5 py-3 font-semibold shadow-sm border hover:shadow">
          Send Message
        </button>
      </form>

      <div className="space-y-1 text-sm">
        <div><strong>Motlatsi Lenyatsa</strong> — 072 803 7223 — <a href="mailto:motlatsi.lenyatsa@gmail.com" className="underline">motlatsi.lenyatsa@gmail.com</a></div>
        <div><strong>Thato Lenyatsa</strong> — 064 651 9166 — <a href="mailto:thatosebatjane@yahoo.com" className="underline">thatosebatjane@yahoo.com</a></div>
        <div><strong>Morena Sehlako</strong> — 078 136 3268 — <a href="mailto:morenamcguy@gmail.com" className="underline">morenamcguy@gmail.com</a></div>
        <div><strong>Moojane Phulane</strong> — 072 588 9163 — <a href="mailto:selesele07@gmail.com" className="underline">selesele07@gmail.com</a></div>
      </div>
    </div>
  );
}
