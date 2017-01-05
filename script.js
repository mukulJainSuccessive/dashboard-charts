var inHTML = '<div class="grid grid-pad">';

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
    if(sampleData[value.label].default === "bar") {
      generateBarChart(sampleData[value.label].data, 'chart', 500, 500, svgId);
    } else if(sampleData[value.label].default === "pie") {
      generatePieChart(sampleData[value.label].data, 'chart', 500, 500, svgId);
    } else if(sampleData[value.label].default === "line") {
      generateLineChart(sampleData[value.label].data, 'chart', 500, 500, svgId);
    } else {
      alert("Unknown default chart type..")
    }
    svgId++;
  });
});
