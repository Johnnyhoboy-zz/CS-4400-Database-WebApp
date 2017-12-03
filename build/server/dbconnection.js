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
    var sql = "SELECT * FROM Station WHERE StopID= ?";
    conn.query(sql, [id], function (err, result, fields) {
        if (err) throw err;
        callback(result[0]);
    });
};

var busData = function busData(id, callback) {
    var sql = "SELECT * FROM BusStationIntersection WHERE StopID=?";
    conn.query(sql, [id], function (err, result, fields) {
        if (err) throw err;
        callback(result[0]);
    });
};

var createStation = function createStation(stopId, name, fare, closed, train, callback) {
    var sql = "INSERT INTO Station(StopID, Name, EnterFare, ClosedStatus, IsTrain) VALUES (?, ?, ?, ?, ?)";
    conn.query(sql, [stopId, name, fare, closed, train], function (err, result, fields) {
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
    var sql = "INSERT INTO BusStationIntersection(StopID, Intersection) VALUES (?, ?);";
    var arr = [stopId, null];
    if (intersection) arr = [stopId, intersection];
    conn.query(sql, arr, function (err, result, fields) {
        if (err) throw err;
    });
};

var updateOpen = function updateOpen(id, closedStatus) {
    var str = closedStatus ? "1" : "0";
    var sql = "UPDATE Station SET ClosedStatus= ? WHERE StopID=?";
    conn.query(sql, [str, id], function (err, result, fields) {
        if (err) throw err;
    });
};

var updateFare = function updateFare(id, fare) {
    var sql = "UPDATE Station SET EnterFare= ? WHERE StopID= ?";
    conn.query(sql, [fare, id], function (err, result, fields) {
        if (err) throw err;
    });
};

var suspendedCardsData = function suspendedCardsData(callback) {
    var sql = "SELECT * FROM Breezecard NATURAL JOIN Conflict";
    conn.query(sql, function (err, result, fields) {
        //console.log(sql);
        if (err) throw err;
        callback(result);
    });
};

var updateOwner = function updateOwner(username, breezeCardNum) {
    var sql = "UPDATE Breezecard SET BelongsTo= ? WHERE BreezecardNum=?";
    conn.query(sql, [username, breezeCardNum], function (err, result, fields) {
        if (err) throw err;
    });
    sql = "DELETE FROM Conflict WHERE Username = ?";
    conn.query(sql, [Username], function (err, result, fields) {
        if (err) throw err;
    });
};

var registerUser = function registerUser(Username, password, email) {
    var sql = "INSERT INTO Username(username, password, IsAdmin) VALUES (?, ?, ?);";
    conn.query(sql, [username, password, 0], function (err, result, fields) {
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
module.exports.updateFare = updateFare;
module.exports.suspendedCardsData = suspendedCardsData;
module.exports.updateOwner = updateOwner;
module.exports.registerUser = registerUser;