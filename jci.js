var g;

function chartIt() {
  var data = $('#data').attr('value');
  var opts = $('#options').attr('value');
  opts = eval('({' + opts + '})');

  g = new Dygraph(document.getElementById("chart"), data, opts);
}

$(function() {
  chartIt();
});

/*
{
  series: "Queries",
  x: "2012-04-08",
  text: "i18n launch",
  tickHeight: 60
},
{
  series: "Queries",
  x: "2012-04-17",
  text: "i18n cleanup",
  tickHeight: 60
},
{
  series: "Queries",
  x: "2012-05-10",
  text: "CJK launch",
  tickHeight: 60
},
{
  series: "Queries",
  x: "2012-06-14",
  text: "bag of words launch",
  tickHeight: 60
}
*/

