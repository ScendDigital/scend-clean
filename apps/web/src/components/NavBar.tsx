import Image from "next/image";
import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="w-full border-b border-gray-200 bg-white px-4">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-center">
        <Link href="/" aria-label="Scend home" className="inline-flex items-center">
          <Image
            src="/scend-logo.png"
            alt="Scend - We Got You Covered"
            width={185}
            height={115}
            priority
            className="h-12 w-auto object-contain"
          />
        </Link>
      </div>
    </nav>
  );
}