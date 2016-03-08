'use strict';

import express = require('express');
import http = require('http');
import cors = require('cors');
import bodyParser = require('body-parser');

import {Route} from './core/routes';

var app = express();
app.set('port', 8081);
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

let RouteController: any = new Route();
RouteController.register(app);

http.createServer(app).listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'));
});
