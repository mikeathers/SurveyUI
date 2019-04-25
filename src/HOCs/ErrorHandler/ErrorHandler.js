import React from "react";

export default class ErrorHandler extends React.Component {
  state = { hasError: false };

  componentDidCatch(error, errorInfo) {
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) return <p>Something went wrong!</p>;
    return this.props.children;
  }
}
