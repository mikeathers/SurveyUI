import React from "react";

import ConditionalPagination from "./ConditionalPagination";

import "./TableFooter.scss";

const TableFooter = props => {
  return (
    <div className="datatable__footer">
      <div className="datatable__footer-left">
        <div>
          <p>
            Total:{" "}
            {props.searchInProgress
              ? props.filteredResults.length
              : props.list.length}
          </p>
        </div>
        {/* <div className="datatable__show-inactive">
          <label htmlFor="showInactive"> Show Inactive</label>
          <input
            type="checkbox"
            id="showInactive"
            onClick={props.showInactive}
          />
          <Loader active={props.showInactiveLoading} inline />
        </div> */}
      </div>
      <ConditionalPagination
        filteredResults={props.filteredResults}
        currentPage={props.currentPage}
        paginateList={props.paginateList}
        searchInProgress={props.searchInProgress}
        list={props.list}
        itemsPerPage={props.itemsPerPage}
      />
    </div>
  );
};

export default TableFooter;
