import React from "react";
import Pagination from "../Pagination/Pagination";

const ConditionalPagination = props => {
  return (
    <div>
      {props.searchInProgress
        ? props.filteredResults.length > 0 && (
            <Pagination
              currentPage={props.currentPage}
              paginateList={props.paginateList}
              items={
                props.searchInProgress
                  ? props.filteredResults.length
                  : props.list.length
              }
              itemsPerPage={props.itemsPerPage}
            />
          )
        : props.list.length > 0 && (
            <Pagination
              currentPage={props.currentPage}
              paginateList={props.paginateList}
              items={
                props.searchInProgress
                  ? props.filteredResults.length
                  : props.list.length
              }
              itemsPerPage={props.itemsPerPage}
            />
          )}
    </div>
  );
};

export default ConditionalPagination;
