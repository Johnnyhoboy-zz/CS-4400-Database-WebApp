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
var hash = require('./MD5');

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

app.get('/suspendedCardsData', function (req, res) {
    dbconn.suspendedCardsData(function (result) {
        res.send(result);
    });
});

app.post('/updateOwner', function (req, res) {
    dbconn.updateOwner(req.body.Username, req.body.BreezecardNum, function (result) {
        console.log('Updated Owner');
    });
    res.send({ 'message': 'pending' });
});

app.post('/login', function (req, res) {
    var count = 0;
    var count2 = 0;
    var hashedPass = hash.MD5(req.body.Password.toString());

    dbconn.loginCheck(req.body.Username, hashedPass, function (result) {
        count = result[0].count;
        count2 = result[0].count2;
        console.log(count);
        console.log(count2);
    });

    if (count == 1 && count2 == 1) {}
});

app.post('/registerAccount', function (req, res) {

    //hashed MD5 password
    var hashedPass = hash.MD5(req.body.Password.toString());

    //User requests new breezecard, generate random one not in database
    if (req.body.Type == "new") {
        dbconn.registerUser(req.body.Username, hashedPass, function (result) {});
        dbconn.registerPassenger(req.body.Username, req.body.Email, function (result) {});
        var random = generateBreezecard();
        var count = 0;
        do {
            dbconn.checkBreezecard(random, function (result) {
                count = result[0].count;
                if (count == 1) {
                    console.log('count is 1, random num exists already, generating another');
                    random = generateBreezecard();
                }
            });
        } while (count == 1);

        dbconn.registerBreezecard(random, req.body.Username, function (result) {});
    } else {
        var random = 0;
        //User wants to enter their own breezecard, check if conflict then generate random breezecard
        dbconn.registerUser(req.body.Username, hashedPass, function (result) {});
        dbconn.registerPassenger(req.body.Username, req.body.Email, function (result) {});
        dbconn.checkBreezecard(req.body.BreezecardNum, function (result) {
            count = result[0].count;
            if (count == 1) {
                console.log('count is 1, user entered a breezenum already in database, generating random num');
                var random = generateBreezecard();
                dbconn.createConflict(req.body.Username, req.body.BreezecardNum, function (result) {});
                dbconn.registerBreezecard(random, req.body.Username, function (result) {});
            } else {
                //use user's unique breezecard
                dbconn.registerBreezecard(req.body.BreezecardNum, req.body.Username, function (result) {});
            }
        });
    }
});

function generateBreezecard() {
    var breezeNum = '';
    var i = 0;
    for (; i < 16; i++) {
        breezeNum += Math.floor(Math.random() * 10);
    }
    return breezeNum;
}

exports.default = app;