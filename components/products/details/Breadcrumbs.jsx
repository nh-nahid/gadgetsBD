import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function Breadcrumbs({ paths = [] }) {
  return (
    <div className="text-xs text-gray-500 mb-4 flex items-center gap-1">
      {paths.map((path, idx) => {
        const isLink = typeof path.href === "string" && path.href.length > 0;

        return (
          <span key={idx} className="flex items-center gap-1">
            {isLink ? (
              <Link href={path.href} className="hover:underline">
                {path.label}
              </Link>
            ) : (
              <span className="text-amazon-text font-bold">
                {path.label}
              </span>
            )}

            {idx < paths.length - 1 && (
              <ChevronRight className="w-3 h-3" />
            )}
          </span>
        );
      })}
    </div>
  );
}
