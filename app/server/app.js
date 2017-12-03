import path from 'path';
import express from 'express';

var dbconn = require('./dbconnection');
var bodyParser = require('body-parser');

const app = express();
app.use( bodyParser.json() );

const publicPath = express.static(path.join(__dirname, '../'));
const indexPath = path.join(__dirname, '../index.html');

app.use(publicPath);

app.get('/', (req, res) => {
    res.sendFile(indexPath);
});

app.get('/stationManagementData', (req, res) => {
    dbconn.stationManagementData( function(result) {
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
                    console.log('count is 1');
                    insertBreezecard(req.body.originalOwner);
                }
                res.send({'message':'success'});
            } else {
                res.send({'message':'error'});
            }
        });

    })
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
    console.log(start);
    console.log(end);
    if (start == '') {
        start = '1000/01/01 00:00:00';
    }
    if(end == '') {
        end = '9999/12/31 00:00:00';
    }
    dbconn.passengerFlowData(start, end, req.body.sort, req.body.desc, function(result) {
        res.send(result);
    });
});

export default app;