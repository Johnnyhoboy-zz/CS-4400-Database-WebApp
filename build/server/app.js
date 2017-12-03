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

app.post('/viewStationData', function (req, res) {
    dbconn.stationData(req.body.StopID, function (result) {
        if (!result.IsTrain) {
            dbconn.busData(req.body.StopID, function (busResult) {
                result.intersection = busResult.Intersection ? busResult.Intersection : 'Unavailable';
                res.send(result);
            });
        } else {
            result.intersection = '';
            res.send(result);
        }
    });
});

app.post('/createStation', function (req, res) {
    var isTrain = 0;
    var isClosed = 1;
    if (req.body.IsTrain == 'train') isTrain = 1;
    if (req.body.ClosedStatus == 'open') isClosed = 0;

    dbconn.createStation(req.body.StopID, req.body.Name, req.body.EnterFare, isClosed, isTrain, function (errMsg) {
        if (errMsg != '') {
            res.send({ 'message': errMsg });
            return;
        }
        if (!isTrain) {
            var nearest = req.body.Intersection;
            if (nearest == '') nearest = null;
            dbconn.writeBusEntry(req.body.StopID, nearest);
        }
        res.send({ 'message': 'success' });
    });
});

app.post('/updateOpen', function (req, res) {
    var closedStatus = req.body.open == "closed";
    dbconn.updateOpen(req.body.StopID, closedStatus);
});

app.post('/updateFare', function (req, res) {
    dbconn.updateFare(req.body.StopID, req.body.EnterFare);
    res.send({ 'message': 'pending' });
});

app.get('/test', function (req, res) {
    dbconn.selectFromUser(function (result) {
        res.send(result);
    });
});

app.post('/adminBreezeCardData', function (req, res) {
    if (req.body.suspended) {
        dbconn.adminBreezecardDataSuspended(req.body.owner, req.body.cardNumber, req.body.valueLow, req.body.valueHigh, req.body.sort, req.body.desc, function (result) {
            res.send(result);
        });
    } else {
        dbconn.adminBreezecardData(req.body.owner, req.body.cardNumber, req.body.valueLow, req.body.valueHigh, req.body.sort, req.body.desc, function (result) {
            res.send(result);
        });
    }
});

app.post('/adminBreezecardValueChange', function (req, res) {
    var cardValue = req.body.cardValue;
    if (!isNaN(parseFloat(cardValue))) {
        if (cardValue < 0) {
            cardValue = 0;
        } else if (cardValue > 1000) {
            cardValue = 1000;
        }

        dbconn.adminBreezecardValueChange(req.body.breezecardNumber, cardValue);
        res.send({ 'message': 'success' });
    } else {
        res.send({ 'message': 'error' });
    }
});

app.post('/adminBreezecardTransfer', function (req, res) {
    dbconn.adminBreezecardCheckNumBreezecards(req.body.cardNumber, function (result) {
        var count = result[0].count;
        console.log(result);
        console.log(result[0]);
        console.log(count);
        dbconn.transferBreezecard(req.body.cardNumber, req.body.newOwner, function (err) {
            if (err == '') {
                console.log('transferred to new person');
                if (count == 1) {
                    console.log('count is 1');
                    insertBreezecard(req.body.originalOwner);
                }
                res.send({ 'message': 'success' });
            } else {
                res.send({ 'message': 'error' });
            }
        });
    });
});

function generateBreezecard() {
    var breezeNum = '';
    var i = 0;
    for (; i < 16; i++) {
        breezeNum += Math.floor(Math.random() * 10);
    }
    return breezeNum;
}

function insertBreezecard(owner) {
    dbconn.insertNewBreezecard(generateBreezecard(), owner, function (err) {
        if (err != '') {
            insertBreezecard(owner);
        }
    });
}

exports.default = app;