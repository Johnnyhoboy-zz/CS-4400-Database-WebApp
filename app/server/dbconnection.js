const mysql = require('mysql2')

const conn = mysql.createConnection({
    host: 'academic-mysql.cc.gatech.edu',
    user: 'cs4400_Group_86',
    password: 'mRNogirU',
    database: 'cs4400_Group_86'
});


var stationManagementData = function(callback) {
    var sql = "SELECT Name, StopID, EnterFare, ClosedStatus FROM Station";
    conn.query(sql, function(err, result, fields) {
        if (err) throw err;
        callback(result);
    });
};

var stationData = function(id, callback) {
    var sql = "SELECT * FROM Station WHERE StopID= ?";
    conn.query(sql, [id], function(err, result, fields) {
        if (err) throw err;
        callback(result[0]);
    });
};

var busData = function(id, callback) {
    var sql = "SELECT * FROM BusStationIntersection WHERE StopID=?";
    conn.query(sql, [id], function(err, result, fields) {
        if (err) throw err;
        callback(result[0]);
    });
};

var createStation = function(stopId, name, fare, closed, train, callback) {
    var sql = "INSERT INTO Station(StopID, Name, EnterFare, ClosedStatus, IsTrain) VALUES (?, ?, ?, ?, ?)";
    conn.query(sql, [stopId, name, fare, closed, train], function(err, result, fields) {
        if (err) {
            console.log('query ran with error'); 
            callback(err.sqlMessage);
        } else {
            console.log('query run successfully'); 
            callback('');
        }
    });
};

var writeBusEntry = function(stopId, intersection) {
    var sql = "INSERT INTO BusStationIntersection(StopID, Intersection) VALUES (?, ?);";
    var arr = [stopId, null]
    if (intersection)
        arr = [stopId, intersection]
    conn.query(sql, arr, function(err, result, fields) {
        if (err) throw err;
    });
};

var updateOpen = function(id, closedStatus) {
    var str = closedStatus ? "1" : "0";
    var sql = "UPDATE Station SET ClosedStatus= ? WHERE StopID=?";
    conn.query(sql, [str, id], function(err, result, fields) {
        if (err) throw err;
    });
};

var updateFare = function(id, fare) {
    var sql = "UPDATE Station SET EnterFare= ? WHERE StopID= ?";
    conn.query(sql, [fare, id], function(err, result, fields) {
        if (err) throw err;
    });
};

var test = function() { console.log('test successful'); };

var adminBreezecardData = function(owner, cardNumber, valueLow, valueHigh, sort, desc, callback) {
    var sql = "SELECT * FROM Breezecard AS b " +
              "WHERE (? = \'\' OR b.BelongsTo = ?) " +
              "AND   (? = \'\' OR b.BreezecardNum = ?) " +
              "AND   (? = \'\' OR b.Value >= ?) " +
              "AND   (? = \'\' OR b.Value <= ?) " +
              "AND   (b.BreezecardNum NOT IN (SELECT c.BreezecardNum " +
                                             "FROM Conflict AS c)) " +
              "ORDER BY " + sort + " " + desc;
    conn.query(sql, [owner, owner, cardNumber, cardNumber, valueLow, valueLow, valueHigh, valueHigh],
        function(err, result, fields) {
            if (err) throw err;
            callback(result);
    });
};

var adminBreezecardDataSuspended = function(owner, cardNumber, valueLow, valueHigh, sort, desc, callback) {
    var sql = "SELECT * FROM Breezecard AS b " +
              "WHERE (? = \'\' OR b.BelongsTo = ?) " +
              "AND   (? = \'\' OR b.BreezecardNum = ?) " +
              "AND   (? = \'\' OR b.Value >= ?) " +
              "AND   (? = \'\' OR b.Value <= ?) " +
              "AND   (b.BreezecardNum NOT IN (SELECT c.BreezecardNum " +
                                             "FROM Conflict AS c)) " +
              "UNION " +
              "SELECT b.BreezecardNum, b.Value, \'SUSPENDED\' " +
              "FROM (Breezecard AS b NATURAL JOIN Conflict AS c) " +
              "WHERE (? = \'\' OR b.BelongsTo = ?) " +
              "AND   (? = \'\' OR b.BreezecardNum = ?) " +
              "AND   (? = \'\' OR b.Value >= ?) " +
              "AND   (? = \'\' OR b.Value <= ?) " +
              "ORDER BY " + sort + " " + desc;
    conn.query(sql, [owner, owner, cardNumber, cardNumber, valueLow, valueLow, valueHigh, valueHigh,
                     owner, owner, cardNumber, cardNumber, valueLow, valueLow, valueHigh, valueHigh],
        function(err, result, fields) {
            if (err) throw err;
            callback(result);
    });
};


var stationListData = function(callback) {
    var sql = "SELECT Name FROM Station WHERE ClosedStatus = false";
    conn.query(sql, function(err, result, fields) {
        if (err) throw err;
        callback(result);
    });
};

var passengerCardData = function(callback) {
    var sql = "SELECT BreezecardNum, Value FROM Breezecard WHERE BelongsTo='busrider73'";
    conn.query(sql, function(err, result, fields) {
        if (err) throw err;
        callback(result);
    });
};

var addValue = function(value, card) {
    var sql = "UPDATE Breezecard SET Value = Value + ? WHERE BreezecardNum=?";
    conn.query(sql, [value, card], function(err, result, fields) {
        if (err) throw err;
    });
};

var tripHistoryData = function(start, end, callback) {
    var sql = "SELECT StartTime, StartsAt, EndsAt, Tripfare, BreezecardNum FROM Trip WHERE StartsAt > ? AND StartsAt < ?";
    conn.query(sql, [start, end], function(err, result, fields) {
        if (err) throw err;
        console.log(result);
        callback(result);
    });
};

var addCard = function(breezecard) {
    var sql = "INSERT INTO Breezecard(BreezecardNum, Value) VALUES (?,0)";
    conn.query(sql,[breezecard], function(err, result, fields) {
        if (err) throw err;
    });
};
/*
var updateHistory = function(start, end, callback) {
    var sql = "SELECT StartTime, StartsAt, EndsAt, Tripfare, BreezecardNum FROM Trip WHERE StartsAt > ? AND StartsAt < ?";
    conn.query(sql, [start, end], function(err, result, fields) {
        if (err) throw err;
        console.log(result);
        callback(result);
    });
};
*/
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
module.exports.addCard = addCard;
module.exports.addValue = addValue;
module.exports.passengerCardData = passengerCardData;
module.exports.tripHistoryData = tripHistoryData;
//module.exports.updateHistory = updateHistory;
module.exports.stationListData = stationListData;