"use client";

import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  currentStart: number;
  pageSize: number;
  total: number;
};

export default function Pagination({ currentStart, pageSize, total }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const totalPages = Math.ceil(total / pageSize);
  const currentPage = Math.floor(currentStart / pageSize) + 1;

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("start", String((page - 1) * pageSize));
    router.push("?" + params.toString());
  };

  return (
    <div className="flex justify-center items-center gap-4 mt-8">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage <= 1}
        className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
      >
        Anterior
      </button>
      <span className="text-gray-700">
        Página {currentPage} de {totalPages}
      </span>
      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
      >
        Siguiente
      </button>
    </div>
  );
}
