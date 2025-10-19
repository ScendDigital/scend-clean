"use client";
import dynamic from "next/dynamic";
const UifTool = dynamic(() => import("../tools/UifTool"), { ssr: false });
export default function UifToolClient() { return <UifTool />; }
