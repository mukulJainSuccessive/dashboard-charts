/**
* @file Gets saved charts data from session and then renders it on dashboard
*/

var self = this;

function init() {
  self.charts = JSON.parse(sessionStorage.getItem('charts'));
  renderChartsOnDashboard();
}

function renderChartsOnDashboard() {
  for (var index in self.charts) {
    generateChart({
      id: self.charts[index].chartId,
      chartType: self.charts[index].chartType,
      svgId: index
    }, true);
  }
}

init();
