function LineChart(parentElement) {
    var self = this;

    self.svg = {};

    /**
     * Pie Settings
     */
    self.graph = {
        loaded: false,
        mode: 'line',
        byYear: true,
        data: null,
        aggregatedData: null,
        range: null,
        aggregatedCoords: {},
        dimension: {
            w: 0,
            h: 0
        },
        color: {
            line: '#5F3B79',
            other: '#9C79B5',
            highlight: '#9C79B5'
        },
        label: {
            family : "sans-serif",
            size: 20,
            color: '#000000'
        },
        margin: {
            left: 100,
            right: 120,
            top: 20,
            bottom: 100
        },
        animation: {
            line: 1000,
            rectangle: 100,
            circle: 300,
            circleFade: 50
        }
    };

    /**
     * SVG Dimesions Setup
     */
    self.svg = {
        dimension: {
            w: 700,
            h: 500
        },
        window: null,
        yOrdinal: null,
        xOrdinal: null,
        line: null
    };

    /**
     *
     * SVG Related Methods
     */
    self.getSvgDimension = getSvgDimension;

    self.getSvgWindow = getSvgWindow;
    self.setSvgWindow = setSvgWindow;

    self.getSvgYOrdinal = getSvgYOrdinal;
    self.setSvgYOrdinal = setSvgYOrdinal;
    self.getSvgXOrdinal = getSvgXOrdinal;
    self.setSvgXOrdinal = setSvgXOrdinal;
    self.getSvgLine = getSvgLine;
    self.setSvgLine = setSvgLine;


    /**
     *
     * Bar Related Methods
     */
    self.setGraphMode = setGraphMode;
    self.getGraphMode = getGraphMode;

    self.setGraphLoaded = setGraphLoaded;
    self.getGraphLoaded = getGraphLoaded;

    self.setGraphByYear = setGraphByYear;
    self.getGraphByYear = getGraphByYear;

    self.setGraphDimension = setGraphDimension;
    self.getGraphDimension = getGraphDimension;

    self.getGraphColorLine = getGraphColorLine;
    self.getGraphColorHighlight = getGraphColorHighlight;
    self.getGraphColorOther = getGraphColorOther;

    self.getGraphLabelSize = getGraphLabelSize;
    self.getGraphLabelFamily = getGraphLabelFamily;
    self.getGraphLabelColor = getGraphLabelColor;

    self.getGraphMargin = getGraphMargin;

    self.getGraphAnimation = getGraphAnimation;


    /**
     * Data Functions
     */

    self.setGraphRange = setGraphRange;
    self.getGraphRange = getGraphRange;

    self.getParsedData = getParsedData;
    self.setParsedData = setParsedData;
    self.setAggregatedData = setAggregatedData;
    self.getAggregatedData = getAggregatedData;

    self.groupedDataByDrill = groupedDataByDrill;
    self.groupOtherData = groupOtherData;



    /**
     *
     * Render Methods

     * */
    self.generateSVGContainer = generateSVGContainer;
    self.render = render;
    self.renderOverlay = renderOverlay;
    self.renderLineChart = renderLineChart;
    self.renderBarChart= renderBarChart;

    self.generateBars = generateBars;

    self.generateAxis = generateAxis;

    self.pathTween = pathTween;
    self.createLines = createLines;

    self.createLineCircles = createLineCircles;

    self.splitString = splitString;
    self.transformLabel = transformLabel;
    self.moveLabelsFromAll = moveLabelsFromAll;
    self.createLabels = createLabels;
    self.createHighlightBars = createHighlightBars;

    self.setAggregatedCoords = setAggregatedCoords;
    self.getAggregatedCoords = getAggregatedCoords;

    self.attachEvents = attachEvents;
    self.getTranslatedCoords = getTranslatedCoords;

    self.isCoordsInsideCircle = isCoordsInsideCircle;
    self.isCoordsInsideRect = isCoordsInsideRect;

    self.setAggregatedCircle = setAggregatedCircle;

    self.animateLineCircles = animateLineCircles;
    self.setOtherLines = setOtherLines;
    self.mouseMoveEvent = mouseMoveEvent;
    self.mouseClickEvent = mouseClickEvent;
    self.getTranslation = getTranslation;
    /**
     *
     * helper functions
     */
    self.isUndefined = isUndefined;

    //Getting SVG Window Dimesnions
    function getGraphMargin() {
        return self.graph.margin;
    }

    function getSvgDimension() {
        return self.svg.dimension;
    }

    function getSvgWindow() {
        return self.svg.window;
    }

    function setSvgWindow(window) {
        return self.svg.window = window;
    }

    function getSvgYOrdinal() {
        return self.svg.yOrdinal;
    }

    function setSvgYOrdinal(yOrdinal) {
        return self.svg.yOrdinal = yOrdinal;
    }

    function getSvgXOrdinal() {
        return self.svg.xOrdinal;
    }

    function setSvgXOrdinal(xOrdinal) {
        return self.svg.xOrdinal = xOrdinal;
    }


    function getSvgLine() {
        return self.svg.line;
    }

    function setSvgLine(line) {
        return self.svg.line = line;
    }

    function getSvgWindow() {
        return self.svg.window;
    }

    function setSvgWindow(window) {
        return self.svg.window;
    }

    /**
     * Bar related functions
     */

    function getGraphRange() {
        return self.graph.range;
    }

    function setGraphRange(range) {
        self.graph.range = range;
    }

    function getParsedData() {
        return self.graph.data;
    }

    function groupOtherData(finalData, top) {
        var length = 0;
        for (var drillId in finalData) {
            length++;
        }

        if (length <= top + 3) {
            return finalData;
        }

        var drillAverages = {};
        var drillAvgs = [];
        for (var drillId in finalData) {
            if (drillId === 'All') {
                continue;
            }

            drillAverages[drillId] = {
                'sum': 0,
                'total': 0,
                'avg': 0
            };

            for (var dataID = 0; dataID < finalData[drillId].data.length; dataID++) {
                drillAverages[drillId]['sum'] += finalData[drillId].data[dataID].metric;
                drillAverages[drillId]['total']++;
            }

            drillAverages[drillId]['avg'] = drillAverages[drillId]['sum'] / drillAverages[drillId]['total'];
            drillAvgs.push({
                'drill': drillId,
                'value': drillAverages[drillId]['avg']
            });
        }

        drillAvgs.sort(
            function(a, b) {
                return b.value - a.value;
            }
        );

        var topDrills = ['All'];
        for (var i = 0; i < top; i++) {
            topDrills.push(drillAvgs[i].drill);
        }

        var refactoredData = {};
        for (var i = 0 ; i < topDrills.length; i++) {
           refactoredData[topDrills[i]] = finalData[topDrills[i]];
            delete(finalData[topDrills[i]]);
        }

        refactoredData['Other'] = {
            'id': 'other',
            'name': 'Other',
            'aggregated' : false,
            'data': []
        };

        var dimensions = {};
        for (var drill in finalData) {
            for (var i = 0; i < finalData[drill].data.length; i++) {
                if (typeof dimensions[finalData[drill].data[i].dimension] === 'undefined') {
                    dimensions[finalData[drill].data[i].dimension] = {
                        'metric': 0,
                        'dimension': finalData[drill].data[i].dimension,
                        'filterDimension': finalData[drill].data[i].dimension.replace(/[^A-Za-z0-9]/g, '').toLowerCase(),
                        'drill': 'Other',
                        'aggregated': false,
                        'parent': 'other',
                        'total': 0
                    };
                }

                dimensions[finalData[drill].data[i].dimension]['metric'] += finalData[drill].data[i].metric;
                dimensions[finalData[drill].data[i].dimension]['total']++;
            }
        }

        for (var id in dimensions) {
            dimensions[id].metric = dimensions[id].metric / dimensions[id].total;
            refactoredData['Other']['data'].push(dimensions[id]);
        }

        return refactoredData;
    }

    function groupedDataByDrill(data) {
        var finalData = {};
        for (var dataId in data) {
            if (self.isUndefined(finalData[data[dataId].drill])) {
                finalData[data[dataId].drill] = {
                    'data': [],
                    'id': data[dataId].drill.replace(/[^A-Za-z0-9]/g, '').toLowerCase(),
                    'name': data[dataId].drill,
                    'aggregated': data[dataId].aggregated
                };
            }
            data[dataId].parent = data[dataId].drill.replace(/[^A-Za-z0-9]/g, '').toLowerCase();
            data[dataId].filterDimension = data[dataId].dimension.replace(/[^A-Za-z0-9]/g, '').toLowerCase();
            finalData[data[dataId].drill].data.push(data[dataId]);
        }

        finalData = self.groupOtherData(finalData, 5);

        var parsedData = [];
        for (var finalID in finalData) {
            parsedData.push(finalData[finalID]);
        }

        return parsedData;
    }

    function setParsedData(data) {
        var finalData = [];
        var byYear = self.getGraphByYear();
        finalData = self.groupedDataByDrill(data);

        self.graph.data = finalData;
        self.setAggregatedData();
    }

    function setAggregatedData() {
        var parsedData = self.getParsedData();
        var allData = parsedData.filter(function(d) {
            return d.aggregated;
        });
        self.graph.aggregatedData = allData;
    }

    function getAggregatedData() {
        return self.graph.aggregatedData;
    }

    function setGraphMode(mode) {
        return self.graph.mode = mode;
    }

    function getGraphMode() {
        return self.graph.mode;
    }

    function setGraphLoaded(loaded) {
        return self.graph.loaded = loaded;
    }

    function getGraphLoaded() {
        return self.graph.loaded;
    }

    function setGraphByYear(byYear) {
        return self.graph.byYear = byYear;
    }

    function getGraphByYear() {
        return self.graph.byYear;
    }


    function getGraphColorHighlight() {
        return self.graph.color.highlight;
    }

    function getGraphColorOther() {
        return self.graph.color.other;
    }

    function getGraphColorLine() {
        return self.graph.color.line;
    }

    function getGraphLabelSize() {
        return self.graph.label.size;
    }

    function getGraphLabelFamily() {
        return self.graph.label.family;
    }

    function getGraphLabelColor() {
        return self.graph.label.color;
    }

    function getGraphDimension() {
        return self.graph.dimension;
    }

    function setGraphDimension(dimension) {
        self.graph.dimension = dimension;
    }

    function getGraphAnimation() {
        return self.graph.animation;
    }

    function generateAxis(tiltXAxis) {
        var xOrdinal = self.getSvgXOrdinal();
        var yOrdinal = self.getSvgYOrdinal();
        var graphDimension = self.getGraphDimension();

        var xAxis = d3.axisBottom()
            .scale(xOrdinal)
            .tickValues(xOrdinal.domain().filter(function(i) {
              return !(i % parseInt(xOrdinal.domain().length / 10));
            }))

        var yAxis = d3.axisLeft()
            .scale(yOrdinal)
            .tickFormat(d3.format("s"))
            .ticks(10);

        var axis = d3.select('#graph-chart-container').append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + graphDimension.h + ")")
            .call(xAxis);

        if (!self.getGraphByYear() || tiltXAxis) {
            axis.selectAll("text")
                .style("text-anchor", "end")
                .attr("transform", function(d) {
                    return "rotate(-45)"
                });
        }

        d3.select('#graph-chart-container').append("g")
            .attr("class", "x axis axis-center")
            .attr("transform", "translate(0," + yOrdinal(0) + ")")
            .call(xAxis.tickSize(0).tickFormat(""));

        d3.select('#graph-chart-container').append("g")
            .attr("class", "y axis")
            .call(yAxis);
    }

    function pathTween(data) {
        var line = self.getSvgLine();

        var interpolate = d3.scaleQuantile()
                .domain([0,1])
                .range(d3.range(1, data.length + 1));
        return function(t) {
            return line(data.slice(0, interpolate(t)));
        };
    }

    function createLines() {
        var line = self.getSvgLine();

        var parsedData = self.getParsedData();
        var lines = d3.select('#graph-chart-container').selectAll("lines")
            .data(parsedData)
            .enter();

        // var initTransition = d3.transition()
        //            .duration(1000);

        lines.append('path')
            .attr('class', function(d) {
                return 'lines line-' + d.id;
            })
            .attr('id', function(d) {
                  return d.id;
              })
            .attr('d', function(d) {
                  return line(d.data[0]);
              })
            .style('fill', 'none')
            .style('stroke', function(d) {
                    return d.aggregated ? self.getGraphColorLine() : self.getGraphColorOther();
             })
            .style('stroke-width', '2px')
            .attr('opacity', function (d) {
                    return d.aggregated ? 1 : 0;
             })
          .transition()
          .duration(1000)
            .attrTween('d', function(d) {
                return self.pathTween(d.data);
            })
            .on('end', function(d, i) {
                if (i === parsedData.length - 1) {
                    self.createLineCircles();
                }
            });
    }

    function createLineCircles() {
        var parsedData = self.getParsedData();
        var xOrdinal = self.getSvgXOrdinal();
        var yOrdinal = self.getSvgYOrdinal()

        var lastKey = null;
        for(var drillId in parsedData) {
            lastKey = parsedData[drillId].id;
        }

        var lines = d3.select('#graph-chart-container').selectAll("lines")
            .data(parsedData)
            .enter()
            .append('g')
            .attr('class', 'circle-container');


        lines.selectAll('line-circles')
            .data(function(d) {
                return d.data;
            })
            .enter().append('circle')
            .attr('class', function(d) {
                return 'line-circles line-circle-' + d.filterDimension + ' ' + 'line-circle-' + d.parent;
            })
            .attr('opacity', function(d) {
                return d.aggregated ? '1' : '0';
            })
            .attr('cx', function(d) {
              return xOrdinal(d.dimension) + (xOrdinal.bandwidth() / 2);
            })
            .attr('cy', function(d) {
              return  yOrdinal(d.metric);
            })
            .attr('r', 0)
            .style('fill', function(d) {
              return d.aggregated ? self.getGraphColorLine() : self.getGraphColorOther();
            })
            .transition()
            .duration(300)
            .attr('r', 5)
            .on('end', function(d, i) {
                d.circleCoords = {
                    cx: xOrdinal(d.dimension) + (xOrdinal.bandwidth() / 2),
                    cy: yOrdinal(d.metric),
                    r: 5
                };
                d.activated = false;
                if (i === parsedData[0].data.length - 1 && d.parent === lastKey) {
                    self.setAggregatedCoords();
                    self.attachEvents();
                    self.setGraphLoaded(true);
                    self.createLabels();
                }
            });

    }

    function getAggregatedCoords() {
        return self.graph.aggregatedCoords;
    }

    function setAggregatedCoords() {
        d3.selectAll('.line-circle-all')
            .each(function(d) {
                self.graph.aggregatedCoords[d.filterDimension] = d.circleCoords;
            });
    }

    function createHighlightBars() {
        var aggregatedData = self.getAggregatedData();

        var xOrdinal = self.getSvgXOrdinal();
        var dimension = self.getGraphDimension();

        d3.select('#graph-chart-container').selectAll("hover-bar")
            .data(aggregatedData[0].data)
          .enter()
            .append("rect")
            .attr('class', function(d) {
                return 'highlight-rects highlight-rect-' + d.filterDimension;
            })
            .style("opacity", 0)
            .attr("x", function(d) { return xOrdinal(d.dimension); })
            .attr("width", xOrdinal.bandwidth())
            .attr("y", 0)
            .attr("height", dimension.h)
            .each(function(d) {
                d.coords = {
                    x1: xOrdinal(d.dimension),
                    y1: 0,
                    x2: xOrdinal(d.dimension) + xOrdinal.bandwidth(),
                    y2: dimension.h
                };
            });
    }

    function splitString(label, parts) {
        if(parts <= 1) {
            return [label];
        }

        var labelLength = label.length;
        var stringParts = [];
        var splitSize = Math.ceil(labelLength / parts);
        var startCount = 0;
        var curSplitSize = 0
        while(startCount < labelLength) {
            curSplitSize = (startCount === 0 && splitSize > 5) ?  splitSize - 3 : splitSize;
            while((label.charAt(startCount + curSplitSize - 1) !== ' '
                    && label.charAt(startCount + curSplitSize - 1) !== "\'")
                && startCount + curSplitSize - 1 < labelLength) {
                curSplitSize++;
            }
            stringParts.push((label.substr(startCount, curSplitSize)).trim());
            startCount += curSplitSize;
        }
        return stringParts;
    }

    function moveLabelsFromAll() {
        d3.select('#label-seg-all')
            .each(function(d) {
                // var allTransform = d3.select(this).attr('transform');
                // var allTranslatedPoints = allTransform.substring(allTransform.indexOf("(")+1, allTransform.indexOf(")")).split(",");
                var allTranslatedPoints = self.getTranslation(d3.select(this).attr('transform'));
                var svgContainer = this.getBBox();
                var allCoordinates = {
                    y1: allTranslatedPoints[1] + svgContainer.y,
                    y2: allTranslatedPoints[1] + svgContainer.y + svgContainer.height
                };
                d3.selectAll('.label-seg')
                    .each(function(d) {
                        if(!d.aggregated) {
                            var othTranslatedPoints = self.getTranslation(d3.select(this).attr('transform'));
                            var othSvgContainer = this.getBBox();
                            var othAllCoordinates = {
                                y1: othTranslatedPoints[1] + othSvgContainer.y,
                                y2: othTranslatedPoints[1] + othSvgContainer.y + othSvgContainer.height
                            };

                            if(!((othAllCoordinates.y1 < allCoordinates.y1 && othAllCoordinates.y2 < allCoordinates.y1)
                                || (othAllCoordinates.y1 > allCoordinates.y2 && othAllCoordinates.y2 > allCoordinates.y2))) {

                                if(othAllCoordinates.y1 < allCoordinates.y1) {
                                    d3.select(this).attr("transform", "translate(0," + (allCoordinates.y1 - othSvgContainer.height - othSvgContainer.y) + ")");
                                } else {
                                    d3.select(this).attr("transform", "translate(0," + (allCoordinates.y2 + 10) + ")");
                                }
                            }
                        }
                    });
            });


    }

    function transformLabel(label) {
        var margin = self.getGraphMargin();
        var graphDimension = self.getGraphDimension();
        var yOrdinal = self.getSvgYOrdinal();

        var coords = {
            x1: 0,
            y1: 0,
            x2: margin.right,
            y2: graphDimension.h
        };

        label.ext = {
            label : label.drill,
            parts: 1,
            inValid : true,
            fontSize: 16
        };

        var labelPrefix = 'label-';
        do {
            label.ext.inValid = false;

            d3.select('#' + labelPrefix  + label.parent)
                .selectAll('.' + labelPrefix + 'seg').remove();

            if (!label.ext.label.length) {
                break;
            }

            var segContainer = d3.select('#' + labelPrefix + label.parent)
                .append('g')
                .classed(labelPrefix + 'seg', true)
                .attr('id', labelPrefix + 'seg-' + label.parent)
                .attr('opacity', '1');

            var labelParts = self.splitString(label.ext.label, label.ext.parts);

            var currentHeight = 0;
            for (var i = 0; i < labelParts.length; i++) {
                segContainer.append("text")
                    .text(labelParts[i])
                    .attr("anchor-text", "middle")
                    .attr("font-size", label.ext.fontSize + "px")
                    .attr("font-family", self.getGraphLabelFamily())
                    .style("fill", self.getGraphLabelColor())
                    .attr("y", function(){
                        return i * label.ext.fontSize + (i === 0  ? 0 : 2);
                    })
                    .attr("x", 0)
                    .each(function(d) {
                        var bbox = this.getBBox();
                        currentHeight += bbox.height;

                        if (bbox.width + 2 > (coords.x2 - coords.x1 - 1)) {
                            label.ext.inValid = true;
                        }
                    });
            }

            segContainer.attr('transform', 'translate(0, ' + (yOrdinal(label.metric) + 5) + ')');
            if(!label.aggregated) {
                segContainer.attr('opacity', '0');
            }

            label.yCoord = yOrdinal(label.metric);

            if (label.ext.inValid) {

                if ((label.ext.parts === 1 && label.ext.fontSize === 10)
                    || (label.ext.fontSize === 10)
                ) {
                    label.ext.fontSize = 16;
                    label.ext.parts++;

                    if (label.ext.parts > 4) {
                        label.ext.parts = 0;
                        label.ext.label = label.ext.label.slice(0, -5);
                        if (label.ext.label.length) {
                            label.ext.label += '...';
                        }
                    }
                } else {
                    label.ext.fontSize--;
                }
            }

        } while(label.ext.inValid);
    }

    function createLabels() {
        var margin = self.getGraphMargin();
        var graphDimension = self.getGraphDimension();
        var yOrdinal = self.getSvgYOrdinal();
        var parsedData = self.getParsedData();

        d3.select('#master-svg-container').append("g")
            .attr("id", "graph-label-container")
            .attr("transform", "translate(" + (margin.left + graphDimension.w) + "," + margin.top + ")");

        var labelDatas = [];
        for (var drillId in parsedData) {
            var obj = parsedData[drillId].data[parsedData[drillId].data.length - 1];
            labelDatas.push(obj);
        }

        d3.selectAll('#graph-label-container').selectAll('labels')
            .append('g')
            .data(labelDatas)
            .enter()
            .append('g')
            .attr('id', function(d) {
                return 'label-' + d.parent;
            })
            .each(function(d, i) {
                self.transformLabel(d);

                if(i === labelDatas.length - 1) {
                    self.moveLabelsFromAll();
                }
            });
    }

    function generateBars(domainData) {
        var xOrdinal = self.getSvgXOrdinal();
        var yOrdinal = self.getSvgYOrdinal();

        d3.select('#graph-chart-container').selectAll("line-bar")
            .data(domainData)
          .enter()
            .append("rect")
            .attr('class', function(d) {
                return 'dimension-bars dimension-bar-' + d.drill;
            })
            .style("fill", self.getGraphColorLine())
            .attr("x", function(d) { return xOrdinal(d.drill); })
            .attr("width", xOrdinal.rangeBand())
            .attr("y", yOrdinal(0))
            .attr("height", 0)
            .transition()
            .duration(self.getGraphAnimation().line)
            .attr('y', function(d) {
                return d.metric > 0 ? yOrdinal(d.metric) : yOrdinal(0);
            })
            .attr('height', function(d) {
                return Math.abs(yOrdinal(d.metric) - yOrdinal(0));
            })
            .each('end', function(d) {
                d.rectCoords = {
                    x1: xOrdinal(d.drill),
                    y1: d.metric > 0 ? yOrdinal(d.metric) : yOrdinal(0),
                    x2: xOrdinal(d.drill) + xOrdinal.rangeBand(),
                };

                d.rectCoords.y2 = d.rectCoords.y1 + (Math.abs(yOrdinal(d.metric) - yOrdinal(0)));
            });
    }

    function attachEvents() {
        d3.select('#overlay-rect')
            /*.on("contextmenu", function () {
                d3.event.preventDefault();
            })*/
            .on('mousemove', function() {
                self.mouseMoveEvent(self.getTranslatedCoords(d3.mouse(this)));
            })
            .on('touchmove', function() {
                self.mouseMoveEvent(self.getTranslatedCoords(d3.mouse(this)));
            })
            .on('click', function() {
                self.mouseClickEvent(self.getTranslatedCoords(d3.mouse(this)));
            })
            .on('touchend', function() {
                self.mouseClickEvent(self.getTranslatedCoords(d3.mouse(this)));
            });
    }

    function getTranslatedCoords(coords) {
        var margin = self.getGraphMargin();
        coords[0] -= margin.left;
        coords[1] -= margin.top;
        return coords;
    }

    function isCoordsInsideCircle(circle, coords) {
        if (Math.abs(circle.cx - coords[0]) <= circle.r && Math.abs(circle.cy - coords[1]) <= circle.r) {
            return true;
        }
        return false;
    }

    function isCoordsInsideRect(rectCoords, mouseCoords) {
        if (rectCoords.x1 <= mouseCoords[0] && rectCoords.x2 >= mouseCoords[0] &&
            rectCoords.y1 <= mouseCoords[1] && rectCoords.y2 >= mouseCoords[1]
            ) {
            return true;
        }
        return false;
    }

    function setOtherLines(coords) {

        var parsedData = self.getParsedData();
        var activeDimension = null;
        var activeCircle = null;
        /**
         * Aggregated Loop
         */
        for (var propId in parsedData) {
            for (var i = 0; i < parsedData[propId].data.length; i++) {
                if (parsedData[propId].data[i].activated) {
                  console.log("activated");
                    activeDimension = parsedData[propId].data[i].filterDimension;
                }

                if (!parsedData[propId].data[i].aggregated) {
                    if (self.isCoordsInsideCircle(parsedData[propId].data[i].circleCoords, coords)) {
                        activeCircle = parsedData[propId].data[i];
                    } else {
                        parsedData[propId].data[i].activated = false;
                    }
                }
            }
        }
        //
        d3.selectAll('.line-circle-all')
            .transition()
            .duration(self.getGraphAnimation().circle + 500)
            .attr('fill', function(subCircle) {
                return self.isCoordsInsideCircle(subCircle.circleCoords, coords)
                    ? self.getGraphColorHighlight() : self.getGraphColorLine();
            })
            .attr('stroke-width', function(subCircle) {
                return self.isCoordsInsideCircle(subCircle.circleCoords, coords) ? '2px' : '0px';
            })
            .attr('stroke', self.getGraphColorLine());

        for (var propId in parsedData) {
            if (parsedData[propId].aggregated)
                continue;

            d3.select('.line-' + parsedData[propId].id)
                .transition()
                .duration(self.getGraphAnimation().circle)
                .attr('opacity', function(subCircle) {
                    return activeCircle && subCircle.id === activeCircle.parent ? 1 : 0;
                });

            d3.select('#label-seg-' + parsedData[propId].id)
                .transition()
                .duration(self.getGraphAnimation().circle)
                .attr('opacity', function(label) {
                    return activeCircle && label.parent === activeCircle.parent ? 1 : 0;
                });

            self.animateLineCircles(parsedData[propId].id, activeCircle, activeDimension);

        }
    }

    function animateLineCircles(lineId, activeCircle, activeDimension) {
        var aggregatedCords = self.getAggregatedCoords();
        // console.log(activeCircle);
        // console.log(activeDimension);
        d3.selectAll('.line-circle-' + lineId)
            .attr('cy', function(subCircle) {
                var opacity = d3.select(this).attr('opacity');
                if (!activeCircle && activeDimension === subCircle.filterDimension && opacity === '0') {
                    return aggregatedCords[activeDimension].cy;
                } else {
                    return subCircle.circleCoords.cy;
                }
            })
            .transition()
            .duration(self.getGraphAnimation().circle)
            .attr('cy', function(subCircle) {

                return subCircle.circleCoords.cy;
            })
            .attr('opacity', function(subCircle) {
                return ((activeCircle && activeCircle.parent === subCircle.parent)
                    || (!activeCircle && activeDimension === subCircle.filterDimension)) ? '1' : '0';
            })
            .attr('fill', self.getGraphColorOther())
            .attr('stroke-width', function(subCircle) {
                return (activeCircle && subCircle.parent === activeCircle.parent
                    && activeDimension === subCircle.filterDimension) ? '2px' : '0px';
            })
            .attr('stroke', function(subCircle) {
                return (activeCircle && subCircle.parent === activeCircle.parent
                    && activeDimension === subCircle.filterDimension) ? self.getGraphColorLine() : self.getGraphColorOther();
            })
            .on('end', function(subCircle) {
                // if((activeCircle && activeCircle.parent === subCircle.parent)
                //     || (!activeCircle && activeDimension === subCircle.filterDimension)) {
                //     d3.select(this)
                //         .attr('cy', subCircle.circleCoords.cy);
                // } else {
                //     d3.select(this)
                //         .attr('cy', subCircle.circleCoords.cy);
                // }
            });
    }

    function setAggregatedCircle(coords) {
        d3.selectAll('.line-circle-all')
            .each(function(d) {
                if (self.isCoordsInsideRect(d.coords, coords)) {
                    d.activated = true;
                } else {
                    d.activated = false;
                }
            });
    }

    function mouseMoveEvent(coords) {
        if (self.getGraphByYear()) {
            self.setAggregatedCircle(coords);
        }

        self.setOtherLines(coords);
    }

    function mouseClickEvent(coords) {
        if(self.getGraphMode() === 'bar') {
            self.setGraphMode('line');
            self.renderLineChart();
            return;
        }

        if(!self.getGraphLoaded()) {
            return;
        }

        var selectedCircle = null;
        var parsedData = self.getParsedData();

        d3.selectAll('.line-circles')
            .each(function(d, i) {
                if (self.isCoordsInsideCircle(d.circleCoords, coords)) {
                    if(!selectedCircle || !selectedCircle.aggregated) {
                        selectedCircle = d;
                    }
                }

                if(selectedCircle && i === d3.selectAll('.line-circles')._groups[0].length - 1) {
                    if(selectedCircle.aggregated && parsedData.length > 1) {
                        self.renderBarChart(selectedCircle.dimension);
                    } else {
                        alert('Show line chart with filter: ' + (parsedData.length === 1 ? selectedCircle.dimension : selectedCircle.drill));
                    }
                }
            });


    }

    function generateSVGContainer() {
        var dimension = self.getSvgDimension();

        parentElement.append('svg')
            .attr('width', dimension.w)
            .attr('height', dimension.h)
            .attr('id', 'master-svg-container');

    }

    function render(globalData, byYear) {
        self.setGraphByYear(byYear);
        var range = d3.extent(globalData, function(d) { return d.metric; });

        range[0] *= 1.2;
        range[1] *= 1.2;

        if (range[0] > 0) {
            range[0] = 0;
        }

        if (range[1] < 0) {
            range[1] = 0;
        }

        self.setGraphRange(range);
        self.setParsedData(globalData);

        d3.selectAll('#master-svg-container > *').remove();

        var margin = self.getGraphMargin();

        var dimension = self.getSvgDimension();
        var graphDimension = {
            w: dimension.w - margin.left - margin.right,
            h: dimension.h - margin.top - margin.bottom
        };

        self.setGraphDimension(graphDimension);

        d3.select('#master-svg-container').append("g")
            .attr("id", "graph-chart-container")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



        self.renderLineChart();
    }

    function renderOverlay() {
        var dimension = self.getSvgDimension();
        d3.select('#master-svg-container')
            .append("rect")
            .attr('id', 'overlay-rect')
            .attr('width', dimension.w)
            .attr('height', dimension.h)
            .attr('opacity', '0');
    }

    function renderLineChart() {
        d3.selectAll('#graph-chart-container > *').remove();
        d3.selectAll('#overlay-rect').remove();
        d3.selectAll('#graph-label-container').remove();

        self.renderOverlay();
        self.setGraphLoaded(false);
        var graphDimension = self.getGraphDimension();
        var range = self.getGraphRange();

        var parsedData = self.getParsedData();
        var domainData = parsedData[0].data;

        //Generating X-axis Ordinal
        var xOrdinal =  d3.scaleBand()
            .rangeRound([0, graphDimension.w])
            .domain(domainData.map(function(d) { return d.dimension; }));
        self.setSvgXOrdinal(xOrdinal);

        //Generating Y-axis Ordinal
        var yOrdinal = d3.scaleLinear()
            .range([graphDimension.h, 0])
            .domain([range[0], range[1]]);
        self.setSvgYOrdinal(yOrdinal);

        //Setting Line Path
        var line = d3.line()
            .x(function(d) { return xOrdinal(d.dimension) + (xOrdinal.bandwidth() / 2); })
            .y(function(d) { return yOrdinal(d.metric); });
        self.setSvgLine(line);

        //Drawing Main Bar
        self.generateAxis(false);

        if (self.getGraphByYear()) {
            self.createHighlightBars();
        }

        self.createLines();
    }

    function renderBarChart(dimension) {
        self.setGraphMode('bar');

        d3.selectAll('#graph-chart-container > *').remove();
        d3.selectAll('#graph-label-container').remove();

        var parsedData = self.getParsedData();
        var domainData = [];
        for(var drillId in parsedData) {
            var filter = parsedData[drillId].data.filter(function(d) {
                return d.dimension === dimension;
            });
            if(filter.length) {
                domainData.push(filter[0]);
            }
        }

        var graphDimension = self.getGraphDimension();
        var range = d3.extent(domainData, function(d) { return d.metric; });
        range[0] *= 1.2;
        range[1] *= 1.2;

        if (range[0] > 0) {
            range[0] = 0;
        }

        if (range[1] < 0) {
            range[1] = 0;
        }

        var xOrdinal = d3.scaleOrdinal()
            .range([0, graphDimension.w], 0.2)
            .domain(domainData.map(function(d) {return d.drill; }));
        self.setSvgXOrdinal(xOrdinal);

        //Generating Y-axis Ordinal
        var yOrdinal =  d3.scaleLinear()
            .range([graphDimension.h, 0])
            .domain([range[0], range[1]]);
        self.setSvgYOrdinal(yOrdinal);

        self.generateAxis(true);
        self.generateBars(domainData);
    }

    function isUndefined(data) {
        return typeof(data) === 'undefined' ? true : false;
    }

    function getTranslation(transform) {
      // Create a dummy g for calculation purposes only. This will never
      // be appended to the DOM and will be discarded once this function
      // returns.
      var g = document.createElementNS("http://www.w3.org/2000/svg", "g");

      // Set the transform attribute to the provided string value.
      g.setAttributeNS(null, "transform", transform);

      // consolidate the SVGTransformList containing all transformations
      // to a single SVGTransform of type SVG_TRANSFORM_MATRIX and get
      // its SVGMatrix.
      var matrix = g.transform.baseVal.consolidate().matrix;

      // As per definition values e and f are the ones for the translation.
      return [matrix.e, matrix.f];
    }

    self.generateSVGContainer();
}
