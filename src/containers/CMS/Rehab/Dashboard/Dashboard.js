import React, { Component } from "react";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Container, Row, Col, Statistic } from "components/Common";

import "./Dashboard.scss";
export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      series: [
        {
          name: "F2F Reasons",
          data: [
            {
              name: "Knockout Answer Given",
              y: 80,
              color: "rgb(99, 100, 102)"
            },
            {
              name: "Too Complicated",
              y: 8,
              color: "#1baa57"
            },
            {
              name: "No Access To A Computer",
              y: 2,
              color: "#3498db"
            },
            {
              name: "Would Prefer to See Physiotherapist",
              y: 10,
              color: "#f7a800"
            }
          ]
        }
      ]
    };
  }

  componentDidMount() {
    this.highChartsRender();
  }

  highChartsRender = () => {
    Highcharts.chart({
      chart: {
        type: "pie",
        renderTo: "atmospheric-composition"
      },
      title: {
        verticalAlign: "middle",
        floating: true,
        text: "Face To Face Dropout Reasons",
        style: {
          fontSize: "14px"
        }
      },
      plotOptions: {
        pie: {
          dataLabels: {
            format: "{point.name}: {point.percentage:.1f} %"
          },
          innerSize: "70%"
        }
      },
      series: this.state.series
    });
  };

  render() {
    const options = {
      title: {
        text: "Completed Cases"
      },
      xAxis: {
        categories: ["January", "February", "March", "April", "May"]
      },
      yAxis: {
        title: {
          text: "Case Count"
        }
      },
      chart: {
        type: "line"
      },
      series: [
        {
          name: "Completed Cases",
          data: [1, 3, 5, 3, 8]
        }
        // {
        //   name: "John",
        //   data: [5, 7, 3, 2, 4]
        // },
        // {
        //   name: "Doe",
        //   data: [0, 0, 0, 1, 0]
        //}
      ]
    };

    return (
      <Container fluid className="dashboard">
        <Row>
          <Col lg={3} md={6} sm={12}>
            <div className="dashboard__tile1">
              <Statistic title="New Cases" value="14" />
            </div>
          </Col>
          <Col lg={3} md={6} sm={12}>
            <div className="dashboard__tile2">
              <Statistic title="Current Cases" value="6" />
            </div>
          </Col>
          <Col lg={3} md={6} sm={12}>
            <div className="dashboard__tile3">
              <Statistic title="Outstanding Callbacks" value="22" />
            </div>
          </Col>
          <Col lg={3} md={6} sm={12}>
            <div className="dashboard__tile4">
              <Statistic title="Chases In Progress" value="13" />
            </div>
          </Col>
        </Row>
        <Row>
          <Col lg={3} md={6} sm={12}>
            <div className="dashboard__tile5">
              <Statistic title="Completed Courses" value="19" />
            </div>{" "}
          </Col>
          <Col lg={3} md={6} sm={12}>
            <div className="dashboard__tile6">
              <Statistic title="Face To Face Drop Outs" value="15" />
            </div>
          </Col>
          <Col lg={3} md={6} sm={12}>
            <div className="dashboard__tile7">
              <Statistic title="Closed Cases" value="22" />
            </div>
          </Col>
          <Col lg={3} md={6} sm={12}>
            <div className="dashboard__tile8">
              <Statistic title="None Compliant Cases" value="11" />
            </div>
          </Col>
        </Row>
        <Row>
          <Col lg={6}>
            <div className="dashboard__chart">
              <div id="atmospheric-composition" />
            </div>
          </Col>
          <Col lg={6}>
            <div className="dashboard__chart">
              <HighchartsReact highcharts={Highcharts} options={options} />
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}
