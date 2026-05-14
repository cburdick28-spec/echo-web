"use client";

import Link from "next/link";
import { Home, Download, Trophy, Mic } from "lucide-react";

export default function NavBar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="max-w-lg mx-auto flex justify-around py-2">
        <Link href="/" className="flex flex-col items-center gap-1 text-gray-600 hover:text-blue-600 px-3 py-1">
          <Home className="w-5 h-5" />
          <span className="text-xs">Home</span>
        </Link>
        <Link href="/download" className="flex flex-col items-center gap-1 text-gray-600 hover:text-blue-600 px-3 py-1">
          <Download className="w-5 h-5" />
          <span className="text-xs">Courses</span>
        </Link>
        <Link href="/achievements" className="flex flex-col items-center gap-1 text-gray-600 hover:text-blue-600 px-3 py-1">
          <Trophy className="w-5 h-5" />
          <span className="text-xs">Badges</span>
        </Link>
      </div>
    </nav>
  );
}
