"use client";

import { useState, useEffect } from "react";

export default function AboutUsPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="min-h-screen flex justify-center px-4 py-16 bg-gradient-to-b from-white via-pink-50/40 to-white">
      
      {/* PREMIUM CONTAINER */}
      <div className="w-full  bg-gradient-to-br from-pink-50 via-white to-pink-100/70  border border-pink-200   p-12 animate-fadeIn">

        <h1 className="text-4xl font-extrabold text-center text-pink-600 mb-6 tracking-tight">
          About Us
        </h1>

        <p className="text-gray-700 leading-relaxed text-[15px] mb-8">
          <strong className="text-pink-600 font-semibold">Scend</strong> is a multi-service, forward-thinking organisation
          dedicated to simplifying life in a complex world. Through digital innovation, financial wellness tools, and
          community-focused services, Scend brings clarity where people often feel overwhelmed.
        </p>

        <p className="text-gray-700 leading-relaxed text-[15px] mb-8">
          Our mission is simple:{" "}
          <span className="text-pink-600 font-semibold">
            heal the nation through information, empowerment, and innovation.
          </span>{" "}
          We believe meaningful change begins with access — access to the right tools, support, and knowledge that allow
          individuals and families to make informed decisions.
        </p>

        <h2 className="text-2xl font-bold text-pink-600 mb-4">
          What We Do Under the Scend Umbrella
        </h2>

        <ul className="text-gray-700 leading-relaxed space-y-4 text-[15px] mb-10">
          <li>
            <span className="text-pink-600 font-semibold">Scend Digital:</span>{" "}
            Modern digital tools such as LoanTool, TaxTool, UIFTool, and Price Compare Tool — helping South Africans
            understand finance and compliance with ease.
          </li>

          <li>
            <span className="text-pink-600 font-semibold">Scend Wellness:</span>{" "}
            Emotional, financial, and social wellness tools designed to provide structure, clarity, and direction in
            daily decision-making.
          </li>

          <li>
            <span className="text-pink-600 font-semibold">Scend Publishing:</span>{" "}
            Storytelling, author support, book development, and publishing of impactful works such as{" "}
            <em>Silent Pain</em>.
          </li>
        </ul>

        <p className="text-gray-700 leading-relaxed text-[15px]">
          At Scend, everything we build is guided by one core belief:{" "}
          <span className="text-pink-600 font-semibold">
            people deserve clarity, dignity, and support.
          </span>{" "}
          Whether through building modern digital tools or empowering meaningful content, Scend continues to uplift
          individuals and communities.
        </p>

      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
