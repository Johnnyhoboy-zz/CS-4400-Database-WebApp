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

var createStation = function createStation(stopId, name, fare, closed, train, callback) {
    var sql = "INSERT INTO Station(StopID, Name, EnterFare, ClosedStatus, IsTrain) VALUES (\"" + stopId + "\",\"" + name + '\",' + fare + ',' + closed + ',' + train + ');';
    console.log(sql);
    conn.query(sql, function (err, result, fields) {
        if (err) throw err;
    });
    if (callback) callback();
};

var writeBusEntry = function writeBusEntry(stopId, intersection) {
    var sql = "INSERT INTO BusStationIntersection(StopID, Intersection) VALUES (\"" + stopId + '\",NULL);';
    if (intersection) sql = "INSERT INTO BusStationIntersection(StopID, Intersection) VALUES (\"" + stopId + "\",\"" + name + '\");';
    console.log(sql);
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