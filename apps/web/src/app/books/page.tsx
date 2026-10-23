import { redirect } from "next/navigation";

export default function BooksRedirectPage() {
  redirect("/publishing#published-books-heading");
}

// Shareable short URL: https://www.scend.co.za/books
// Sends readers directly to the published books section.
