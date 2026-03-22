export default function Footer() {
  return (
    <footer className="w-full border-t border-pink-100 bg-white py-10 px-6">

      <div className="max-w-6xl mx-auto flex flex-col items-center gap-10">

        {/* QUICK LINKS — TOP CENTER */}
        <div className="text-center text-[11px] text-gray-700">
          <h3 className="text-sm font-semibold text-pink-600 mb-2">Quick Links</h3>

          <div className="space-y-[2px]">
            <div><a href="/" className="hover:text-pink-600 transition">Home</a></div>
            <div><a href="/loan" className="hover:text-pink-600 transition">Loan Tool</a></div>
            <div><a href="/tax" className="hover:text-pink-600 transition">Tax Tool</a></div>
            <div><a href="/uif" className="hover:text-pink-600 transition">UIF Tool</a></div>
            <div><a href="/price-compare" className="hover:text-pink-600 transition">Price Compare Tool</a></div>
            <div><a href="/publishing" className="hover:text-pink-600 transition">Publishing</a></div>
            <div><a href="/about" className="hover:text-pink-600 transition">About Us</a></div>
            <div><a href="/contact" className="hover:text-pink-600 transition">Contact Us</a></div>
          </div>
        </div>

        {/* ADDRESS — CENTER BELOW QUICK LINKS */}
        <div className="text-center text-[11px] text-gray-700">
          <h3 className="text-sm font-semibold text-pink-600 mb-2">Address</h3>

          <div className="space-y-[2px]">
            <div>11 Ulster Road</div>
            <div>51 Mervlei Complex</div>
            <div>Meredale</div>
            <div>Johannesburg</div>
            <div>2091</div>
          </div>
        </div>

      </div>

      {/* COPYRIGHT */}
      <div className="text-center text-gray-500 text-[11px] mt-10">
        © {new Date().getFullYear()} Scend. All rights reserved.
      </div>

    </footer>
  );
}
