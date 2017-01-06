generatePieChart = (params) => {
    new PieChartConstructor(params)
            .createPieChart();
}

function PieChartConstructor(params)  {
  var self = this;

  self.mainData = params.data;
  self.elem = params.elemId;
  self.svg = {
      width: params.width,
      height: params.height
  }
  self.id = params.svgId;
  self.types = params.chartTypes;
  self.chartId = params.chartId;

  self.margin = {
      top : 30,
      right: 30,
      bottom: 40,
      left: 50
  }
  self.colors = {
      grey : '#7f7c9e',
      white : '#fff',
      black : '#000',
      svgBackground : '#f4f4f4',
  }

  self.createPieChart = createPieChart;
  self.createPieChartMainData = createPieChartMainData;
  self.drawPieChart = drawPieChart;
  self.renderPieChart = renderPieChart;
  self.setColorRange = setColorRange;
  self.setRadius = setRadius;

  function createPieChart () {
      createPieChartMainData();
      drawPieChart();
  }

  function createPieChartMainData () {
      self.mainDataArray = [];
      for(var i in self.mainData) {
          self.mainDataArray.push({
              key: i,
              field: parseFloat(self.mainData[i])
          });
      }
  }

  function drawPieChart() {
      setColorRange();
      setRadius();
      renderPieChart();
      // renderDropDown({
      //   id: self.id,
      //   types: self.types,
      //   chartId: self.chartId,
      //   type: 'pie'
      // });
  }

  function setRadius() {
    self.pieRadius = Math.min(self.svg.width, self.svg.height) / 2;
  }

  function renderPieChart() {

    var arc = d3.svg.arc()
        .outerRadius(self.pieRadius - 10)
        .innerRadius(0);

    var labelArc = d3.svg.arc()
        .outerRadius(self.pieRadius - 40)
        .innerRadius(self.pieRadius - 40);

    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) { return d.field; });

    var svg = d3.select('#'+self.elem).append("svg")
        .attr('height', self.svg.height + self.margin.top + self.margin.bottom)
        .attr('width', self.svg.width + self.margin.right + self.margin.left)
        .classed('cu-svg-container-' + self.id, true)
        .style('padding-left', '90px')
      .append("g")
        .attr("transform", "translate(" + self.svg.width / 2 + "," + self.svg.height / 2 + ")");

    var g = svg.selectAll(".arc")
        .data(pie(self.mainDataArray))
      .enter().append("g")
        .attr("class", "arc");

    g.append("path")
        .attr("d", arc)
        .style("fill", function(d) { return self.colorArcs(d.data.key); });

    g.append("text")
        .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .text(function(d) { return d.data.key; });
  }

  function type(d) {
    d.population = +d.population;
    return d;
  }

  function setColorRange() {
    self.colorArcs = d3.scale.ordinal()
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
  }

}
