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

app.get('/suspendedCardsData', (req, res) => {
    dbconn.suspendedCardsData( function(result) {
        res.send(result);
    });
});

app.post('/updateOwner', (req, res) => {
    dbconn.updateOwner(req.body.Username, req.body.BreezecardNum);
    res.send({'message': 'pending'});
});

app.post('/registerAccount', (req, res) => {
    var hashedPass = hash.MD5(req.body.Password.toString());
    if(req.body.Type == "new") {
        var random = generateBreezecard();
        dbconn.registerUser(req.body.Username, hashedPass);
        dbconn.registerPassenger(req.body.Username, req.body.Email);
        dbconn.registerBreezecard(random, req.body.Username);
    } else {
        dbconn.registerUser(req.body.Username, hashedPass);
        dbconn.registerPassenger(req.body.Username, req.body.Email);
        dbconn.registerBreezecard(req.body.BreezecardNum, req.body.Username); 
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





export default app;
