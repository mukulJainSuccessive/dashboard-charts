
generateBarChart = (params) => {
    new BarChartConstructor(params)
            .createBarChart();
}

function BarChartConstructor(params)  {
    var self = this;
    //tooltip for main bar
    var maintip = d3.tip()
              .attr('class', 'd3-tip')
              .offset([-10, 0])
              .html(function(d) {
                return '<span>'+d.id + '<br>' + d.value +'<span>';
              });

    //tooltip for setting icon
    var settingMsgTip = d3.tip()
              .attr('class', 'd3-setting-tip')
              .offset([-10, 0])
              .html(function(d) {
                return '<span>Change Type</span>';
              })

    self.mainData = params.data;
    self.elem = params.elemId;
    self.svg = {
        width: params.width,
        height: params.height
    }
    self.id = params.svgId;
    self.types = params.chartTypes;
    self.chartId = params.chartId;
    self.dashboard = params.dashboard;

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
        stackStroke : '#f5f5dc',
        stackHover : '#4F70BB',
        barStart : '#339CFF',
        barEnd :  '#0F368E'
    }

    self.createBarChart = createBarChart;
    self.createBarChartMainData = createBarChartMainData;
    self.drawBarChart = drawBarChart;
    self.drawScales = drawScales;
    self.drawAxisScales = drawAxisScales;
    self.drawYAxis = drawYAxis;
    self.drawXAxis = drawXAxis;
    self.renderBarChart = renderBarChart; //rendering of svg and bar are done here
    self.addSVGAnimation = addSVGAnimation; //simple animation for svg container at initial load
    self.addBarLabelOnLoad = addBarLabelOnLoad;
    self.findMaxValue = findMaxValue;
    self.generateColorRange = generateColorRange;

    function createBarChart() {
        createBarChartMainData();
        drawBarChart();
    }

    function createBarChartMainData() {
        var counter = 0;
        self.mainDataArray = []; //this will be the dataset for bar chart
        for(var i in self.mainData) {
            self.mainDataArray.push({
                id: i,
                value: self.mainData[i],
                continent_id : counter
                // hasChild: false,
                // child : {}
            });
            counter++;
        }
        self.findMaxValue(); //they can only be called once we have array of main data so
        generateColorRange(); //thats why calling from here
    }

    function drawBarChart() {
        drawScales();
        renderBarChart();
        drawAxisScales();
        drawYAxis();
        drawXAxis();

        if(!self.dashboard) {
          renderDropDown({
            id: self.id,
            types: self.types,
            chartId: self.chartId,
            type: 'bar'
          });

          renderDeleteButton({
            id: self.id,
            chartId: self.chartId,
          });
        }
    }

    function drawScales() {
        self.yScale = d3.scale.linear()
                    .domain([0, self.max])
                    .range([0, self.svg.height]);

        self.xScale = d3.scale.ordinal()
                    .domain(d3.range(0, self.mainDataArray.length))
                    .rangeBands([0, self.svg.width]);
    }

    function drawAxisScales() {
        self.vScale = d3.scale.linear()
                .domain([0, self.max])
                .range([self.svg.height, 0]);

        self.hScale = d3.scale.ordinal()
                .domain(d3.range(0, self.mainDataArray.length))
                .rangeBands([0, self.svg.width]);

    }

    function drawXAxis() {

        var xAxis = d3.svg.axis()
                        .scale(self.hScale)
                        .orient('bottom')
                        // .tickValues(self.hScale.domain().filter(function(d,i) {
                        //     return !( i % (self.mainDataArray.length/6))
                        // }))

        var xGuide = d3.select('.cu-svg-container-' + self.id)
                        .append('g')
                        xAxis(xGuide)
                        xGuide.attr('transform', 'translate('+  self.margin.left +','+ (self.svg.height + self.margin.top) +')')
                        xGuide.selectAll('path')
                            .style('fill', 'none')
                            .style('stroke', self.colors.black)
                        xGuide.selectAll('line')
                            .style('stroke', self.colors.black)
    }

    function drawYAxis() {
        var yAxis = d3.svg.axis()
                        .scale(self.vScale)
                        .orient('left')
                        .ticks(5)
                        .tickPadding(5);

        var yGuide = d3.select('.cu-svg-container-' + self.id)
                        .append('g')
                        yAxis(yGuide)
                        yGuide.attr('transform', 'translate('+  self.margin.left +','+ self.margin.top +')')
                        yGuide.selectAll('path')
                            .style('fill', 'none')
                            .style('stroke', self.colors.black)
                        yGuide.selectAll('line')
                            .style('stroke', self.colors.black)
    }

    function renderBarChart() {

        var svg = d3.select('#'+self.elem)
                   .append('li')
                   .classed('chart list-' + self.id, true)
                   .append('svg')
                   .attr('height', self.svg.height + self.margin.top + self.margin.bottom)
                   .attr('width', self.svg.width + self.margin.right + self.margin.left)
                   .classed('cu-svg-container-' + self.id, true)
                   .style('padding-left', '90px')
                   .call(maintip);

        var myBarChart = svg.append('g')
                              .attr('transform', 'translate('+ self.margin.left +','+ self.margin.top +')')
                              .style('background', self.colors.svgBackground)
                              .attr('class', 'bar-chart')
                            .selectAll('g')
                              .data(self.mainDataArray, function(d) {
                                  return d.value;
                              })
                              .enter()
                              .append('g')
                              .attr('class', function(d) {
                                  return 'main-bar-group-'+d.id;
                              });


        var barChart = myBarChart.append('rect')
            .attr('class', function(d) {
                return 'main-bar main-bar-'+d.id;
            })
            .attr('height', function(d, i) {
                return 0;
            })
            .attr('width', self.xScale.rangeBand() - 20)
            .style('fill', function(d, i) {
                return self.barColors(i);
            })
            .attr('x', function(d, i) {
                return self.xScale(i);
            })
           .attr('y', function(d) {
                return self.svg.height;
            })
           .on('mouseover', function(d) {
                maintip.show(d);
           })
           .on('mouseout', function(d) {
                maintip.hide(d);
           });

           addSVGAnimation(barChart);
           addBarLabelOnLoad(myBarChart);
    }

    function addSVGAnimation(svgElement) {
        var animateDuration = 700,
            animateDelay = 30;

        svgElement.transition()
          .attr('height', function(d) {
            return self.yScale(d.value);
          })
          .attr('y', function(d) {
            return self.svg.height - self.yScale(d.value);
          })
          .duration(animateDuration)
          .delay(function(d, i) {
            return i * animateDelay;
          })
          .ease('elastic')
    }

    function addBarLabelOnLoad(myBarChart) {
         myBarChart.append('text')
            .attr('class', function(d) {
                return 'main-label-text-'+d.id;
            })
            .attr('font-size', function(d) { return '1.2em'})
            .attr('fill', self.colors.grey)
             .attr('x', function(d, i) {
                return self.xScale(i);
            })
           .attr('y', function(d, i) {
                return self.svg.height - self.yScale(d.value) - 10;
            })
            .text(function (d) {
                return d.id;
            })
            .style('font-size', '10px');
    }

    function findMaxValue() {
        self.max = d3.max(self.mainDataArray, function(d) { return +d.value;} );
    }

    function generateColorRange() {
        self.barColors = d3.scale.linear()
                .domain([0, self.mainDataArray.length])
                .range([self.colors.barStart, self.colors.barEnd]);
    }


}
