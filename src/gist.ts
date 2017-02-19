import { dedent } from './utils';

export interface GistFile {
  content: string;
  filename: string;
  language: string;
  raw_url: string;
  size: number;
  truncated: boolean;
  type: string;
}

export interface Gist {
  description: string;
  files: {[filename: string]: GistFile};
  id: string;
  truncated: boolean;
  public: boolean;
  html_url: string;
  created_at: string;
  updated_at: string;
}

// Remove the bits needed to make gists stand-alone for bl.ocks.org.
function stripHeader(html: string): string {
  // TODO: look up the right way to match multiline regexes.
  return html.replace(/<!-- HEADER -->(.|\n)*<!-- \/HEADER -->\n\n/, '');
}

function addHeader(html: string): string {
  return dedent`<!-- HEADER -->
    <script src='https://cdnjs.cloudflare.com/ajax/libs/dygraph/2.0.0/dygraph.min.js'></script>
    <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/dygraph/2.0.0/dygraph.min.css' />

    <link rel='stylesheet' href='index.css' />
    <script src='index.js'></script>
    <!-- \/HEADER -->

    ${html}`;
}

/**
 * Check if the gist is valid. Returns null if it is, otherwise an error.
 */
export function validateGist(gist: Gist): (string|null) {
  for (const f of ['index.html', 'index.css', 'index.js', 'data.tsv']) {
    if (!(f in gist.files)) {
      return `Unable to load gist: missing ${f}.`;
    }
    if (gist.files[f].truncated) {
      // TODO: for files < 10MB, to another fetch to get the full content.
      return `Unable to load gist: ${f} is truncated.`;
    }
  }
}

export function parseGist(gist: Gist) {
  const html = stripHeader(gist.files['index.html'].content);
  const js = gist.files['index.js'].content;
  const css = gist.files['index.css'].content;
  // TODO: be more careful about parsing the TSV.
  const data = gist.files['data.tsv'].content.split('\n').map(line => line.split('\t'));

  return { html, js, css, data };
}
