/**
* @file Script for adding sorting to charts
*/

function init() {
  var oldIndex, newIndex;
  $( "#chart" ).sortable({
    cursor: "move",
    delay: 150,
    opacity: 0.5,
    start: function(event, ui) {
      oldIndex = ui.item.index();
    },
    stop: function(event, ui) {
      newIndex = ui.item.index();
      switchPos(oldIndex, newIndex);
    }
  });
  $( "#chart" ).disableSelection();
}

/**
*@desc move element of oldIndex to newIndex and change other indices correspondingly
*/
function switchPos(oldIndex, newIndex) {
  console.log(oldIndex, newIndex);
  var savedCharts = JSON.parse(getCharts());
  savedCharts.move(oldIndex, newIndex);
  setCharts(savedCharts);
}

init();

/**
* @desc Method for Array to move a element to new index
*/
Array.prototype.move = function (old_index, new_index) {
    if (new_index >= this.length) {
        var k = new_index - this.length;
        while ((k--) + 1) {
            this.push(undefined);
        }
    }
    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
};
