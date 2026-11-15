import { FileSearch } from "lucide-react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-2 text-primary-700 no-underline">
          <FileSearch className="h-7 w-7" />
          <span className="text-xl font-bold tracking-tight">ClauseWise</span>
        </Link>
        <p className="hidden text-sm text-gray-500 sm:block">
          Know what you're agreeing to.
        </p>
      </div>
    </header>
  );
}
