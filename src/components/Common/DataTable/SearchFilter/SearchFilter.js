import React from "react";
import { Input, Button } from "components/Common";
import "./SearchFilter.scss";

const SearchFilter = props => {
  return (
    <div className="datatable__functionality">
      <div className="datatable__functionality-left">
        <p>Items per page:</p>
        <select className="form-control" onChange={props.changeItemsPerPage}>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>
      <div className="datatable__functionality-right">
        {props.actionAllNeeded && (
          <Button
            content={props.actionAllLabel}
            size="tiny"
            primary
            marginright="15"
            onClick={props.actionAllFunction}
          />
        )}
        <Input
          value={props.searchValue}
          placeholder="Search"
          onChange={props.search}
        />
      </div>
    </div>
  );
};

export default SearchFilter;
