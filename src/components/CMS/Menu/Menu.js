import React, { Component } from "react";
import Primary from "./Primary/Primary";
import Secondary from "./Secondary/Secondary";
import Heading from "./Heading/Heading";
import Footer from "./Footer/Footer";
import "./Menu.scss";

export default class Menu extends Component {
  render() {
    return (
      <div className="side-menu">
        <Primary />
        <div className="side-menu__secondary">
          <Heading heading="Case Management" />
          <Secondary />
          <Footer footer={`Premex ${new Date().getFullYear()} \u00A9`} />
        </div>
      </div>
    );
  }
}
