import React from "react";
import { showErrorModal, hideErrorModal } from "actions";
import { connect } from "react-redux";
import { ErrorModal } from "components/Common";

export const withErrorHandling = WrappedComponent => {
  const Wrapper = () =>
    class ErrorHandler extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          errorMessage: null,
          showErrorModal: false
        };
      }

      componentDidMount() {
        this._isMounted = true;
      }

      componentWillUnmount() {
        this._isMounted = false;
      }

      showErrorModal = () => {
        if (this._isMounted && !this.props.errorModalOpen)
          this.props.showErrorModal();
      };

      backToCases = () => {
        this.props.history.push("/cms/rehab/cases");
        this.props.hideErrorModal();
      };

      render() {
        return (
          <>
            <WrappedComponent
              {...this.props}
              showErrorModal={this.showErrorModal}
            />
            <ErrorModal
              isModalOpen={this.props.errorModalOpen}
              closeModal={() => this.props.hideErrorModal()}
              backToCases={this.backToCases}
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
  showErrorModal: () => dispatch(showErrorModal()),
  hideErrorModal: () => dispatch(hideErrorModal())
});

const mapStateToProps = state => ({
  errorModalOpen: state.shared.showErrorModal
});
