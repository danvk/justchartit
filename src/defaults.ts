import { dedent } from './utils';

export const HTML = dedent`
  <div id='graph'></div>
`.trim();

export const CSS = dedent`
  #graph {
    width: 600px;
    height: 400px;
  }
`.trim();

export const JS = dedent`
  g = new Dygraph(document.getElementById('graph'), data, {

  });
`.trim();

export const data = [
  ['Date', 'A', 'B'],
  ['2016/10/01', '12', '23'],
  ['2016/10/02', '14', '25'],
  ['2016/10/03', '10', '20'],
];
