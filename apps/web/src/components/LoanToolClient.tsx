"use client";
import dynamic from "next/dynamic";
const LoanTool = dynamic(() => import("../app/loan/LoanToolClient"), { ssr: false });
export default function LoanToolClient() { return <LoanTool />; }
