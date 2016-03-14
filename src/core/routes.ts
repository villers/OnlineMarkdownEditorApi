import child = require('child_process');
import mkdirp = require('mkdirp');

import {Request, Response} from 'express';
import {Markdown} from './markdown';
import {Files} from './files';

var phantomjs = require('phantomjs-prebuilt');
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
      return res.status(500).send('The input are empty.');
    }

    var unmd: string = req.body.unmd.trim();
    var name: string = req.body.name.trim();
    var tmpHtml: string = `./downloads/html/${name}.html`;
    var tmpPdf: string = `./downloads/pdf/${name}.pdf`;

    if (Files.NameIsBad(name)) {
      return res.status(500).send('The filename is incorect.');
    }

    Files.Write(tmpHtml, Markdown.getFullHtml(name, unmd), 'utf8', (err: NodeJS.ErrnoException) => {
      child.execFile(phantomjs.path, [ 'render.js', tmpHtml, tmpPdf ], (error: Error, stdout: Buffer, stderr: Buffer) => {
        if (!Files.Exist(tmpHtml) && !Files.Exist(tmpPdf)) {
          return res.status(500).send('Something wrong with the pdf conversion!');
        } else {
          Files.Delete(tmpHtml);
          return res.json({
            name: `${name}.pdf`,
            type: 'pdf'
          });
        }
      });
    });
  }

  @web.get('/pdf/:name')
  public downloadPdf(req: Request, res: Response) {
    if (req.params.name === undefined) {
      return res.status(500).send('The input are empty.');
    }

    var name: string = req.params.name.trim();
    var tmpPdf: string = `./downloads/pdf/${name}`;

    if (Files.NameIsBad(name)) {
      return res.status(500).send('The filename is incorect.');
    }

    if (!Files.Exist(tmpPdf)) {
      return res.status(500).send('Cant download pdf file!');
    } else {
      res.download(tmpPdf, name, (err: any) => {
        Files.Delete(tmpPdf);
      });
    }
  }
}
