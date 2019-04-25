import React, { Fragment } from "react";

// PageNumber component used to show the numbers on the Pagination component.
// Renders numbers + 2  and - 2 of the current page as long as the number is above 0.

const PageNumber = props => {
  const styles = "pagination__page-number";
  return (
    <Fragment>
      {props.pageNumber <= props.currentPage + 2 &&
      props.pageNumber >= props.currentPage - 2 ? (
        <div
          onClick={() => props.paginateList(props.pageNumber)}
          className={
            props.pageNumber === props.currentPage
              ? styles + " pagination__page-number--selected"
              : styles
          }
        >
          {props.pageNumber}
        </div>
      ) : null}
    </Fragment>
  );
};

export default PageNumber;
