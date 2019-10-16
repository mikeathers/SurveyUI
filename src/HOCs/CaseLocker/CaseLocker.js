import React from "react";
import { connect } from "react-redux";
import { updateMi3dCase } from "actions";
import * as api from "api";
import CaseLockedModal from "components/CMS/Rehab/Case/CaseLockedModal/CaseLockedModal";

export const withCaseLocking = WrappedComponent => {
  const Wrapper = () =>
    class CaseLocker extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          caseLockedModalOpen: false
        };
      }

      async componentDidMount() {
        window.addEventListener("beforeunload", this.unlockCase());
        this.checkIfCaseIsLocked()
          ? this.setState({ caseLockedModalOpen: true })
          : setTimeout(async () => await this.lockCase(), 1000);
      }

      async componentWillUnmount() {
        const { mi3dCase, username } = this.props;
        if (mi3dCase.caseLocked && mi3dCase.lockedBy === username) {
          await this.unlockCase();
          window.removeEventListener("beforeunload", this.unlockCase());
        }
      }

      lockCaseInfo = lockedBy => ({
        caseId: this.props.mi3dCase.caseId,
        lockedBy
      });

      lockCase = async () => {
        const { username, mi3dCase } = this.props;
        if (mi3dCase.caseId !== undefined) {
          const response = await api.setCaseLocked(this.lockCaseInfo(username));
          if (response !== undefined) {
            if (response.status === 200)
              this.props.updateMi3dCase(response.data);
            else this.props.showErrorModal();
          } else this.props.showErrorModal();
        }
      };

      unlockCase = async () => {
        if (this.checkIfCaseLockedByCurrentUser())
          await api.setCaseUnlocked(this.lockCaseInfo(null));
      };

      checkIfCaseIsLocked = () => {
        const { mi3dCase, username } = this.props;
        if (mi3dCase.caseLocked && mi3dCase.lockedBy !== username) return true;
        return false;
      };

      checkIfCaseLockedByCurrentUser = () => {
        const { mi3dCase, username } = this.props;
        return mi3dCase.caseLocked && mi3dCase.lockedBy === username
          ? true
          : false;
      };

      showCaseLockedModal = () => {
        this.setState({ caseLockedModalOpen: true });
      };

      render() {
        return (
          <>
            <WrappedComponent
              {...this.props}
              unlockCase={this.unlockCase}
              lockCase={this.lockCase}
              checkIfCaseIsLocked={this.checkIfCaseIsLocked}
            />
            <CaseLockedModal
              id="caseLockedModal"
              lockedBy={this.props.mi3dCase.lockedBy}
              goBackToCaseList={this.goBackToCaseList}
              isModalOpen={this.state.caseLockedModalOpen}
              closeModal={() => this.setState({ caseLockedModalOpen: false })}
            />
          </>
        );
      }
    };
  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(Wrapper());
};

const mapDispatchToProps = dispatch => ({
  updateMi3dCase: updatedCase => dispatch(updateMi3dCase(updatedCase))
});

const mapStateToProps = state => ({
  mi3dCase: state.case.mi3dCase,
  username: state.auth.user.name
});
