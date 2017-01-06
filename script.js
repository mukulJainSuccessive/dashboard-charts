var inHTML = '<div class="grid grid-pad col-md-8 col-md-offset-2">';

$.each(data.type, function(index, value){

    var newItem = '<a class="col-1-4" id="sample-data-'+ value.id +'"><div class="module hero">'
                + '<h4>'+ value.name +'</h4>'
                +  '</div></a>';
    inHTML += newItem;
});
$("#sample-data").html(inHTML + "</div>");


var svgId = 1;
$.each(data.type, function(index, value){
  $("#sample-data-" + value.id).on('click', function() {
    generateChart({
      id: value.chartId,
      chartType: sampleData[value.chartId].default,
      svgId: svgId
    });
    svgId++;
  });
});


function generateChart(params) {
  // console.log(params);
  var param = {
    chartId: params.id,
    svgId: params.svgId,
    elemId: 'chart',
    width: 500,
    height: 500,
    data: sampleData[params.id].data,
    chartTypes: sampleData[params.id].chartTypes
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
