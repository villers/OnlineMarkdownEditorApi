'use strict';

import express = require('express');
import http = require('http');
import cors = require('cors');
import bodyParser = require('body-parser');

import {Route} from './core/routes';
import {Files} from './core/files';

var config = Files.ReadJson('package.json').config;

var app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

let RouteController: any = new Route();
RouteController.register(app);

http.createServer(app).listen(config.port, () => {
  console.log(`Express server listening on port ${config.port}`);
});
