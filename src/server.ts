'use strict';

var express: any = require('express');
var http: any = require('http');
var app: any = express();
var bodyParser: any = require('body-parser');
var fs: any = require('fs');
var phantomjs = require('phantomjs');
var child = require('child_process');
var process = require('process');

import {Markdown} from './markdown';

function _getFullHtml(name, str) {
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

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.set('port', 8081);

app.post('/factory/fetch_pdf', (req: any, res: any) => {
  var unmd: string = req.body.unmd;
  var json_response: any = {
    data: '',
    error: false
  };

  var html = _getFullHtml(req.body.name, unmd);
  var temp = './tmp.html';

  fs.writeFile(temp, html, 'utf8', (err: any, data: any) => {
    if (err) {
      json_response.error = true;
      json_response.data = 'Pdf conversion.';
      console.error(err);
      res.json(json_response);
    } else {
      var name = req.body.name.trim() + '.pdf';
      var filename = './downloads/' + name;

      child.execFile(phantomjs.path, [ 'render.js', temp, filename ], (err: any, stdout: any, stderr: any) => {
        if (err) {
          console.error(err);
        }
      });
      json_response.data = name;
      res.json(json_response);
    }
  });
});

http.createServer(app).listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'));
});
