import "./globals.css";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Scend",
  description: "Digital • Wellness • Publishing",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900">

        {/* NAV BAR */}
        <NavBar />

        {/* PAGE WRAPPER (FIXED) */}
        <main className="px-4 py-6 flex flex-col items-center">
          <div className="scend-container w-full">
            {children}
          </div>
        </main>

        {/* FOOTER */}
        <Footer />

      </body>
    </html>
  );
}
