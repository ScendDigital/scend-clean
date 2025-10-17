import Link from "next/link";

export default function Header() {
  return (
    <header style={{ background: "#fdeef7", borderBottom: "3px solid #ec4899" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <h1 style={{ color: "#ec4899", fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>Welcome to Scend</h1>
        </div>
        <nav style={{ display: "flex", alignItems: "center", gap: 24 }} aria-label="Primary">
          <Link style={{ color: "#ec4899", textDecoration: "none", fontWeight: 700 }} href="/">Home</Link>
          <Link style={{ color: "#ec4899", textDecoration: "none", fontWeight: 500 }} href="/about">About Us</Link>
          <Link style={{ color: "#ec4899", textDecoration: "none", fontWeight: 500 }} href="/contact">Contact Us</Link>
          <Link style={{ color: "#ec4899", textDecoration: "none", fontWeight: 500 }} href="/loan">LoanTool</Link>
          <Link style={{ color: "#ec4899", textDecoration: "none", fontWeight: 500 }} href="/tax">TaxTool</Link>
          <Link style={{ color: "#ec4899", textDecoration: "none", fontWeight: 500 }} href="/price-compare">Price-Compare Tool</Link>
          <Link style={{ color: "#ec4899", textDecoration: "none", fontWeight: 500 }} href="/uif">UIF Tool</Link>
        </nav>
      </div>
    </header>
  );
}
