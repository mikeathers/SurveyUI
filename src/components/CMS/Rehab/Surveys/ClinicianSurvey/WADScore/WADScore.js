import React, { Component } from "react";

import { wadScores, wadScoreValues } from "./wadScores";
import { Card, Label, Dropdown } from "components/Common";
import "./WADScore.scss";

export default class WADScore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wadScore: ""
    };
  }
  componentWillReceiveProps({ wadScore }) {
    if (wadScore !== "") this.setState({ wadScore });
  }

  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
    const wadScore = value;
    const wadText = this.getWadScoreText(value);
    this.props.returnWadScore(wadScore, wadText);
  };

  getWadScoreText = wadScore => wadScores.find(m => m.option === wadScore).text;

  render() {
    return (
      <div id="WADScore" className="wadscore">
        <Card
          title="Whiplash Associated Disorder"
          disabled={this.props.disabled}
        >
          <div>
            <p>
              Whiplash Associated Disorder (WAD) grade based on the
              classification below (Hartling et al, 2001)
            </p>
          </div>
          <div className="wadscore__matrix">
            {wadScores.map((score, key) => (
              <div className="wadscore__row" key={key}>
                <p className="wadscore__option">{score.option}:</p>
                <p className="wadscore__text">{score.text}</p>
              </div>
            ))}
          </div>
          <div>
            <Label text="WAD Score:" />
            <Dropdown
              selection
              width="100"
              name="wadScore"
              id="wadScoreDropdown"
              options={wadScoreValues}
              value={this.state.wadScore}
              onChange={this.handleChange}
              placeholder="Select Score..."
            />
          </div>
        </Card>
      </div>
    );
  }
}
