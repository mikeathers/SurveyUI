import React from "react";

import PageNumber from "../PageNumber/PageNumber";

import "./Pagination.scss";

// Pagination component, loads in the PageNumber component, inline function calls for the next and previous buttons.

const Pagination = props => {
  const numberOfPages = Math.ceil(props.items / props.itemsPerPage);
  const totalPageCount = Array.from(Array(numberOfPages).keys());
  const styles = "pagination__page-number";

  return (
    <div className="pagination">
      <div onClick={() => props.paginateList(1)} className={styles}>
        First
      </div>
      <div
        onClick={
          props.currentPage !== 1
            ? () => props.paginateList(props.currentPage - 1)
            : null
        }
        className={styles}
      >
        {"<"}
      </div>
      {totalPageCount.map((p, i) => {
        return (
          <PageNumber
            currentPage={props.currentPage}
            paginateList={props.paginateList}
            key={i + 1}
            pageNumber={i + 1}
          />
        );
      })}
      <div
        onClick={
          props.currentPage !== numberOfPages
            ? () => props.paginateList(props.currentPage + 1)
            : null
        }
        className={styles}
      >
        {">"}
      </div>
      <div onClick={() => props.paginateList(numberOfPages)} className={styles}>
        Last
      </div>
    </div>
  );
};

export default Pagination;
