/**
* @file Script for adding/getting chart objects in Session Storage
*/

/**
* @desc returns 'charts' from session Storage.
* @return {string} charts
*/
function getCharts() {
  return sessionStorage.getItem("charts");
}

/**
* @desc sets 'charts' in session Storage and checks if max limit of chart
*       is reached
* @param {Array} [charts=[]]
*/
function setCharts(charts) {
  charts = charts || [];
  sessionStorage.setItem("charts", JSON.stringify(charts));
  checkMaxCharts();
}

function checkMaxCharts() {
  if (JSON.parse(getCharts()).length === 3) {
    $('.module').addClass('disabled');
  } else {
    $('.module').removeClass('disabled');
  }
}
