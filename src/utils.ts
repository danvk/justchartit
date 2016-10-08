import * as _ from 'underscore';

/**
 * Fix a relative path to be appropriate for the current URL.
 * We use relative paths to allow onemap to be served from a subdirectory; we assume all paths for
 * XHRs are relative to the onemap root. This function adds a leading '../' if necessary based on
 * locationPath (which should be set to the current window.location.pathname).
 */
export function fixRelativePath(path: string, locationPath: string): string {
  if (!path.length || path.charAt(0) === '/') {
    return path;
  } else if (locationPath.match(/view\/[0-9]+$/)) {
    // View URLs are one level deep.
    return '../' + path;
  } else {
    return path;
  }
}

/**
 * Issue an XHR and return a promise for the JSON that it returns.
 */
export function ajaxPromise<T>(path): Promise<T> {
  const request = new Request(fixRelativePath(path, window.location.pathname), {
    credentials: 'same-origin',  // Include cookies, e.g. for oauth.
  });
  return fetch(request).then(response => {
    if (!response.ok) {
      // Note: this assumes that bad responses still return JSON data.
      return response.json().then(data => Promise.reject(data));
    }
    return response.json();
  });
}

export function postPromise<T>(path: string, payload: any): Promise<T> {
  const requestOpts: RequestInit = {
    method: 'POST',
    credentials: 'same-origin',
  };
  if (payload instanceof FormData) {
    requestOpts.body = payload;
  } else {
    requestOpts.body = JSON.stringify(payload);
    requestOpts.headers = {'Content-Type': 'application/json'};
  }
  const request = new Request(fixRelativePath(path, window.location.pathname), requestOpts);

  return fetch(request).then(response => {
    if (!response.ok) {
      // Note: this assumes that bad responses still return JSON data.
      return response.json().then(data => Promise.reject(data));
    }
    return response.json();
  });
}

/**
 * Map each element of a list to zero, one or more elements in a new list.
 */
export function flatMap<A, B>(xs: A[], fn: (a: A) => B[]): B[] {
  return _.flatten(xs.map(fn), true);
}

/**
 * This is like _.extend(), but it:
 * - applies recursively to sub-objects.
 * - concatenates arrays (rather than treating them as objects with integer keys).
 */
export function extendDeep<A, B, C>(a: A, b: B, c?: C): A&B&C {
  if (c) {
    return extendDeep(extendDeep(a, b), c);
  }

  // There's some aliasing of variables going on here to help the TypeScript compiler.
  // In reality, a === out === arr, they just have different types in the eyes of tsc.
  const out = a as A&B&C;
  if (_.isArray(a)) {
    if (!_.isArray(b)) {
      throw new Error('Tried to extend array with non-array');
    }

    const arr: any[] = (a as any);
    arr.push.apply(arr, b);
    return out;
  }

  for (const k in b) {
    if ((k in a) && _.isObject(a[k])) {
      if (_.isArray(a[k])) {
        out[k] = extendDeep([], a[k], b[k]);
      } else {
        out[k] = extendDeep({}, a[k], b[k]);
      }
    } else {
      out[k] = b[k];
    }
  }
  return out;
}

/**
 * Run callbacks on key/value pairs which enter, exit or change between two objects.
 * enter() is called on new keys.
 * exit() is called on keys which are deleted.
 * update() is called on keys whose values change (according to '===').
 */
export function objectDiff<T>(
  oldObject: {[key: string]: T},
  newObject: {[key: string]: T},
  callbacks: {
    enter?: (newKey: string, newValue: T) => any;
    exit?: (oldKey: string, oldValue: T) => any;
    update?: (key: string, newValue: T, oldValue: T) => any;
  }
) {
  if (!oldObject) {
    // All keys are new
    if (callbacks.enter) {
      _.forEach(newObject, (value, key) => {
        callbacks.enter(key, value);
      });
    }
    return;
  } else if (!newObject) {
    // All keys are deleted.
    if (callbacks.exit) {
      _.forEach(oldObject, (value, key) => {
        callbacks.exit(key, value);
      });
    }
    return;
  }

  _.forEach(oldObject, (oldValue, key) => {
    if (key in newObject) {
      const newValue = newObject[key];
      if (oldValue !== newValue) {
        if (callbacks.update) callbacks.update(key, newValue, oldValue);
      }
    } else {
      if (callbacks.exit) callbacks.exit(key, oldValue);
    }
  });
  _.forEach(newObject, (v, k) => {
    if (!(k in oldObject)) {
      if (callbacks.enter) callbacks.enter(k, v);
    }
  });
}

/**
 * Convert an array to an object by assigning an ID to each of its values.
 */
export function makeObject<T>(array: T[], idFunction: (val: T) => string): {[id: string]: T} {
  const o: {[id: string]: T} = {};
  array.forEach(value => {
    const id = idFunction(value);
    if (id in o) {
      throw new Error(`Duplicate key in utils.makeObject: ${id}`);
    }
    o[id] = value;
  });
  return o;
}

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
 * Return styling options for the given ramp and value.
 */
export function createStyleOptions(
  ramp: (value: number) => string, value: number): google.maps.Data.StyleOptions {
  const opacity = (value === undefined || value === null) ? 0 : 0.85;
  return {
    fillColor: ramp(value || 0),
    fillOpacity: opacity,
    strokeWeight: 0.5,
    strokeColor: '#FFF',
    strokeOpacity: opacity,
    zIndex: 0,
  };
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

export function toQueryString(obj: {[key: string]: number | string}) {
  return _.map(
    obj,
    (value, key) => encodeURIComponent(key) + '=' + encodeURIComponent('' + value)
  ).join('&');
}
