'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dbconn = require('./dbconnection');
var bodyParser = require('body-parser');

var app = (0, _express2.default)();
app.use(bodyParser.json());

var publicPath = _express2.default.static(_path2.default.join(__dirname, '../'));
var indexPath = _path2.default.join(__dirname, '../index.html');

app.use(publicPath);

app.get('/', function (req, res) {
    res.sendFile(indexPath);
});

app.get('/stationManagementData', function (req, res) {
    dbconn.stationManagementData(function (result) {
        res.send(result);
    });
});

app.post('/createStation', function (req, res) {
    console.log(req.body);
    var isTrain = 0;
    var isClosed = 1;
    if (req.body.IsTrain == 'train') isTrain = 1;
    if (req.body.ClosedStatus == 'open') isClosed = 0;

    dbconn.createStation(req.body.StopID, req.body.Name, req.body.EnterFare, isClosed, isTrain, function () {
        if (!isTrain) {
            var nearest = req.body.Intersection;
            if (nearest == '') nearest = null;
            dbconn.writeBusEntry(req.body.StopID, nearest);
        }
    });
});

app.get('/test', function (req, res) {
    dbconn.selectFromUser(function (result) {
        res.send(result);
    });
});

exports.default = app;