import React, { useEffect, useState } from "react";
import './Pagination.scss'

const Pagination = ({
  currentPage,
  totalItem,
  itemsPerPage,
  visiblePageCount,
  showEllipsisAfter,
  onPageChange,
  onItemsLimitChange,
}) => {
  const [totalPages, setTotalPages] = useState(Math.ceil(totalItem / itemsPerPage));
  const [itemsPerPageLimit, setItemsPerPage] = useState(itemsPerPage);

  useEffect(() => {
    setTotalPages(Math.ceil(totalItem / itemsPerPage));
  }, [totalItem, itemsPerPage]);

  const goToPage = (page) => {
    if (page !== '..' && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const isPageActive = (page) => currentPage === page;

  const getShow = () => {
    const displayStart = totalItem > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
    const displayEnd = Math.min((currentPage - 1) * itemsPerPage + itemsPerPage, totalItem);

    return { displayStart, displayEnd };
  };

  const generateVisiblePages = () => {
    if (totalPages <= visiblePageCount) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const visiblePages = [];

    if (currentPage <= Math.ceil(visiblePageCount / 2)) {
      for (let i = 1; i <= visiblePageCount; i++) {
        visiblePages.push(i);
      }
    } else if (currentPage >= totalPages - Math.floor(visiblePageCount / 2)) {
      for (let i = totalPages - visiblePageCount + 1; i <= totalPages; i++) {
        visiblePages.push(i);
      }
    } else {
      const start = currentPage - Math.floor(visiblePageCount / 2);
      const end = currentPage + Math.floor(visiblePageCount / 2);
      for (let i = start; i <= end; i++) {
        visiblePages.push(i);
      }
    }

    if (showEllipsisAfter && currentPage > 2) {
      visiblePages.unshift('....');
    }

    if (showEllipsisAfter && currentPage + 1 < totalPages) {
      visiblePages.push('....');
    }

    return visiblePages;
  };

  const visiblePages = generateVisiblePages();

  useEffect(() => {
    if (!visiblePages.includes(currentPage)) {
      goToPage(visiblePages[0]);
    }
  }, [currentPage, visiblePages]);

  const handleItemsPerPageChange = (event) => {
    const newItemsPerPage = Number(event.target.value);
    setItemsPerPage(newItemsPerPage);
    onItemsLimitChange(newItemsPerPage);
  };

  return (
    <div id="pagenation">
      <div className="__left">
        <span style={{ width: "12%" }}>Showing Limit</span>
        <select style={{ width: "10%" }} name="" value={itemsPerPageLimit} onChange={handleItemsPerPageChange}>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
        <span style={{ width: "100%" }}>&nbsp;and {getShow().displayStart} to {getShow().displayEnd} of {totalItem} entries</span>
      </div>

      <div className="__right">
        {
          currentPage === 1 ?
            <div className="__back-active __prev"><i className='bx bx-chevron-left'></i></div>
            :
            <div className="__prev" onClick={() => goToPage(currentPage - 1)}><i className='bx bx-chevron-left'></i></div>
        }

        {visiblePages.map((page, index) => (
          <div
            className="__numbers"
            key={index}
            onClick={() => goToPage(page)}
            disabled={currentPage === page}
          >
            {
              page === '....' ?
                <>
                  <div className='doted'>{page}</div>
                </>
                :
                <button
                  className={`page-name-button ${isPageActive(page) ? '__active' : ''}`}
                  type="button"
                  disabled={page === '....'}
                >
                  {page}
                </button>
            }
          </div>
        ))}
        {
          currentPage === totalPages ?
            <div className="__back-active __next"><i className='bx bx-chevron-right'></i></div>
            :
            <div className="__next" onClick={() => goToPage(currentPage + 1)}><i className='bx bx-chevron-right'></i></div>
        }
      </div>
    </div>
  );
};

export default Pagination;