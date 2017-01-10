/**
* @file Re-renders all charts if change in browser dimension detected.
*/

$(window).resize(function(){
  d3.selectAll('.chart').remove();
  var path = window.location.pathname;
  var pathname = path.substring(1, (path.length - 5));
  var dashboard = (pathname === 'dashboard') ? true : false;
  var charts = JSON.parse(getCharts());
  for(var i in charts) {
    var param = JSON.parse(charts[i].param),
        type = charts[i].chartType;

    param.height = $(window).height()/2;
    param.width = $(window).width()/2;
    param.dashboard = dashboard;
    switch (type) {
      case 'pie':
          generatePieChart(param);
        break;
      case 'line':
          generateLineChart(param);
        break;
      case 'bar':
          generateBarChart(param);
        break;
      default:
          return;
    }
  }
});
