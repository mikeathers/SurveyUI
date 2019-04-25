import React from "react";
import _ from "lodash";
import SearchFilter from "./SearchFilter/SearchFilter";
import TableHeader from "./TableHeader/TableHeader";
import TableBody from "./TableBody/TableBody";
import TableFooter from "./TableFooter/TableFooter";

import "./DataTable.scss";

class DataTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: props.list.length > 0 ? props.list : [],
      tableType: props.tableType !== "" ? props.tableType : "",
      search: "",
      searchInProgress: false,
      filteredResults: [],
      paginatedList: [],
      sortableCols: [],
      itemsPerPage: 10,
      pageNumber: 1,
      checkedRows: [],
      checkAllRows: false,
      sortAsc: false,
      showInactive: false,
      showInactiveLoading: false
    };
  }

  componentWillReceiveProps({ list }) {
    this.setState({ list, showInactiveLoading: false }, () =>
      this.paginateList(this.state.pageNumber)
    );
  }

  componentDidMount() {
    this.paginateList(this.state.pageNumber);
    let sortableCols = [];
    this.props.cols.forEach(col => {
      if (col.sortable) {
        const sortedColName = `${col.value}Sorted`.replace(/\s/g, "");
        sortableCols.push({ name: sortedColName, sorted: false });
        this.setState({ [sortedColName]: false });
      }
    });
    this.setState({ sortableCols });
  }

  handleChange = e => this.setState({ [e.target.name]: e.target.value });

  selectRow = row => {
    this.props.selectRow(row);
  };

  changeItemsPerPage = e => {
    this.setState({ itemsPerPage: parseFloat(e.target.value) }, () =>
      this.paginateList(this.state.pageNumber)
    );
  };

  paginateList = (page_number, array = this.state.list) => {
    let pageNumber = page_number;
    let itemsPerPage = this.state.itemsPerPage;
    this.setState({ pageNumber });

    if (this.state.searchInProgress) array = this.state.filteredResults;

    let paginateList = this.paginate(array, itemsPerPage, pageNumber);

    if (paginateList.length < 1) {
      paginateList = this.paginate(array, itemsPerPage, 1);
    }

    this.setState({
      paginatedList: paginateList,
      currentPage: pageNumber
    });
  };

  paginate = (array, page_size, page_number) => {
    --page_number;
    return array.slice(page_number * page_size, (page_number + 1) * page_size);
  };

  search = e => {
    const search = e.target.value;
    this.setState({ search, searchInProgress: true });

    const filteredResults = this.state.list.filter(result => {
      let isMatch = "";
      let isNameMatch = "";

      for (let prop in result) {
        if (prop === "firstName") {
          let name = result["firstName"] + " " + result["lastName"];
          isNameMatch = name
            .toString()
            .toLowerCase()
            .includes(search.toLowerCase());
        }
        if (result[prop] !== null)
          isMatch = result[prop]
            .toString()
            .toLowerCase()
            .includes(search.toLowerCase());

        if (isMatch || isNameMatch) {
          return isMatch || isNameMatch;
        }
      }
      return null;
    });

    this.setState({ filteredResults }, () =>
      this.paginateList(1, filteredResults)
    );

    if (search === "") {
      this.setState({ searchInProgress: false });
      this.paginateList(1);
    }
  };

  sort = entityToSort => {
    let sortedResults;
    if (this.state.searchInProgress) {
      sortedResults = this.state.sortAsc
        ? _.orderBy(this.state.filteredResults, [entityToSort], ["asc"])
        : _.orderBy(this.state.filteredResults, [entityToSort], ["desc"]);
      this.setState(
        { filteredResults: sortedResults, sortAsc: !this.state.sortAsc },
        () => this.paginateList(1)
      );
    } else {
      sortedResults = this.state.sortAsc
        ? _.orderBy(this.state.list, [entityToSort], ["asc"])
        : _.orderBy(this.state.list, [entityToSort], ["desc"]);
      this.setState({ list: sortedResults, sortAsc: !this.state.sortAsc }, () =>
        this.paginateList(1)
      );
    }
  };

  handleSortedColChange = value => {
    const sortedColName = `${value}Sorted`;
    const currentSortableCols = this.state.sortableCols;
    const filteredCol = currentSortableCols.find(m => m.name === sortedColName);
    filteredCol.sorted = !filteredCol.sorted;

    this.setState({ sortableCols: currentSortableCols });
  };

  checkRow = id => {
    let alreadyExists = this.state.checkedRows.find(
      x => x[this.props.idCol] === id
    );
    if (!alreadyExists) {
      const rowToAdd = this.state.list.find(m => m[this.props.idCol] === id);
      this.state.checkedRows.concat();
      this.setState({ checkedRows: this.state.checkedRows.concat(rowToAdd) });
    } else {
      const checkedRows = this.state.checkedRows.filter(
        x => x[this.props.idCol] !== id
      );
      this.setState({ checkedRows });
    }
  };

  checkAllRows = () => {
    this.setState({ checkAllRows: !this.state.checkAllRows });
    if (!this.state.checkAllRows) {
      if (this.state.searchInProgress) {
        this.setState({ checkedRows: this.state.filteredResults });
      } else this.setState({ checkedRows: this.state.list });
    } else this.setState({ checkedRows: [] });
  };

  showInactive = () => {
    this.setState(
      { showInactive: !this.state.showInactive, showInactiveLoading: true },
      () => {
        if (this.state.showInactive) {
          this.props.showInactive(true);
        } else this.props.showInactive(false);
      }
    );
  };
  actionAll = () => {
    this.props.actionAllFunction(this.state.checkedRows);
  };

  render() {
    const results = this.state.searchInProgress
      ? this.state.filteredResults
      : this.state.list;
    return (
      <div className="datatable" id="datatable">
        <SearchFilter
          changeItemsPerPage={this.changeItemsPerPage}
          searchValue={this.state.search}
          search={this.search}
          actionAllNeeded={this.props.actionAllNeeded}
          actionAllLabel={this.props.actionAllLabel}
          actionAllFunction={this.actionAll}
        />

        <TableHeader
          handleSortedColChange={this.handleSortedColChange}
          sortableCols={this.state.sortableCols}
          checkAllRows={this.checkAllRows}
          sort={this.sort}
          cols={this.props.cols}
          actionAllNeeded={this.props.actionAllNeeded}
        />

        <TableBody
          paginatedList={this.state.paginatedList}
          cols={this.props.cols}
          selectRow={this.selectRow}
          results={results}
          timeSensitiveValue={this.props.timeSensitiveValue}
          checkRow={this.checkRow}
          checkAllRows={this.checkAllRows}
          allChecked={this.state.checkAllRows}
          idCol={this.props.idCol}
          actionAllNeeded={this.props.actionAllNeeded}
        />

        <TableFooter
          searchInProgress={this.state.searchInProgress}
          filteredResults={this.state.filteredResults}
          list={this.state.list}
          showInactive={this.showInactive}
          showInactiveLoading={this.state.showInactiveLoading}
          currentPage={this.state.currentPage}
          paginateList={this.paginateList}
          itemsPerPage={this.state.itemsPerPage}
        />
      </div>
    );
  }
}

export { DataTable };
