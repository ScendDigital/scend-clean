import { redirect } from "next/navigation";

export default function Home() {
  // Always land on UIF Tool
  redirect("/uif");
}
