var self = this;

function renderDeleteButton(param) {
  self.id = param.id;
  self.chartId = param.chartId;

  drawDelete();
}

function drawDelete() {
  d3.select('.cu-svg-container-' + self.id)
        .append('text')
        .attr('font-family', 'FontAwesome')
        .attr('font-size', function(d) { return '2em'})
        .attr('title', "Delete")
        .attr('transform', 'translate(120, 30)')
        .attr('parent-svg-id', self.id)  // custom attribute
        .attr('chart-id', self.chartId)  // custom attribute
        .text(function(d) { return '\uf00d' })
        .style('fill', '#E80000')
        .style('cursor', 'pointer')
        .on('click', deleteChart);
}

function deleteChart() {
  var parentSVGId = $(this).attr('parent-svg-id');
  var chartId = $(this).attr('chart-id');
  d3.select('.cu-svg-container-' + parentSVGId).remove();

  var filter = selectedGraphs.filter(function(graph) {
    return graph.chartId == chartId;
  });
  var index = selectedGraphs.indexOf(filter[0]);
  selectedGraphs.splice(index, 1);
  sessionStorage.setItem("charts", JSON.stringify(selectedGraphs));
}
