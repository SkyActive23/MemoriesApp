interface PaginationProps {
    currentPage: number;
    setCurrentPage: (page: number) => void;
    totalMemories: number;
    memoriesPerPage: number;
  }
  
  const Pagination = ({
    currentPage,
    setCurrentPage,
    totalMemories,
    memoriesPerPage,
  }: PaginationProps) => {
    const totalPages = Math.ceil(totalMemories / memoriesPerPage);
  
    /**
     * handlePrevious:
     * - Handles the functionality for the "Previous" button.
     * - If the current page is greater than 1, it decrements the `currentPage` state.
     */
    const handlePrevious = () => {
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    };
  
    /**
     * handleNext:
     * - Handles the functionality for the "Next" button.
     * - If the current page is less than the total number of pages, it increments the `currentPage` state.
     */
    const handleNext = () => {
      if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
      }
    };
  
    return (
      <div className="flex justify-center mt-4">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="mx-2 text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    );
  };
  
  export default Pagination;
  