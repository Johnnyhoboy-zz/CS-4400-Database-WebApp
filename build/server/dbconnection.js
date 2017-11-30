'use strict';

var mysql = require('mysql2');

var conn = mysql.createConnection({
    host: 'academic-mysql.cc.gatech.edu',
    user: 'cs4400_Group_86',
    password: 'mRNogirU',
    database: 'cs4400_Group_86'
});

var stationManagementData = function stationManagementData(callback) {
    var sql = "SELECT Name, StopID, EnterFare, ClosedStatus FROM Station";
    conn.query(sql, function (err, result, fields) {
        if (err) throw err;
        callback(result);
    });
};

var stationData = function stationData(id, callback) {
    var sql = "SELECT * FROM Station WHERE StopID=\"" + id + "\"";
    conn.query(sql, function (err, result, fields) {
        if (err) throw err;
        callback(result[0]);
    });
};

var busData = function busData(id, callback) {
    var sql = "SELECT * FROM BusStationIntersection WHERE StopID=\"" + id + "\"";
    conn.query(sql, function (err, result, fields) {
        if (err) throw err;
        callback(result[0]);
    });
};

var createStation = function createStation(stopId, name, fare, closed, train, callback) {
    var sql = "INSERT INTO Station(StopID, Name, EnterFare, ClosedStatus, IsTrain) VALUES (\"" + stopId + "\",\"" + name + '\",' + fare + ',' + closed + ',' + train + ');';
    conn.query(sql, function (err, result, fields) {
        if (err) {
            console.log('query ran with error');
            callback(err.sqlMessage);
        } else {
            console.log('query run successfully');
            callback('');
        }
    });
};

var writeBusEntry = function writeBusEntry(stopId, intersection) {
    var sql = "INSERT INTO BusStationIntersection(StopID, Intersection) VALUES (\"" + stopId + '\",NULL);';
    if (intersection) sql = "INSERT INTO BusStationIntersection(StopID, Intersection) VALUES (\"" + stopId + "\",\"" + intersection + '\");';
    conn.query(sql, function (err, result, fields) {
        if (err) throw err;
    });
};

var updateOpen = function updateOpen(id, closedStatus) {
    var str = closedStatus ? "false" : "true";
    var sql = "UPDATE Station SET ClosedStatus=" + str + " WHERE StopID=\"" + id + "\"";
    conn.query(sql, function (err, result, fields) {
        if (err) throw err;
    });
};

var test = function test() {
    console.log('test successful');
};

module.exports.test = test;
module.exports.stationManagementData = stationManagementData;
module.exports.createStation = createStation;
module.exports.writeBusEntry = writeBusEntry;
module.exports.stationData = stationData;
module.exports.busData = busData;
module.exports.updateOpen = updateOpen;