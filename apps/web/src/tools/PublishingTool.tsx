"use client";

import { useEffect, useMemo, useState } from "react";

type Format = "ebook" | "print" | "audio";
type Project = {
  title: string;
  author: string;
  genre: string;
  stage: string;
  wordCount: string;
  route: string;
  formats: Format[];
  completed: string[];
};
type Task = { id: string; group: string; title: string; detail: string; formats?: Format[] };

const STORAGE_KEY = "scend-publishing-planner-v1";
const DEFAULT_PROJECT: Project = {
  title: "",
  author: "",
  genre: "",
  stage: "Draft in progress",
  wordCount: "",
  route: "Not decided yet",
  formats: ["ebook", "print"],
  completed: [],
};

const TASKS: Task[] = [
  { id: "edit", group: "Manuscript", title: "Revise and edit the manuscript", detail: "Complete structural edits first, then line editing and proofreading." },
  { id: "proof", group: "Manuscript", title: "Proofread the final text", detail: "Check names, dates, quotations, chapter order, and consistency after the final edit." },
  { id: "rights", group: "Book details", title: "Confirm ownership and permissions", detail: "Check image, quotation, music, and contributor permissions. Keep written approvals." },
  { id: "metadata", group: "Book details", title: "Prepare title, subtitle, description, and author bio", detail: "Use consistent book details across the cover, distributor listing, and promotional material." },
  { id: "isbn", group: "Book details", title: "Check ISBN and barcode requirements", detail: "Requirements vary by format, territory, and distributor. Confirm before ordering or assigning an ISBN." },
  { id: "cover", group: "Book files", title: "Prepare and review the cover", detail: "Check that the artwork, title, author name, and trim or platform specifications are correct." },
  { id: "ebook-file", group: "Book files", title: "Create and validate the eBook file", detail: "Export an EPUB or distributor-accepted file and review it on different screen sizes.", formats: ["ebook"] },
  { id: "ebook-upload", group: "Distribution", title: "Upload and preview the eBook listing", detail: "Review the preview, metadata, pricing, territories, and publication settings before release.", formats: ["ebook"] },
  { id: "print-layout", group: "Book files", title: "Format the print interior", detail: "Confirm trim size, margins, page numbering, fonts, and the final page count.", formats: ["print"] },
  { id: "print-cover", group: "Book files", title: "Build the print cover from final specifications", detail: "Use the selected printer's template after the interior page count and paper choice are final.", formats: ["print"] },
  { id: "print-proof", group: "Distribution", title: "Order and review a print proof", detail: "Check the physical copy for layout, cut, colour, and cover alignment before approving it.", formats: ["print"] },
  { id: "audio-rights", group: "Audio edition", title: "Confirm audiobook rights and narration plan", detail: "Confirm rights, narrator agreement, pronunciation notes, and the retailer's audio requirements.", formats: ["audio"] },
  { id: "audio-master", group: "Audio edition", title: "Record, edit, and quality-check audio", detail: "Review each finished file for clarity, consistent levels, correct chapter order, and silence requirements.", formats: ["audio"] },
  { id: "launch", group: "Launch", title: "Plan the launch and reader outreach", detail: "Prepare a launch date, sample content, retailer links, and a simple follow-up plan." },
];

const inputClass = "mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-sm text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-pink-500 focus:ring-4 focus:ring-pink-100";
const labelClass = "block text-sm font-medium text-gray-800";
const buttonClass = "inline-flex min-h-11 items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-700";

function formatName(format: Format) {
  return format === "ebook" ? "eBook" : format === "print" ? "Print book" : "Audiobook";
}

export default function PublishingTool() {
  const [project, setProject] = useState<Project>(DEFAULT_PROJECT);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<Project>;
        setProject({ ...DEFAULT_PROJECT, ...parsed });
      }
    } catch {
      setNotice("We could not load the saved project. You can start a fresh plan.");
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
    } catch {
      setNotice("This browser could not save the plan locally. You can still download a copy.");
    }
  }, [project, ready]);

  const activeTasks = useMemo(
    () => TASKS.filter((task) => !task.formats || task.formats.some((format) => project.formats.includes(format))),
    [project.formats],
  );
  const completedCount = activeTasks.filter((task) => project.completed.includes(task.id)).length;
  const progress = activeTasks.length ? Math.round((completedCount / activeTasks.length) * 100) : 0;
  const nextTask = activeTasks.find((task) => !project.completed.includes(task.id));
  const groups = [...new Set(activeTasks.map((task) => task.group))];

  function update<K extends keyof Project>(key: K, value: Project[K]) {
    setProject((current) => ({ ...current, [key]: value }));
    setNotice("");
  }

  function toggleFormat(format: Format) {
    setProject((current) => {
      const formats = current.formats.includes(format)
        ? current.formats.filter((item) => item !== format)
        : [...current.formats, format];
      return { ...current, formats: formats.length ? formats : current.formats };
    });
    setNotice("");
  }

  function toggleTask(id: string) {
    setProject((current) => ({
      ...current,
      completed: current.completed.includes(id)
        ? current.completed.filter((item) => item !== id)
        : [...current.completed, id],
    }));
  }

  function buildPlanText() {
    const title = project.title.trim() || "Untitled book project";
    const selectedFormats = project.formats.map(formatName).join(", ") || "Not selected";
    const lines = [
      `Scend Publishing Plan: ${title}`,
      `Author: ${project.author || "Not entered"}`,
      `Genre: ${project.genre || "Not entered"}`,
      `Stage: ${project.stage}`,
      `Formats: ${selectedFormats}`,
      `Publishing route: ${project.route}`,
      `Approximate word count: ${project.wordCount || "Not entered"}`,
      `Checklist progress: ${completedCount}/${activeTasks.length} (${progress}%)`,
      "",
      ...groups.flatMap((group) => [
        `${group}`,
        ...activeTasks.filter((task) => task.group === group).map((task) => `${project.completed.includes(task.id) ? "[x]" : "[ ]"} ${task.title} - ${task.detail}`),
        "",
      ]),
      "Prepared with the Scend Publishing Planner. Confirm distributor specifications before release.",
    ];
    return lines.join("\n");
  }

  async function copyPlan() {
    try {
      await navigator.clipboard.writeText(buildPlanText());
      setNotice("Your publishing plan was copied to the clipboard.");
    } catch {
      setNotice("Clipboard access is unavailable. Use Download plan to save a copy.");
    }
  }

  function downloadPlan() {
    const blob = new Blob([buildPlanText()], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${(project.title.trim() || "scend-publishing-plan").replace(/[^a-z0-9-_]+/gi, "-")}-publishing-plan.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
    setNotice("Your publishing plan has been downloaded.");
  }

  function contactScend(channel: "email" | "whatsapp") {
    const subject = `Publishing enquiry: ${project.title.trim() || "New book project"}`;
    const body = `Hello Scend,\n\nI would like to discuss a publishing project.\n\n${buildPlanText()}\n\nPlease let me know the next steps.`;
    const url = channel === "email"
      ? `mailto:motlatsi.lenyatsa@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      : `https://wa.me/27728037223?text=${encodeURIComponent(body)}`;
    window.open(url, channel === "email" ? "_self" : "_blank", "noopener,noreferrer");
  }

  function clearProject() {
    setProject(DEFAULT_PROJECT);
    setNotice("Project details cleared. The blank plan is saved on this device.");
  }

  return (
    <div className="space-y-7">
      <section className="overflow-hidden rounded-3xl border border-pink-100 bg-gradient-to-br from-pink-50 via-white to-gray-50 px-6 py-8 shadow-[0_14px_40px_rgba(31,41,55,0.07)] sm:px-9 sm:py-10">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-pink-700">Scend Publishing</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-pink-700 sm:text-4xl">Scend Publishing Planner</h1>
        <p className="mt-3 max-w-3xl text-[15px] leading-7 text-gray-600">Build a practical checklist for your book, track production progress, and prepare a clear publishing enquiry. Your project is saved in this browser only.</p>
        <div className="mt-6 flex flex-wrap gap-2 text-xs font-medium text-gray-700">
          {["Manuscript", "Book files", "Distribution", "Launch"].map((item) => <span key={item} className="rounded-full border border-pink-100 bg-white/80 px-3 py-1.5">{item}</span>)}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-[0_12px_34px_rgba(36,42,50,0.06)] sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold tracking-tight text-gray-900">Set up your book project</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">Choose the formats you want to prepare. The checklist updates to match.</p>
          </div>
          <div className="space-y-4">
            <label className={labelClass}>Working title<input className={inputClass} value={project.title} onChange={(e) => update("title", e.target.value)} maxLength={160} placeholder="Enter your book title" /></label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={labelClass}>Author name<input className={inputClass} value={project.author} onChange={(e) => update("author", e.target.value)} maxLength={100} placeholder="Name as it should appear on the book" /></label>
              <label className={labelClass}>Genre or subject<input className={inputClass} value={project.genre} onChange={(e) => update("genre", e.target.value)} maxLength={100} placeholder="e.g. memoir, fiction, business" /></label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={labelClass}>Current stage<select className={inputClass} value={project.stage} onChange={(e) => update("stage", e.target.value)}><option>Draft in progress</option><option>Draft complete</option><option>Editing and proofreading</option><option>Preparing book files</option><option>Ready to publish</option><option>Already published</option></select></label>
              <label className={labelClass}>Approximate word count<input className={inputClass} type="number" min="0" step="100" value={project.wordCount} onChange={(e) => update("wordCount", e.target.value)} placeholder="e.g. 65000" /></label>
            </div>
            <label className={labelClass}>Publishing route<select className={inputClass} value={project.route} onChange={(e) => update("route", e.target.value)}><option>Not decided yet</option><option>Amazon KDP</option><option>Kobo Writing Life</option><option>Local print provider</option><option>Multiple distributors</option><option>Traditional publisher</option></select></label>
            <fieldset>
              <legend className={labelClass}>Formats to prepare</legend>
              <div className="mt-2 grid gap-2 sm:grid-cols-3">
                {(["ebook", "print", "audio"] as Format[]).map((format) => <label key={format} className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-sm transition ${project.formats.includes(format) ? "border-pink-200 bg-pink-50/70 text-pink-900" : "border-gray-200 bg-white text-gray-700 hover:border-pink-200"}`}><input type="checkbox" className="accent-pink-600" checked={project.formats.includes(format)} onChange={() => toggleFormat(format)} />{formatName(format)}</label>)}
              </div>
            </fieldset>
            <p className="text-xs leading-5 text-gray-500">Your plan is stored locally in this browser. It is not uploaded to Scend.</p>
          </div>
        </section>

        <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-[0_12px_34px_rgba(36,42,50,0.06)] sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-pink-700">Your roadmap</p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-gray-900">Publishing checklist</h2>
            </div>
            <div className="min-w-32 rounded-2xl bg-pink-50 px-4 py-3 text-right ring-1 ring-pink-100">
              <div className="text-2xl font-bold text-pink-700">{progress}%</div>
              <div className="text-xs text-gray-600">{completedCount} of {activeTasks.length} complete</div>
            </div>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100"><div className="h-full rounded-full bg-pink-600 transition-all" style={{ width: `${progress}%` }} /></div>

          {nextTask && <div className="mt-5 rounded-2xl border border-pink-100 bg-gradient-to-r from-pink-50 to-white p-4"><p className="text-xs font-semibold uppercase tracking-wide text-pink-700">Suggested next step</p><p className="mt-1 font-semibold text-gray-900">{nextTask.title}</p><p className="mt-1 text-sm leading-6 text-gray-600">{nextTask.detail}</p></div>}
          {!nextTask && <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-medium text-emerald-900">You have completed every item in this plan. Review the final files and distributor requirements before release.</div>}

          <div className="mt-5 space-y-5">
            {groups.map((group) => (
              <div key={group}>
                <h3 className="mb-2 text-sm font-semibold text-gray-900">{group}</h3>
                <div className="space-y-2">
                  {activeTasks.filter((task) => task.group === group).map((task) => {
                    const done = project.completed.includes(task.id);
                    return <label key={task.id} className={`flex cursor-pointer gap-3 rounded-xl border p-3.5 transition ${done ? "border-pink-100 bg-pink-50/50" : "border-gray-100 hover:border-pink-200 hover:shadow-[0_8px_20px_rgba(230,0,126,0.08)]"}`}><input type="checkbox" className="mt-1 h-4 w-4 shrink-0 accent-pink-600" checked={done} onChange={() => toggleTask(task.id)} /><span><span className={`block text-sm font-semibold ${done ? "text-pink-800" : "text-gray-900"}`}>{task.title}</span><span className="mt-1 block text-xs leading-5 text-gray-600">{task.detail}</span></span></label>;
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-2 border-t border-gray-100 pt-5">
            <button type="button" className={`${buttonClass} bg-pink-700 text-white shadow-[0_8px_22px_rgba(230,0,126,0.20)] hover:-translate-y-0.5 hover:bg-pink-800 hover:shadow-[0_12px_28px_rgba(230,0,126,0.28)]`} onClick={downloadPlan}>Download plan</button>
            <button type="button" className={`${buttonClass} bg-white text-gray-800 ring-1 ring-gray-200 hover:bg-gray-50`} onClick={copyPlan}>Copy plan</button>
            <button type="button" className={`${buttonClass} bg-white text-gray-800 ring-1 ring-gray-200 hover:bg-gray-50`} onClick={() => contactScend("email")}>Email Scend</button>
            <button type="button" className={`${buttonClass} bg-white text-gray-800 ring-1 ring-gray-200 hover:bg-gray-50`} onClick={() => contactScend("whatsapp")}>WhatsApp Scend</button>
            <button type="button" className={`${buttonClass} text-gray-500 hover:bg-gray-50 hover:text-gray-900`} onClick={clearProject}>Clear project</button>
          </div>
          {notice && <p className="mt-4 rounded-xl border border-pink-100 bg-pink-50 px-4 py-3 text-sm text-pink-900" role="status" aria-live="polite">{notice}</p>}
        </section>
      </div>

      <p className="rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-xs leading-6 text-gray-600">Publishing specifications, ISBN rules, pricing, and file requirements can change by distributor and format. Treat this planner as a preparation guide and confirm the current requirements with your chosen platform or printer.</p>
    </div>
  );
}
