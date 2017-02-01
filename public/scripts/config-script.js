/**
* @file Script for configuring d3 charts of sample data.
* @summary Renders buttons for every sample data present in config/data file,
*          listens for button click,
*          disable/enables buttons after max chart generation,
*          removes all saved charts on initialization.
*/

$(document).ready(function() {

    function fetchData(callback) {
      $.ajax({
          url: "http://localhost:8085/getData"
      }).then(function(data) {
         callback(data.type)
      });
    }


    fetchData(function(data) {
      renderSampleDate(data);
      addListneres(data);
      cleanSessionData();
    });
});
var selectedGraphs = [];

function renderSampleDate(data) {

  var inHTML = '<div class="grid grid-pad col-md-8 col-md-offset-2">';

  $.each(data, function(index, value){

      var newItem = '<a class="col-1-4" id="sample-data-'+ value.id +'" disabled="disabled"><div class="module hero">'
                  + '<h4>'+ value.name +'</h4>'
                  +  '</div></a>';
      inHTML += newItem;
  });
  $("#sample-data").html(inHTML + "</div>"
                                + '<button id="submit" class="btn btn-warn">'
                                +  '<a href="dashboard.html">Save Charts</a>'
                                +  '</button>'
                        );

}

function addListneres(data) {
  var svgId = 1;
  $.each(data, function(index, value){
    $("#sample-data-" + value.id).on('click', function() {

      if ($(this).children().hasClass('disabled')) {
        alert("Can't add more than 3 Charts!")
        return;
      }
      $.post({
          url: "http://localhost:8085/getSampleData",
          data: {
            id: value.chartId
          }
      }).then(function(data) {
          console.log(data);
          generateChart({
            id: value.chartId,
            chartType: 'line',
            svgId: svgId,
            sampleData: data
          });
          svgId++;
      });
    });
  });
}

function cleanSessionData() {
  setCharts();
}
