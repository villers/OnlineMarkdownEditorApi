import hljs = require('highlight.js');
var MarkdownIt = require('markdown-it');

export class Markdown {
  static Transform(text: string): string {
    var md: any = new MarkdownIt({
      linkify: false,
      typographer: true,
      highlight: function (str: string, lang: string) {
        if (lang && hljs.getLanguage(lang)) {
          return hljs.highlight(lang, str).value;
        } else {
          return hljs.highlightAuto(str).value;
        }
      }
    })
      .use(require('markdown-it-headinganchor'))
      .use(require('markdown-it-toc'))
      .use(require('markdown-it-footnote'))
      .use(require('markdown-it-sub'))
      .use(require('markdown-it-sup'))
      .use(require('markdown-it-mark'))
      .use(require('markdown-it-deflist'))
      .use(require('markdown-it-ins'))
      .use(require('markdown-it-abbr'))
      .use(require('markdown-it-checkbox'))
      .use(require('markdown-it-emoji'));

    md.renderer.rules.table_open = () => '<table class="table table-striped">\n';

    return md.render(text);
  }

  static getFullHtml(name: string, str: string) {
    return `<!DOCTYPE html>
              <html>
                <head>
                  <meta charset="utf-8">
                  <title>${name}</title>
                  <style>
                    ${require('!raw-loader!highlight.js/styles/github.css')}
                    ${require('!raw-loader!stylus-loader!./preview.styl')}
                    img { max-width: 35%; }
                  </style>
                </head>
                <body id="preview">
                 ${Markdown.Transform(str)}
               </body>
             </html>`;
  }
}
