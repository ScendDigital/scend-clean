export default function About() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-bold mb-4">About Scend</h1>
        <p className="text-gray-700 leading-7 mb-4">
          Scend Pty Ltd is a digital-first company building practical tools for South Africans:
          finance, publishing, plumbing & maintenance, and more. We design with clarity and put
          compliance first.
        </p>
        <ul className="list-disc ml-6 space-y-2 text-gray-700">
          <li><strong>Loan Tool:</strong> multi-loan support (Vehicle, Home, Personal, Credit Card) with DTI and NCA compliance.</li>
          <li><strong>Tax Tool:</strong> PAYE 2024/25 with medical credits, mid-month proration, and travel allowance logic.</li>
          <li><strong>UIF Tool:</strong> quick estimator aligned to UIF contribution caps and benefit rules.</li>
        </ul>
      </div>
    </main>
  );
}
