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
  const pathname = usePathname();
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<number | null>(null);

  const buildPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
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
    const range = 2;

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

      <div className="flex justify-center mt-8 gap-2">
        {/* Previous Button */}
        {currentPage > 1 && (
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={isLoading !== null}
            className="px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-50 transition-colors"
          >
            Anterior
          </Button>
        )}

        {/* First page */}
        {currentPage - 2 > 1 && (
          <>
            <Button
              onClick={() => handlePageChange(1)}
              disabled={isLoading !== null}
              className="px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-50 transition-colors"
            >
              1
            </Button>
            {currentPage - 2 > 2 && <span className="px-4 py-2">...</span>}
          </>
        )}

        {/* Visible pages */}
        {getVisiblePages().map((page) => (
          <Button
            key={page}
            onClick={() => handlePageChange(page)}
            disabled={isLoading !== null || page === currentPage}
            className={`px-4 py-2 border rounded transition-colors ${
              page === currentPage
                ? "bg-blue-gray-500 text-white"
                : "hover:bg-gray-100 disabled:opacity-50"
            }`}
          >
            {page}
          </Button>
        ))}

        {/* Last page */}
        {currentPage + 2 < totalPages && (
          <>
            {currentPage + 2 < totalPages - 1 && (
              <span className="px-4 py-2">...</span>
            )}
            <Button
              onClick={() => handlePageChange(totalPages)}
              disabled={isLoading !== null}
              className="px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-50 transition-colors"
            >
              {totalPages}
            </Button>
          </>
        )}

        {/* Next Button */}
        {currentPage < totalPages && (
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={isLoading !== null}
            className="px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-50 transition-colors"
          >
            Siguiente
          </Button>
        )}
      </div>
    </div>
  );
}
