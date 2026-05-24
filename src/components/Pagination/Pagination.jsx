import { ChevronLeft, ChevronRight } from 'lucide-react';

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5; // e.g., 1 2 3 4 5
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="flex items-center justify-center gap-1.5 mt-8 mb-4">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-3 py-2 text-[15px] font-medium transition-colors disabled:text-[#b2b2b2] disabled:cursor-not-allowed text-[#8a8a8a] hover:text-[#444444] dark:hover:text-slate-300 dark:disabled:text-slate-600"
      >
        <ChevronLeft size={16} className="mb-[1px]" />
        Previous
      </button>

      {getPageNumbers().map((page, index) => {
        if (page === '...') {
          return (
            <span key={`ellipsis-${index}`} className="px-2 text-[#8a8a8a] dark:text-slate-500">
              ...
            </span>
          );
        }

        const isActive = page === currentPage;
        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 rounded-lg text-[15px] font-medium flex items-center justify-center transition-all ${
              isActive
                ? 'bg-[var(--color-blue-500)] text-white shadow-md shadow-blue-500/20 border border-[var(--color-blue-500)]'
                : 'bg-white dark:bg-slate-900 text-[#444444] dark:text-slate-300 border border-[#dddddd] dark:border-slate-700 hover:border-[var(--color-blue-500)] hover:text-[var(--color-blue-500)]'
            }`}
          >
            {page}
          </button>
        );
      })}

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 px-3 py-2 text-[15px] font-medium transition-colors disabled:text-[#b2b2b2] disabled:cursor-not-allowed text-[var(--color-blue-500)] hover:text-[var(--color-blue-600)] dark:disabled:text-slate-600"
      >
        Next
        <ChevronRight size={16} className="mb-[1px]" />
      </button>
    </div>
  );
}

export default Pagination;
