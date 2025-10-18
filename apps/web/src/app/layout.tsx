import "./globals.css";

export const metadata = {
  title: "Scend",
  description: "Tools to make life simpler.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="container">
            <a className="brand" href="/">Scend</a>
            <nav className="nav">
              <a href="/loan">Loan</a>
              <a href="/tax">Tax</a>
              <a href="/uif">UIF</a>
            </nav>
          </div>
        </header>
        <main className="container">{children}</main>
        <footer className="site-footer">
          <div className="container">© {new Date().getFullYear()} Scend</div>
        </footer>
      </body>
    </html>
  );
}

