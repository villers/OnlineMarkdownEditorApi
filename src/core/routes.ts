import child = require('child_process');
import mkdirp = require('mkdirp');

import {Request, Response} from 'express';
import {Markdown} from './markdown';
import {Files} from './Files';

var phantomjs = require('phantomjs');
var web = require('express-decorators');

@web.controller('/')
export class Route {

  constructor() {
    mkdirp('./downloads/pdf', null, null);
    mkdirp('./downloads/html', null, null);
    mkdirp('./downloads/md', null, null);
  }

  @web.post('/fetch_pdf')
  public fetchPdf(req: Request, res: Response) {
    if (req.body.unmd === undefined || req.body.name === undefined) {
      res.json({
        error: 'The input are empty.'
      });
    }

    var unmd: string = req.body.unmd.trim();
    var name: string = req.body.name.trim();
    var tmpHtml: string = `./downloads/html/${name}.html`;
    var tmpPdf: string = `./downloads/pdf/${name}.pdf`;

    Files.Write(tmpHtml, Markdown.getFullHtml(name, unmd), 'utf8', (err: NodeJS.ErrnoException) => {
      child.execFile(phantomjs.path, [ 'render.js', tmpHtml, tmpPdf ], (error: Error, stdout: Buffer, stderr: Buffer) => {
        if (Files.Exist(tmpHtml) && Files.Exist(tmpPdf)) {
          Files.Delete(tmpHtml);
          res.json({
            name: `${name}.pdf`,
            type: 'pdf'
          });
        } else {
          res.status(500).send('Something wrong with the pdf conversion!');
        }
      });
    });
  }

  @web.get('/pdf/:name')
  public downloadPdf(req: Request, res: Response) {
    var name: string = req.params.name.trim();
    var tmpPdf: string = `./downloads/pdf/${name}`;

    if (Files.Exist(tmpPdf)) {
      res.download(tmpPdf, name, (err: any) => {
        Files.Delete(tmpPdf);
      });
    } else {
      res.status(500).send('Cant download pdf file!');
    }
  }
}
