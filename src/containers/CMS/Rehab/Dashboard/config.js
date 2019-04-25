const config = {
  title: {
    text: ""
  },

  yAxis: {
    title: {
      text: "Price"
    }
  },
  xAxis: { type: "datetime" },
  legend: {
    layout: "vertical",
    align: "right",
    verticalAlign: "middle"
  },

  plotOptions: {
    series: {
      label: {
        connectorAllowed: false
      },
      pointStart: 2010
    }
  },

  series: [1, 3, 6, 10],

  responsive: {
    rules: [
      {
        condition: {
          maxWidth: 500
        },
        chartOptions: {
          legend: {
            layout: "horizontal",
            align: "center",
            verticalAlign: "bottom"
          }
        }
      }
    ]
  }
};
export default config;
