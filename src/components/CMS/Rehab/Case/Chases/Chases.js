import React, { Component } from "react";
import _ from "lodash";
import {withErrorHandling} from "HOCs";
import CompleteChaseItem from "./CompleteChaseItem";
import IncompleteChaseItem from "./IncompleteChaseItem";
import ExtendChaseModal from "./ExtendChaseModal/ExtendChaseModal";
import CompleteChaseModal from "./CompleteChaseModal/CompleteChaseModal";
import { Card } from "components/Common";

import "./Chases.scss";

class Chases extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedChase: null,
      showExtendChaseModal: false,
      showCompleteChaseModal: false,
      chases: props.mi3dCase.chases !== undefined ? props.mi3dCase.chases : []
    };
  }

  componentDidMount() {
    this._mounted = true;
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  componentWillReceiveProps({ mi3dCase }) {
    if (this._mounted && mi3dCase.chases !== undefined)
      this.setState({ chases: mi3dCase.chases });
  }

  renderChase = (chase, key) => {
    return chase.complete ? (
      <CompleteChaseItem chase={chase} key={chase.chaseId} />
    ) : (
      <IncompleteChaseItem
        id={`incompleteChase${++key}`}
        chase={chase}
        key={chase.chaseId}
        openCompleteChaseModal={() => this.openCompleteChaseModal(chase)}
      />
    );
  };

  openCompleteChaseModal = chase => {
    this._mounted &&
      this.setState({ selectedChase: chase, showCompleteChaseModal: true });
  };

  orderChases = chases => {
    return _.orderBy(chases, ["complete", "completedDate"], ["asc", "desc"]);
  };

  openExtendChaseDateModal = () => {
    this.setState({ showExtendChaseModal: true });
  };

  completedExtendingChase = () => {
    setTimeout(() => {
      this.setState({
        showCompleteChaseModal: false,
        showExtendChaseModal: false
      });
    }, 2000);
  };

  render() {
    const { chases } = this.state;
    return (
      <Card title="Chases" collapse={false} openByDefault={true} id="chases">
        {chases.length > 0 ? (
          <div className="scrollable-card">
            {this.orderChases(chases).map((chase, key) =>
              this.renderChase(chase, key)
            )}
          </div>
        ) : (
          <p className="light">No chases have been started...</p>
        )}
        <CompleteChaseModal
          id="completeChaseModal"
          history={this.props.history}
          username={this.props.username}
          mi3dCase={this.props.mi3dCase}
          chase={this.state.selectedChase}
          bluedogCase={this.props.bluedogCase}
          updateMi3dCase={this.props.updateMi3dCase}
          isModalOpen={this.state.showCompleteChaseModal}
          updateBluedogCase={this.props.updateBluedogCase}
          showExtendChaseDateModal={this.openExtendChaseDateModal}
          closeModal={() =>
            this._mounted && this.setState({ showCompleteChaseModal: false })
          }
        />
        <ExtendChaseModal
          username={this.props.username}
          mi3dCase={this.props.mi3dCase}
          chase={this.state.selectedChase}
          updateChaseDate={this.updateChaseDate}
          isModalOpen={this.state.showExtendChaseModal}
          closeModal={() => this.setState({ showExtendChaseModal: false })}
          updateMi3dCase={this.props.updateMi3dCase}
          completeExtendingChase={this.completedExtendingChase}
        />
      </Card>
    );
  }
}
export default withErrorHandling(Chases);
