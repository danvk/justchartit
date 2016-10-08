export const HTML = `
  <div id='graph'></div>
`;

export const CSS = `
#graph {
  width: 600px;
  height: 400px;
}
`;

export const JS = `
g = new Dygraph(document.getElementById('graph'), data, {

});
`;

export const data = [
  ['Date', 'A', 'B'],
  ['2016/10/01', '12', '23'],
  ['2016/10/02', '14', '25'],
  ['2016/10/03', '10', '20'],
];
