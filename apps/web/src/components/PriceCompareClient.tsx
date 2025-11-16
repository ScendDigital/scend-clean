"use client";
import dynamic from "next/dynamic";
const PriceCompare = dynamic(() => import("../tools/PriceCompare"), { ssr: false });
export default function PriceCompareClient() { return <PriceCompare />; }
