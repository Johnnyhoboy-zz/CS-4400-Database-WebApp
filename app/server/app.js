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

app.get('/stationListData', (req, res) => {
    dbconn.stationListData( function(result) {
        var actual = [];
        for(var i = 0; i < result.length; i++) {
            actual.push({'value': result[i].StopID, 'label': result[i].Name + " (" + (result[i].IsTrain ? "Train) " : "Bus) ") + "- $" + result[i].EnterFare});
        }
        
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

app.get('/passengerCards', (req, res) => {
    dbconn.passengerCards( function(result) {

        res.send(result);
    });
});
app.post('/passengerCardData', (req, res) => {
    dbconn.passengerCardData(req.body.sort, req.body.desc, function(result) {

        res.send(result);
    });
});

app.post('/startTrip', (req, res) => {
    dbconn.startTrip(req.body.Start, req.body.BreezecardNum);
});

app.post('/endTrip', (req, res) => {
    dbconn.endTrip(req.body.End, req.body.BreezecardNum);
});

app.post('/removeCard', (req, res) => {
    dbconn.removeCard(req.body.BreezecardNum);
});

app.get('/tripHistoryData', (req, res) => {
    dbconn.tripHistoryData(req.body.sort, req.body.desc, function(result) {
        res.send(result);
    });
});

app.post('/addCard', (req, res) => {
    dbconn.addCard(req.body.BreezecardNum);
});

app.post('/addValue', (req, res) => {
     dbconn.addValue(req.body.Value, req.body.Card);
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
     dbconn.updateHistory(start, end, req.body.sort, req.body.desc, function(result) {
        
        res.send(result);
     });
});

app.get('/inProgress', (req, res) => {
    dbconn.inProgress(function(result) {
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
