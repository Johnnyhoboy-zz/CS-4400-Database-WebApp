import path from 'path';
import express from 'express';

var dbconn = require('./dbconnection');
var bodyParser = require('body-parser');

var hash = require('./MD5');

const app = express();
app.use( bodyParser.json() );

const publicPath = express.static(path.join(__dirname, '../'));
const indexPath = path.join(__dirname, '../index.html');

app.use(publicPath);

app.get('/', (req, res) => {
    res.sendFile(indexPath);
});

app.post('/stationManagementData', (req, res) => {
    dbconn.stationManagementData(req.body.sort, req.body.desc, function(result) {
        for (var i = 0; i < result.length; i++) {
            result[i].ClosedStatus = result[i].ClosedStatus ? "Closed" : "Open";
        }
        res.send(result);
    });
});

app.post('/viewStationData', (req, res) => {
    dbconn.stationData(req.body.StopID, function(result) {
        if (!result.IsTrain) {
            dbconn.busData( req.body.StopID, function(busResult) {
                result.intersection = busResult.Intersection ? busResult.Intersection : 'Unavailable';
                res.send(result);
            });
        } else {
            result.intersection = '';
            res.send(result);
        }
    });
});

app.post('/createStation', (req, res) => {
    var isTrain = 0;
    var isClosed = 1;
    if (req.body.IsTrain == 'train')
        isTrain = 1;
    if (req.body.ClosedStatus == 'open')
        isClosed = 0;

    dbconn.createStation(req.body.StopID, req.body.Name,
        req.body.EnterFare, isClosed, isTrain, function(errMsg) {
        if (errMsg != '') {
            res.send({ 'message': errMsg });
            return;
        }
        if (!isTrain) {
            var nearest = req.body.Intersection;
            if (nearest == '')
                nearest = null;
            dbconn.writeBusEntry(req.body.StopID, nearest);
        }
        res.send({ 'message': 'success' });
    });
});

app.post('/updateOpen', (req, res) => {
    var closedStatus = req.body.open == "closed";
    dbconn.updateOpen(req.body.StopID, closedStatus);
});

app.post('/updateFare', (req, res) => {
    dbconn.updateFare(req.body.StopID, req.body.EnterFare);
    res.send({'message': 'pending'});
});

app.get('/test', (req, res) => {
    dbconn.selectFromUser( function(result) {
        res.send(result);
    });
});

app.post('/adminBreezeCardData', (req, res) => {
    if(req.body.suspended) {
        dbconn.adminBreezecardDataSuspended(req.body.owner, req.body.cardNumber, req.body.valueLow, req.body.valueHigh, req.body.sort, req.body.desc, function(result) {
            res.send(result);
        });
    } else {
        dbconn.adminBreezecardData(req.body.owner, req.body.cardNumber, req.body.valueLow, req.body.valueHigh, req.body.sort, req.body.desc, function(result) {
            res.send(result);
        });
    }
});

app.post('/adminBreezecardValueChange', (req, res) => {
    var cardValue = req.body.cardValue;
    if (!isNaN(parseFloat(cardValue))) {
        if (cardValue < 0) {
            cardValue = 0;
        } else if (cardValue > 1000) {
            cardValue = 1000;
        }

        dbconn.adminBreezecardValueChange(req.body.breezecardNumber, cardValue);
        res.send({'message': 'success'});
    } else {
        res.send({'message': 'error'});
    }
});

app.post('/adminBreezecardTransfer', (req, res) => {
    dbconn.adminBreezecardCheckNumBreezecards(req.body.cardNumber, function(result)
    {
        var count = result[0].count;
        dbconn.transferBreezecard(req.body.cardNumber, req.body.newOwner, function(err) {
            if(err == '') {
                if (count == 1) {
                    insertBreezecard(req.body.originalOwner);
                }
                dbconn.deleteIfConflict(req.body.cardNumber);
                res.send({'message':'success'});
            } else {
                res.send({'message':'error'});
            }
        });

    })
});

app.get('/suspendedCardsData', (req, res) => {
    dbconn.suspendedCardsData( function(result) {
        res.send(result);
    });
});

app.post('/updateOwner', (req, res) => {
    
        dbconn.updateOwner(req.body.Username, req.body.otherUser, req.body.BreezecardNum, function (result) {
            //Check if old owner or new owner still has a breezecard, if not then generate new one
            dbconn.checkBreezecardOwnership(req.body.otherUser, function (result) {
                var count = result[0].count;
                if (count == 0) {
                    insertBreezecard(req.body.otherUser);
                }
            });
            res.send({'message':'success'});
        });
    
    });

app.post('/login', (req, res) => {
    var loginExists = 0;
    var IsAdmin = 0;
    var hashedPass = hash.MD5(req.body.Password.toString());

    dbconn.loginCheck(req.body.Username, hashedPass, function (result) {
        loginExists = result[0].count;
        //Login exists
        dbconn.adminCheck(req.body.Username, function (result) {
            IsAdmin = result[0].count2;
            //User is admin
            // console.log(IsAdmin);
            if (loginExists == 0) {
                res.send({'message' : 'loginError'});
            } else if(loginExists == 1 && IsAdmin == 1) {
                res.send({'message' : 'admin'});
            } else if (loginExists == 1 && IsAdmin == 0) {
                res.send({'message' : 'passenger'});
            }
        });


    });

});

app.post('/registerAccount', (req, res) => {
    
        //hashed MD5 password
        var hashedPass = hash.MD5(req.body.Password.toString());
    
        //User requests new breezecard, generate random one not in database
        if(req.body.Type == "new") {
            dbconn.registerUser(req.body.Username, hashedPass, function(err) {
                if (err) {
                    res.send({'message' : 'userError'});
                    return;
                }
                dbconn.registerPassenger(req.body.Username, req.body.Email, function(err) {
                    if(err) {
                        res.send({'message' : 'emailError'});
                        return;
                    }
    
                    var random = generateBreezecard();
                    var count = 0;
                    do {
                        dbconn.checkBreezecard(random, function(result) {
                            count = result[0].count;
                            if (count == 1) {
                                // console.log('count is 1, random num exists already, generating another');
                                random = generateBreezecard();
                            }
                        });
                    } while (count == 1);
    
                    dbconn.registerBreezecard(random, req.body.Username, function(err) {
                        if(err) {
                            res.send({'message' : 'breezecardError'});
                            return;
                        } else
                            res.send({'message': 'success'});
                            return;
                    });
                });
            });
        } else {
            var random = 0;
            //User wants to enter their own breezecard, check if conflict then generate random breezecard
            dbconn.registerUser(req.body.Username, hashedPass, function (err) {
                if (err) {
                    res.send({'message' : 'userError'});
                    return;
                }
                dbconn.registerPassenger(req.body.Username, req.body.Email, function(err) {
                    if(err) {
                        res.send({'message' : 'emailError'});
                        return;
                    }
                    dbconn.checkBreezecard(req.body.BreezecardNum, function(result) {
                        var count = result[0].count;
                        if (count == 1) {
                            // console.log('count is 1, user entered a breezenum already in database, generating random num');
                            var random = generateBreezecard();
                            dbconn.createConflict(req.body.Username, req.body.BreezecardNum, function (err) {
                                res.send({'message':'sameBreezecard'});
                                insertBreezecard(req.body.Username);
                            });
    
                        } else {
                            //use user's unique breezecard
                            dbconn.registerBreezecard(req.body.BreezecardNum, req.body.Username, function(result) {
                                res.send('message':'success');
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
    for(; i < 16; i++) {
        breezeNum += Math.floor(Math.random() * (10));
    }
    return breezeNum;
}

function insertBreezecard(owner) {
    dbconn.insertNewBreezecard(generateBreezecard(), owner, function(err) {
        if(err != '') {
            insertBreezecard(owner);
        }
    });
}

app.post('/passengerFlowData', (req, res) => {
    var start = req.body.timeStart;
    var end = req.body.timeEnd;
    if (start == '') {
        start = '1000/01/01 00:00:00';
    }
    if (end == '') {
         end = '9999/12/31 23:59:59';
    }

    dbconn.passengerFlowData(start, end, req.body.sort, req.body.desc, function(result) {
        res.send(result);
    });
});

app.get('/stationListData', (req, res) => {
    dbconn.stationListData( function(result) {
        var actual = [];
        for(var i = 0; i < result.length; i++) {
            actual.push({'value': result[i].StopID, 'label': result[i].Name + " (" + (result[i].IsTrain ? "Train) " : "Bus) ") + "- $" + result[i].EnterFare});
        }
        console.log(result[i]);
        res.send(actual);
    });
});

app.post('/endStationListData', (req, res) => {
    dbconn.endStationListData(req.body.Start, function(result) {
        var actual = [];
        for(var i = 0; i < result.length; i++) {
            actual.push({'value': result[i].StopID, 'label': result[i].Name + " (" + (result[i].IsTrain ? "Train) " : "Bus) ") + "- $" + result[i].EnterFare});
        }
        console.log(result);
        res.send(actual);
    });
});

app.post('/passengerCards', (req, res) => {
    dbconn.passengerCards(req.body.username, function(result) {

        res.send( result);
    });
});

app.post('/passengerCardData', (req, res) => {
    dbconn.passengerCardData(req.body.username, req.body.sort, req.body.desc, function(result) {
        res.send(result);
    });
});

app.post('/startTrip', (req, res) => {
    dbconn.startTrip(req.body.Start, req.body.BreezecardNum);
    dbconn.getValue(req.body.BreezecardNum, function(result) {
        res.send(result[0]);
    });
});

app.post('/endTrip', (req, res) => {
    dbconn.endTrip(req.body.End, req.body.BreezecardNum);
});

app.post('/removeCard', (req, res) => {
    dbconn.removeCard(req.body.BreezecardNum);
});

app.get('/tripHistoryData', (req, res) => {
    dbconn.tripHistoryData( function(result) {
        res.send(result);
    });
});

app.post('/addCard', (req, res) => {
    dbconn.checkBreezecard(req.body.BreezecardNum, function(result) {
        var count = result[0].count;
            if (count == 1) {
                var random = generateBreezecard();
                dbconn.createConflict(req.body.Username, req.body.BreezecardNum, function (err) {
                    res.send({'message':'sameBreezecard'});
                });
            } else {
                dbconn.registerBreezecard(req.body.BreezecardNum, req.body.Username, function(result) {
                    res.send({'message':'success'});
                });
            }
        });
});

app.post('/addValue', (req, res) => {
     dbconn.addValue(req.body.Value, req.body.Card);
     res.send({ 'message': 'success' });
});

app.post('/updateHistory', (req, res) => {
    var start = req.body.Start;
        var end = req.body.End;
        if (start == '') {
            start = '1000/01/01 00:00:00';
        }
        if(end == '') {
            end = '9999/12/31 00:00:00';
        }
         dbconn.updateHistory(req.body.username, start, end, req.body.sort, req.body.desc, function(result) {
            
            res.send(result);
         });
    });

app.post('/inProgress', (req, res) => {
    dbconn.inProgress(req.body.breezecard, function(result) {
        console.log('progress ' + result[0].count);
        res.send(result[0]);
    });
});

app.post('/getFare', (req, res) => {
    dbconn.getFare(req.body.Start, function(result) {
        res.send(result[0]);
    });
});

app.post('/getValue', (req, res) => {
    dbconn.getValue(req.body.BreezecardNum, function(result) {
        res.send(result[0]);
    });
});


export default app;
