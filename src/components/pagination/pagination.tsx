"use client";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Loader from "@/components/loader/loader";
import { Button } from "../ui/button";

interface PaginationProps {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}

export default function Pagination({
  currentPage,
  itemsPerPage,
  totalItems,
}: PaginationProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname() || "";

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<number | null>(null);
  const [windowWidth, setWindowWidth] = useState<number>(0);

  useEffect(() => {
    // Set initial width and add resize listener
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const buildPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    params.set("page", page.toString());
    return `${pathname}?${params.toString()}`;
  };

  const handlePageChange = (page: number) => {
    setIsLoading(page);
    router.push(buildPageUrl(page));
  };

  // Reset loading state when page changes complete
  useEffect(() => {
    setIsLoading(null);
  }, [currentPage]);

  const getVisiblePages = () => {
    const visiblePages = [];
    // Show fewer pages on mobile
    const range = windowWidth < 640 ? 1 : 2;

    for (
      let i = Math.max(1, currentPage - range);
      i <= Math.min(totalPages, currentPage + range);
      i++
    ) {
      visiblePages.push(i);
    }

    return visiblePages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col items-center">
      {/* Loading indicator positioned absolutely to not affect layout */}
      {isLoading && <Loader />}

      <div className="flex flex-wrap justify-center mt-8 gap-1 sm:gap-2">
        {/* Previous Button - Always show but make text shorter on mobile */}
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={isLoading !== null || currentPage <= 1}
          className="px-2 sm:px-4 py-2 border rounded hover:bg-black dark:hover:text-white dark:hover:bg-blue-gray-700 disabled:opacity-50 transition-colors"
        >
          <span className="hidden sm:inline">Anterior</span>
          <span className="sm:hidden">{"<"}</span>
        </Button>

        {/* First page - hide on small screens if not in visible range */}
        {(currentPage - 2 > 1 && windowWidth >= 640) && (
          <>
            <Button
              onClick={() => handlePageChange(1)}
              disabled={isLoading !== null}
              className="hidden sm:block px-2 sm:px-4 py-2 border rounded hover:bg-black dark:hover:text-white dark:hover:bg-blue-gray-700 disabled:opacity-50 transition-colors"
            >
              1
            </Button>
            {(currentPage - 2 > 2 && windowWidth >= 640) && (
              <span className="hidden sm:flex items-center px-2">...</span>
            )}
          </>
        )}

        {/* Visible pages */}
        {getVisiblePages().map((page) => (
          <Button
            key={page}
            onClick={() => handlePageChange(page)}
            disabled={isLoading !== null || page === currentPage}
            className={`px-2 sm:px-4 py-2 border rounded transition-colors min-w-[36px] ${
              page === currentPage
                ? "bg-blue-gray-500 text-white"
                : "hover:bg-black dark:hover:text-white dark:hover:bg-blue-gray-700 disabled:opacity-50"
            }`}
          >
            {page}
          </Button>
        ))}

        {/* Last page - hide on small screens if not in visible range */}
        {(currentPage + 2 < totalPages && windowWidth >= 640) && (
          <>
            {(currentPage + 2 < totalPages - 1 && windowWidth >= 640) && (
              <span className="hidden sm:flex items-center px-2">...</span>
            )}
            <Button
              onClick={() => handlePageChange(totalPages)}
              disabled={isLoading !== null}
              className="hidden sm:block px-2 sm:px-4 py-2 border rounded hover:bg-black dark:hover:text-white dark:hover:bg-blue-gray-700 disabled:opacity-50 transition-colors"
            >
              {totalPages}
            </Button>
          </>
        )}

        {/* Next Button - Always show but make text shorter on mobile */}
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={isLoading !== null || currentPage >= totalPages}
          className="px-2 sm:px-4 py-2 border rounded hover:bg-black dark:hover:text-white dark:hover:bg-blue-gray-700 disabled:opacity-50 transition-colors"
        >
          <span className="hidden sm:inline">Siguiente</span>
          <span className="sm:hidden">{">"}</span>
        </Button>
      </div>

      {/* Current page indicator for mobile */}
      {windowWidth < 640 && (
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Página {currentPage} de {totalPages}
        </div>
      )}
    </div>
  );
}