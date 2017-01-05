var sampleData = {
  "country" : {
    'data': {
      "India": 30369837,
      "China": 23093097,
      "North-Korea": 22219232,
      "South-Africa": 17827160,
      "Norway": 25492544
    },
    "chart-types": ['bar', 'pie'],
    "default": "pie"
  },

  'currency' : {
    'data': {
      '24-Apr-07' :	'93.24',
      '25-Apr-07' :	'95.35',
      '26-Apr-07' :	'98.84',
      '27-Apr-07' :	'99.92',
      '30-Apr-07' :	'99.80',
      '1-May-07' :	'99.47',
      '2-May-07' :	'100.39',
      '3-May-07' :	'100.40',
      '4-May-07' :	'100.81',
      '7-May-07' :	'103.92',
      '8-May-07' :	'105.06',
      "9-May-07" :	'106.88',
      '10-May-07' :	'107.34',
      '11-May-07': '108.74'
    },
    "chart-types": ['bar', 'line'],
    "default": "bar"
  },

  'continent' : {
    'data': {
      "Africa": 30369837,
      "Europe": 23093097,
      "North-America": 22219232,
      "South-America": 17827160,
      "Other-5": 25492544
    },
    "chart-types": ['bar', 'line'],
    "default": "bar"
  }
};

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
      //pie chart rendering
    } else if(sampleData[value.label].default === "line") {
      //line chart rendering
    } else {
      alert("Unknown default chart type..")
    }
    svgId++;
  });
});
