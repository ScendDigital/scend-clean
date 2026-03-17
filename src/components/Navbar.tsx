export default function NavBar() {
  return (
    <div className="flex items-center justify-between bg-pink-600 px-6 py-4 text-white">
      <h1 className="text-lg font-bold">Scend</h1>
      <div className="flex gap-4">
        <a href="/" className="hover:underline">Home</a>
        <a href="/loan" className="hover:underline">Loan Tool</a>
        <a href="/tax" className="hover:underline">Tax Tool</a>
      </div>
    </div>
  );
}