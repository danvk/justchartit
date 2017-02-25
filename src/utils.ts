import * as _ from 'underscore';

/**
 * Do the two objects have the same keys and values?
 * This checks for equality using '==='. It does not do a deep comparison of values.
 */
export function shallowEqual(a: Object, b: Object) {
  if (!!a !== !!b) return false;  // they need to be either both be null or non-null.
  for (const k in a) {
    if (a[k] !== b[k]) {
      return false;
    }
  }
  for (const k in b) {
    if (!(k in a)) {
      return false;
    }
  }
  return true;
}

/**
 * Removes leading indents from a template string without removing all leading whitespace.
 * Taken from tslint.
 */
export function dedent(strings: TemplateStringsArray, ...values: string[]) {
  let fullString = strings.reduce((accumulator, str, i) => {
      return accumulator + values[i - 1] + str;
  });

  // match all leading spaces/tabs at the start of each line
  const match = fullString.match(/^[ \t]*(?=\S)/gm);
  if (!match) {
      // e.g. if the string is empty or all whitespace.
      return fullString;
  }

  // find the smallest indent, we don't want to remove all leading whitespace
  const indent = Math.min(...match.map(el => el.length));
  const regexp = new RegExp('^[ \\t]{' + indent + '}', 'gm');
  fullString = indent > 0 ? fullString.replace(regexp, '') : fullString;
  return fullString;
}

/** Convert the cells to a TSV string, omitting empty rows/cols at the bottom/right. */
export function formatData(cells: string[][]): string {
  let maxCol = 0;
  let maxRow = 0;
  cells.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell) {
        maxRow = Math.max(i, maxRow);
        maxCol = Math.max(j, maxCol);
      }
    });
  });

  return _.range(0, maxRow + 1).map(
    row => _.range(0, maxCol + 1).map(col => cells[row][col]).join(','))
    .join('\n');
}
