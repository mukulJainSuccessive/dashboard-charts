/**
* @file Script for generating charts.
* @summary Saves selected graphs in session,
*          add parameters for chart generation.
*/

var selectedGraphs = [];

/**
* @desc Generates chart for both config and dashboard page
* @param {Object} params - parameters
* @param {Object} params - parameters
* @param {Number} params.svgId - id of SVG where chart is gonna render
* @param {String} params.id - id of sample data
* @param {String} params.chartType - chart type, i.e, pie/line/bar
* @param {Boolean} [dashboard=false] - tells whethere chart is rendering for config or dashboard page
*/
function generateChart(params, dashboard) {
  var dashboard = (dashboard) ? true: false;
  var param = {
    chartId: params.id,
    svgId: params.svgId,
    elemId: 'chart',
    width: $(window).width()/2,
    height: $(window).height()/2,
    data: params.sampleData
    chartTypes: [],
    dashboard: dashboard
  }


  selectedGraphs.push({
    chartId: params.id,
    chartType: params.chartType,
    param: JSON.stringify(param)
  });

  if (!dashboard) {
    setCharts(selectedGraphs);
  }

  if(params.chartType === "bar") {
    generateBarChart(param);
  } else if(params.chartType === "pie") {
    generatePieChart(param);
  } else if(params.chartType === "line") {
    generateLineChart(param);
  } else {
    alert("Unknown default chart type..")
  }
}
