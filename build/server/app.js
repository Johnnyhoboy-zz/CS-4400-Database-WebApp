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
    var loginExists = 0;
    var IsAdmin = 0;
    var hashedPass = hash.MD5(req.body.Password.toString());

    dbconn.loginCheck(req.body.Username, hashedPass, function (result) {
        loginExists = result[0].count;
        //Login exists
        dbconn.adminCheck(req.body.Username, function (result) {
            IsAdmin = result[0].count2;
            //User is admin
            console.log(IsAdmin);
            if (loginExists == 0) {
                res.send({ 'message': 'loginError' });
            } else if (loginExists == 1 && IsAdmin == 1) {
                res.send({ 'message': 'admin' });
            } else if (loginExists == 1 && IsAdmin == 0) {
                res.send({ 'message': 'passenger' });
            }
        });
    });
});

app.post('/registerAccount', function (req, res) {

    //hashed MD5 password
    var hashedPass = hash.MD5(req.body.Password.toString());

    //User requests new breezecard, generate random one not in database
    if (req.body.Type == "new") {
        dbconn.registerUser(req.body.Username, hashedPass, function (err) {
            if (err) {
                res.send({ 'message': 'userError' });
            }
            dbconn.registerPassenger(req.body.Username, req.body.Email, function (err) {
                if (err) {
                    res.send({ 'message': 'emailError' });
                }

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

                dbconn.registerBreezecard(random, req.body.Username, function (err) {
                    if (err) {
                        res.send({ 'message': 'breezecardError' });
                    }
                });
            });
        });
    } else {
        var random = 0;
        //User wants to enter their own breezecard, check if conflict then generate random breezecard
        dbconn.registerUser(req.body.Username, hashedPass, function (err) {
            if (err) {
                res.send({ 'message': 'userError' });
            }
            dbconn.registerPassenger(req.body.Username, req.body.Email, function (err) {
                if (err) {
                    res.send({ 'message': 'emailError' });
                }
                dbconn.checkBreezecard(req.body.BreezecardNum, function (result) {
                    var count = result[0].count;
                    if (count == 1) {
                        console.log('count is 1, user entered a breezenum already in database, generating random num');
                        var random = generateBreezecard();
                        dbconn.createConflict(req.body.Username, req.body.BreezecardNum, function (err) {
                            if (err) {
                                res.send({ 'message': 'conflictError' });
                            } else {
                                res.send({ 'message': 'sameBreezecard' });
                            }
                        });
                        dbconn.registerBreezecard(random, req.body.Username, function (err) {
                            if (err) {
                                res.send({ 'message': 'breezecardError' });
                            }
                        });
                    } else {
                        //use user's unique breezecard
                        dbconn.registerBreezecard(req.body.BreezecardNum, req.body.Username, function (result) {
                            if (err) {
                                res.send({ 'message': 'breezecardError' });
                            }
                        });
                    }
                });
            });
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