generateLineChart = (params) => {
    new LineChartConstructor(params)
            .createLineChart();
}

function LineChartConstructor(params)  {
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

  self.createLineChart = createLineChart;
  self.createLineChartMainData = createLineChartMainData;
  self.drawLineChart = drawLineChart;
  self.setScales = setScales;
  self.setAxes = setAxes;
  self.renderLineChart = renderLineChart;
  self.setDateParsing = setDateParsing;

  function createLineChart () {
      setDateParsing();
      createLineChartMainData();
      drawLineChart();
  }

  function createLineChartMainData () {
      self.mainDataArray = [];
      for(var i in self.mainData) {
          self.mainDataArray.push({
              field: self.parseDate(i),
              key: parseFloat(self.mainData[i]),
          });
      }
  }

  function drawLineChart() {
      setScales();
      setAxes();
      setLineScale();
      renderLineChart();
      renderDropDown({
        id: self.id,
        types: self.types,
        chartId: self.chartId,
        type: 'line'
      });
  }

  function setScales() {
    self.xScale = d3.time.scale().range([0, self.svg.width]);
    self.yScale = d3.scale.linear().range([self.svg.height, 0]);
  }

  function setAxes() {
    self.xAxis = d3.svg.axis()
                  .scale(self.xScale)
                  .orient("bottom")
                  .ticks(5);

    self.yAxis = d3.svg.axis()
                  .scale(self.yScale)
                  .orient("left")
                  .ticks(5);
  }

  function setLineScale() {
    self.svg.lineScale = d3.svg.line()
        .x(function(d) {
          return self.xScale(d.field);
        })
        .y(function(d) {
          return self.yScale(d.key);
        });
  }

  function renderLineChart() {

    var svg = d3.select('#'+self.elem).append('svg')
               .attr('height', self.svg.height + self.margin.top + self.margin.bottom)
               .attr('width', self.svg.width + self.margin.right + self.margin.left)
               .classed('cu-svg-container-' + self.id, true)
               .style('padding-left', '90px')
               .append('g')
                    .attr('transform', 'translate('+ self.margin.left +','+ self.margin.top +')')
                    .style('background', self.colors.svgBackground)
                    .attr('class', 'line-chart');

      $('.cu-svg-container-' + self.id).draggable();

      self.xScale.domain(d3.extent(self.mainDataArray, function(d) { return d.field; }));
      self.yScale.domain([0, d3.max(self.mainDataArray, function(d) { return d.key; })]);

      // Add the line path.
      svg.append("path")
          .attr("class", "line")
          .attr("d", self.svg.lineScale(self.mainDataArray))
          .style('stroke', 'steelblue')
          .style('stroke-width', 1)
          .style('fill', 'none')

      // Add the X Axis
      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + self.svg.height + ")")
          .call(self.xAxis);

      // Add the Y Axis
      svg.append("g")
          .attr("class", "y axis")
          .call(self.yAxis);
  }

  function setDateParsing() {
    self.parseDate = d3.time.format("%d-%b-%y").parse;
  }

}
