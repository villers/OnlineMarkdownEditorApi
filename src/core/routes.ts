var fs: any = require('fs');
var child = require('child_process');
var phantomjs = require('phantomjs-prebuilt');

import {Markdown} from './markdown';


function fileExist(fullpath: string) {
  try {
    return fs.statSync(fullpath).isFile();
  } catch (e) {
    return false;
  }
}

export class Route {

  static fetchPdf(req: any, res: any) {
    if (req.body.unmd === undefined || req.body.name === undefined) {
      return  res.json({
        error: 'The input are empty.'
      });
    }

    var unmd: string = req.body.unmd.trim();
    var name: string = req.body.name.trim();
    var tmpHtml: string = `./downloads/html/${name}.html`;
    var tmpPdf: string = `./downloads/pdf/${name}.pdf`;

    fs.writeFile(tmpHtml, Markdown.getFullHtml(req.body.name, unmd), 'utf8', (err: any, data: any) => {
      child.execFile(phantomjs.path, [ 'render.js', tmpHtml, tmpPdf ], (err: any, stdout: any, stderr: any) => {
        if (fileExist(tmpPdf) && fileExist(tmpPdf)) {
          res.download(tmpPdf, name, (err: any) => {
            fs.unlink(tmpPdf);
            fs.unlink(tmpHtml);
          });
        } else {
          res.json({
            error: 'Something wrong with the pdf conversion.'
          });
        }
      });
    });
  }
}
