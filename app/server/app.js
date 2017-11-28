import path from 'path';
import express from 'express';

var dbconn = require('./dbconnection');

const app = express();

const publicPath = express.static(path.join(__dirname, '../'));
const indexPath = path.join(__dirname, '../index.html');

app.use(publicPath);

app.get('/', (req, res) => {
    res.sendFile(indexPath);
});

app.get('/stationManagementData', (req, res) => {
    dbconn.selectForStationManagement( function(result) {
        res.send(result);
    });
});

app.get('/test', (req, res) => {
    dbconn.selectFromUser( function(result) {
        res.send(result);
    });
});

export default app;
