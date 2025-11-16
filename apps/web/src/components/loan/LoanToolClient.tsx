"use client";
import dynamic from "next/dynamic";
const LazyLoanTool = dynamic(() => import("./LoanTool"), { ssr: false });
export default function LoanToolClient() { return <LazyLoanTool />; }



