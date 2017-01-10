/**
* @file Script for configuring d3 charts of sample data.
* @summary Renders buttons for every sample data present in config/data file,
*          listens for button click,
*          disable/enables buttons after max chart generation,
*          removes all saved charts on initialization.
*/

var selectedGraphs = [];

function renderSampleDate() {

  var inHTML = '<div class="grid grid-pad col-md-8 col-md-offset-2">';

  $.each(data.type, function(index, value){

      var newItem = '<a class="col-1-4" id="sample-data-'+ value.id +'" disabled="disabled"><div class="module hero">'
                  + '<h4>'+ value.name +'</h4>'
                  +  '</div></a>';
      inHTML += newItem;
  });
  $("#sample-data").html(inHTML + "</div>");

}

function addListneres() {
  var svgId = 1;
  $.each(data.type, function(index, value){
    $("#sample-data-" + value.id).on('click', function() {
      if ($(this).children().hasClass('disabled')) {
        alert("Can't add more than 3 Charts!")
        return;
      }
      generateChart({
        id: value.chartId,
        chartType: sampleData[value.chartId].default,
        svgId: svgId
      });
      svgId++;
    });
  });
}

function cleanSessionData() {
  setCharts();
}

renderSampleDate();
addListneres();
cleanSessionData();
