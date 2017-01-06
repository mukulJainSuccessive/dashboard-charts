var self = this;

function renderDropDown(param) {
  self.id = param.id;
  self.chartTypes = param.types;
  self.chartId = param.chartId;
  self.chartType = param.type;

  parseTypes();
}

function parseTypes() {
  self.parsedChartTypes = [];
  for(var i in  self.chartTypes) {
    self.parsedChartTypes.push({
      type: self.chartTypes[i]
    });
  }

  drawDropdown();
}

function drawDropdown() {
  var dropDown = d3.select('.cu-svg-container-' + self.id)
                   .append('foreignObject')
                   .attr('height', '100')
                   .attr('width', '100')
                   .append("xhtml:div")
                   .attr("class", "menu-" + self.id)
                   .append("xhtml:select")
                   .attr('class', 'form-control')
                   .attr('parent-svg-id', self.id)  // custom attribute
                   .attr('id', function() {
                     return self.chartId;
                   });

   var options = dropDown.selectAll("option")
                  .data(self.parsedChartTypes)
                  .enter()
                  .append("option")
                  .attr('selected', function(d) {
                    return (d.type === self.chartType) ? '' : null;
                  });

   options.text(function (d) { return d.type; })
          .attr("value", function (d) { return d.type; });

   d3.select('#'+self.chartId).on('change', menuChanged);

}

function menuChanged() {
  var parentSVGId = $(this).attr('parent-svg-id');
  d3.select('.cu-svg-container-' + parentSVGId).remove();
  // $('.cu-svg-container-' + parentSVGId).html('');

  var dropdownId = $(this).attr('id');
  var filter = data.type.filter(function(obj) {
    return obj.chartId == dropdownId;
  });
  var id = filter[0].id;

  generateChart({
    id: $(this).attr('id'),
    svgId: id,
    chartType: d3.event.target.value
  });
}
