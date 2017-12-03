'use strict';

var mysql = require('mysql2');

var conn = mysql.createConnection({
    host: 'academic-mysql.cc.gatech.edu',
    user: 'cs4400_Group_86',
    password: 'mRNogirU',
    database: 'cs4400_Group_86'
});

// gets data for station management
var stationManagementData = function stationManagementData(callback) {
    var sql = "SELECT Name, StopID, EnterFare, ClosedStatus FROM Station";
    conn.query(sql, function (err, result, fields) {
        if (err) throw err;
        callback(result);
    });
};

// gets the view station data for a specific station
var stationData = function stationData(id, callback) {
    var sql = "SELECT * FROM Station WHERE StopID= ?";
    conn.query(sql, [id], function (err, result, fields) {
        if (err) throw err;
        callback(result[0]);
    });
};

// gets the intersection for view station
var busData = function busData(id, callback) {
    var sql = "SELECT * FROM BusStationIntersection WHERE StopID=?";
    conn.query(sql, [id], function (err, result, fields) {
        if (err) throw err;
        callback(result[0]);
    });
};

// adds a new station to Station
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

// adds new station to BusStation
var writeBusEntry = function writeBusEntry(stopId, intersection) {
    var sql = "INSERT INTO BusStationIntersection(StopID, Intersection) VALUES (?, ?);";
    var arr = [stopId, null];
    if (intersection) arr = [stopId, intersection];
    conn.query(sql, arr, function (err, result, fields) {
        if (err) throw err;
    });
};

// updates in Station if a station is open or closed
var updateOpen = function updateOpen(id, closedStatus) {
    var str = closedStatus ? "1" : "0";
    var sql = "UPDATE Station SET ClosedStatus= ? WHERE StopID=?";
    conn.query(sql, [str, id], function (err, result, fields) {
        if (err) throw err;
    });
};

// updates in Station what the fare for a station is
var updateFare = function updateFare(id, fare) {
    var sql = "UPDATE Station SET EnterFare= ? WHERE StopID= ?";
    conn.query(sql, [fare, id], function (err, result, fields) {
        if (err) throw err;
    });
};

// gets the data for the admin breezecard management page
var adminBreezecardData = function adminBreezecardData(owner, cardNumber, valueLow, valueHigh, sort, desc, callback) {
    var sql = "SELECT * FROM Breezecard AS b " + "WHERE (? = \'\' OR b.BelongsTo = ?) " + "AND   (? = \'\' OR b.BreezecardNum = ?) " + "AND   (? = \'\' OR b.Value >= ?) " + "AND   (? = \'\' OR b.Value <= ?) " + "AND   (b.BreezecardNum NOT IN (SELECT c.BreezecardNum " + "FROM Conflict AS c)) " + "ORDER BY " + sort + " " + desc;
    conn.query(sql, [owner, owner, cardNumber, cardNumber, valueLow, valueLow, valueHigh, valueHigh], function (err, result, fields) {
        if (err) throw err;
        callback(result);
    });
};

var adminBreezecardDataSuspended = function adminBreezecardDataSuspended(owner, cardNumber, valueLow, valueHigh, sort, desc, callback) {
    var sql = "SELECT * FROM Breezecard AS b " + "WHERE (? = \'\' OR b.BelongsTo = ?) " + "AND   (? = \'\' OR b.BreezecardNum = ?) " + "AND   (? = \'\' OR b.Value >= ?) " + "AND   (? = \'\' OR b.Value <= ?) " + "AND   (b.BreezecardNum NOT IN (SELECT c.BreezecardNum " + "FROM Conflict AS c)) " + "UNION " + "SELECT b.BreezecardNum, b.Value, \'SUSPENDED\' " + "FROM (Breezecard AS b NATURAL JOIN Conflict AS c) " + "WHERE (? = \'\' OR b.BelongsTo = ?) " + "AND   (? = \'\' OR b.BreezecardNum = ?) " + "AND   (? = \'\' OR b.Value >= ?) " + "AND   (? = \'\' OR b.Value <= ?) " + "ORDER BY " + sort + " " + desc;
    conn.query(sql, [owner, owner, cardNumber, cardNumber, valueLow, valueLow, valueHigh, valueHigh, owner, owner, cardNumber, cardNumber, valueLow, valueLow, valueHigh, valueHigh], function (err, result, fields) {
        if (err) throw err;
        callback(result);
    });
};

var adminBreezecardValueChange = function adminBreezecardValueChange(cardNumber, value) {
    var sql = "UPDATE Breezecard as b " + "SET b.Value = ? " + "WHERE b.BreezecardNum = ?;";
    conn.query(sql, [value, cardNumber], function (err, result, fields) {
        if (err) throw err;
    });
};

var adminBreezecardCheckNumBreezecards = function adminBreezecardCheckNumBreezecards(cardNumber, callback) {
    var sql = "SELECT COUNT(*) AS count " + "FROM (Breezecard AS b JOIN User AS u ON (b.BelongsTo = u.Username)) " + "WHERE (u.Username = (SELECT c.BelongsTo " + "FROM Breezecard as c " + "WHERE c.BreezecardNum = ?));";
    conn.query(sql, [cardNumber], function (err, result, fields) {
        if (err) throw err;
        callback(result);
    });
};

var insertNewBreezecard = function insertNewBreezecard(cardNumber, owner, callback) {
    var sql = "INSERT INTO Breezecard VALUES (?, 0, ?);";
    console.log(owner);
    conn.query(sql, [cardNumber, owner], function (err, result, fields) {
        if (err) {
            callback(err.sqlMessage);
        } else {
            callback('');
        }
    });
};

var transferBreezecard = function transferBreezecard(cardNumber, owner, callback) {
    console.log('transfer to:');
    console.log(owner);
    var sql = "UPDATE Breezecard as b " + "SET b.BelongsTo = ?" + "WHERE b.BreezecardNum = ?;";
    conn.query(sql, [owner, cardNumber], function (err, result, fields) {
        if (err) {
            callback(err.sqlMessage);
        } else {
            callback('');
        }
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
module.exports.adminBreezecardData = adminBreezecardData;
module.exports.adminBreezecardDataSuspended = adminBreezecardDataSuspended;
module.exports.adminBreezecardValueChange = adminBreezecardValueChange;
module.exports.adminBreezecardCheckNumBreezecards = adminBreezecardCheckNumBreezecards;
module.exports.insertNewBreezecard = insertNewBreezecard;
module.exports.transferBreezecard = transferBreezecard;