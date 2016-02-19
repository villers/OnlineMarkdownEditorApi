'use strict';

var express: any = require('express');
var http: any = require('http');
var app: any = express();
var cors = require('cors');
var bodyParser: any = require('body-parser');
var mkdirp = require('mkdirp');

import {Route} from './core/routes';

mkdirp('./downloads/pdf');
mkdirp('./downloads/html');
mkdirp('./downloads/md');

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.set('port', 8081);

app.post('/fetch_pdf', Route.fetchPdf);

http.createServer(app).listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'));
});
