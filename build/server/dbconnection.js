'use strict';

var mysql = require('mysql2');

var conn = mysql.createConnection({
    host: 'academic-mysql.cc.gatech.edu',
    user: 'cs4400_Group_86',
    password: 'mRNogirU',
    database: 'cs4400_Group_86'
});

// gets data for station management
var stationManagementData = function stationManagementData(sort, desc, callback) {
    var sql = "SELECT Name, StopID, EnterFare, ClosedStatus FROM Station ORDER BY " + sort + ' ' + desc;
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
            callback(err.sqlMessage);
        } else {
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
    conn.query(sql, [cardNumber, owner], function (err, result, fields) {
        if (err) {
            callback(err.sqlMessage);
        } else {
            callback('');
        }
    });
};

var transferBreezecard = function transferBreezecard(cardNumber, owner, callback) {
    var sql = "UPDATE Breezecard as b " + "SET b.BelongsTo = ?" + "WHERE b.BreezecardNum = ?;";
    conn.query(sql, [owner, cardNumber], function (err, result, fields) {
        if (err) {
            callback(err.sqlMessage);
        } else {
            callback('');
        }
    });
};

var passengerFlowData = function passengerFlowData(start, end, sort, desc, callback) {
    var sql = "SELECT StationNames.Name as stationName, COALESCE(Entry.pIn, 0) " + "as passIn, COALESCE(Exiting.pOut, 0) as passOut, COALESCE(Entry.pIn, 0) " + "- COALESCE(Exiting.pOut, 0) as flow, Coalesce(Entry.fare, 0.00) as revenue " + "FROM " + "( " + "( " + "(SELECT s.Name, s.StopID " + "FROM Station as s " + "WHERE s.StopID IN (SELECT s.StopID " + "FROM Trip as t " + "WHERE (s.StopID = t.EndsAt OR s.StopID = t.StartsAt) " + "AND (t.StartTime BETWEEN ? AND ?))) as StationNames " + "LEFT JOIN " + "(SELECT COUNT(*) as pIn, s.StopID, SUM(t.Tripfare) as fare " + "FROM Station as s, Trip as t " + "WHERE s.StopID = t.StartsAt " + "AND (t.StartTime BETWEEN ? AND ?) " + "GROUP BY s.StopID) as Entry " + "ON Entry.StopID = StationNames.StopID " + ") " + "LEFT JOIN " + "(SELECT COUNT(*) as pOut, s.StopID " + "FROM Station as s, Trip as t " + "WHERE s.StopID = t.EndsAt " + "AND (t.StartTime BETWEEN ? AND ?) " + "GROUP BY s.StopID) as Exiting " + "ON Exiting.StopID = StationNames.StopID " + ") " + "ORDER BY " + sort + ' ' + desc + ';';

    conn.query(sql, [start, end, start, end, start, end], function (err, result, fields) {
        if (err) throw err;
        callback(result);
    });
};

var suspendedCardsData = function suspendedCardsData(sort, desc, callback) {
    var sql = "SELECT * FROM Breezecard NATURAL JOIN Conflict ORDER BY " + sort + ' ' + desc;
    conn.query(sql, function (err, result, fields) {
        if (err) throw err;
        callback(result);
    });
};

var updateOwner = function updateOwner(Username, OldName, BreezeCardNum, callback) {
    var sql = "UPDATE Breezecard SET BelongsTo= ? WHERE BreezecardNum=?";
    conn.query(sql, [Username, BreezeCardNum]);
    sql = "DELETE FROM Conflict WHERE BreezecardNum = ?";
    conn.query(sql, [BreezeCardNum], function (err, result, fields) {
        if (err) throw err;
        callback(result);
    });
};

var checkBreezecardOwnership = function checkBreezecardOwnership(Username, callback) {
    var sql = "SELECT COUNT(*) as count from Breezecard as b WHERE b.BelongsTo = ?";
    conn.query(sql, [Username], function (err, result, fields) {
        if (err) {
            callback(err);
        } else {
            callback(result);
        }
    });
};

var loginCheck = function loginCheck(Username, Password, callback) {
    //Check if User and Pass match in database
    var sql = "SELECT COUNT(*) as count FROM User as a WHERE a.Username = ? AND a.Password = ?;";
    conn.query(sql, [Username, Password], function (err, result, fields) {
        if (err) throw err;
        callback(result);
    });
};

var adminCheck = function adminCheck(Username, callback) {
    //Check if User is an admin
    var sql = "SELECT COUNT(*) as count2 FROM User as a WHERE a.Username = ? AND a.IsAdmin = 1";
    conn.query(sql, [Username], function (err, result, fields) {
        if (err) throw err;
        callback(result);
    });
};

var registerUser = function registerUser(Username, Password, callback) {
    var sql = "INSERT INTO User(Username, Password, IsAdmin) VALUES (?, ?, 0);";
    conn.query(sql, [Username, Password], function (err, result, fields) {
        callback(err);
    });
};

var registerPassenger = function registerPassenger(Username, Email, callback) {
    var sql = "INSERT INTO Passenger(Username, Email) VALUES (?, ?);";
    conn.query(sql, [Username, Email], function (err, result, fields) {
        callback(err);
    });
};

var registerBreezecard = function registerBreezecard(BreezecardNum, Username, callback) {
    var sql = "INSERT INTO Breezecard(BreezecardNum, Value, BelongsTo) VALUES (?, ?, ?);";
    conn.query(sql, [BreezecardNum, 0.00, Username], function (err, result, fields) {
        callback(err);
    });
};

var checkBreezecard = function checkBreezecard(BreezecardNum, callback) {
    var sql = "SELECT COUNT(*) as count FROM Breezecard as b WHERE b.BreezecardNum = ? AND b.BelongsTo NOT IS NULL";
    conn.query(sql, [BreezecardNum], function (err, result, fields) {
        if (err) throw err;
        callback(result);
    });
};

var createConflict = function createConflict(Username, BreezecardNum, callback) {
    var sql = "INSERT INTO Conflict(Username, BreezecardNum) VALUES (?, ?);";
    conn.query(sql, [Username, BreezecardNum], function (err, result, fields) {
        callback(err);
    });
};

var inProgress = function inProgress(breezecard, callback) {
    var sql = "SELECT COUNT(*) as count FROM Trip WHERE BreezecardNum=? AND EndsAt is null";
    conn.query(sql, [breezecard], function (err, result, fields) {
        if (err) throw err;
        callback(result);
    });
};

var getValue = function getValue(breezecard, callback) {
    var sql = "SELECT Value FROM Breezecard WHERE BreezecardNum = ?";
    conn.query(sql, [breezecard], function (err, result, fields) {
        if (err) throw err;
        callback(result);
    });
};

var startTrip = function startTrip(start, breezecard) {
    var sql = "INSERT INTO Trip(Tripfare, StartsAt, BreezecardNum) " + "VALUES ((SELECT EnterFare FROM Station WHERE StopID=?),?,?)";
    conn.query(sql, [start, start, breezecard], function (err, result, fields) {
        if (err) throw err;
    });
    sql = "UPDATE Breezecard SET Value = Value - (SELECT EnterFare FROM Station WHERE StopID=?) WHERE BreezecardNum = ?";
    conn.query(sql, [start, breezecard, start], function (err, result, fields) {
        if (err) throw err;
    });
};

var getFare = function getFare(start, callback) {
    var sql = "SELECT EnterFare FROM Station WHERE StopID=?";
    conn.query(sql, [start], function (err, result, fields) {
        if (err) throw err;
        callback(result);
    });
};

var endTrip = function endTrip(end, breezecard) {
    var sql = "UPDATE Trip SET EndsAt = ? WHERE EndsAt is null AND BreezecardNum = ?";
    console.log(breezecard);
    conn.query(sql, [end, breezecard], function (err, result, fields) {
        if (err) throw err;
    });
};

var stationListData = function stationListData(callback) {
    var sql = "SELECT StopID, Name, IsTrain, EnterFare FROM Station WHERE ClosedStatus = false";
    conn.query(sql, function (err, result, fields) {
        if (err) throw err;

        callback(result);
    });
};

var endStationListData = function endStationListData(start, callback) {
    var sql = "SELECT StopID, Name, IsTrain, EnterFare FROM Station WHERE ClosedStatus = false AND (IsTrain= (SELECT IsTrain FROM Station WHERE StopID = ?))";
    conn.query(sql, [start], function (err, result, fields) {
        if (err) throw err;
        callback(result);
    });
};

var passengerCards = function passengerCards(username, callback) {
    var sql = "SELECT DISTINCT b.BreezecardNum, b.Value FROM Breezecard as b WHERE b.BreezecardNum NOT IN (SELECT BreezecardNum FROM Conflict) AND BelongsTo = ?";
    conn.query(sql, [username], function (err, result, fields) {
        if (err) throw err;
        callback(result);
    });
};

var passengerCardData = function passengerCardData(username, sort, desc, callback) {
    var sql = "SELECT DISTINCT b.BreezecardNum, b.Value FROM Breezecard as b WHERE b.BreezecardNum NOT IN (SELECT BreezecardNum FROM Conflict) AND BelongsTo = ? ORDER BY " + sort + ' ' + desc + ';';
    console.log(username);
    conn.query(sql, [username], function (err, result, fields) {
        if (err) throw err;
        callback(result);
    });
};

var removeCard = function removeCard(breezecard) {
    var sql = "UPDATE Breezecard SET BelongsTo = null WHERE BreezecardNum = ?";
    conn.query(sql, [breezecard], function (err, result, fields) {
        if (err) throw err;
    });
};

var addValue = function addValue(value, card) {
    var sql = "UPDATE Breezecard SET Value = Value + ? WHERE BreezecardNum=? AND Value + ? <= 1000";
    conn.query(sql, [value, card, value], function (err, result, fields) {
        if (err) throw err;
    });
};

var tripHistoryData = function tripHistoryData(callback) {
    var sql = "SELECT StartTime, StartsAt, EndsAt, Tripfare, BreezecardNum FROM Trip WHERE ";
    conn.query(sql, function (err, result, fields) {
        if (err) throw err;
        callback(result);
    });
};

var addCard = function addCard(breezecard, username, callback) {
    var sql = "INSERT INTO Breezecard(BreezecardNum, Value, BelongsTo) VALUES (?,0,?)";
    conn.query(sql, [breezecard, username], function (err, result, fields) {
        callback(err);
    });
};

var updateHistory = function updateHistory(username, start, end, sort, desc, callback) {
    var sql = "SELECT StartTime, StartsAt, EndsAt, Tripfare, BreezecardNum FROM Trip WHERE Trip.BreezecardNum IN (SELECT BreezecardNum FROM Breezecard AS b WHERE b.BelongsTo=?)" + "AND (StartTime BETWEEN ?AND ?) AND Trip.BreezecardNum NOT IN (SELECT BreezecardNum FROM Conflict) ORDER BY " + sort + " " + desc;
    conn.query(sql, [username, start, end], function (err, result, fields) {
        if (err) throw err;
        callback(result);
    });
};

var deleteIfConflict = function deleteIfConflict(BreezecardNum) {
    var sql = "DELETE FROM Conflict WHERE BreezecardNum = ?";
    conn.query(sql, [BreezecardNum], function (err, result, fields) {});
};

var checkEmail = function checkEmail(email) {
    var sql = "SELECT COUNT(*) FROM Passenger WHERE Email = ?";
    conn.query(sql, [email], function (err, result, fields) {
        callback(result);
    });
};

var test = function test() {
    console.log('test successful');
};

module.exports.checkEmail = checkEmail;
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
module.exports.passengerFlowData = passengerFlowData;
module.exports.suspendedCardsData = suspendedCardsData;
module.exports.updateOwner = updateOwner;
module.exports.registerUser = registerUser;
module.exports.registerPassenger = registerPassenger;
module.exports.registerBreezecard = registerBreezecard;
module.exports.checkBreezecard = checkBreezecard;
module.exports.createConflict = createConflict;
module.exports.loginCheck = loginCheck;
module.exports.adminCheck = adminCheck;
module.exports.addCard = addCard;
module.exports.getValue = getValue;
module.exports.addValue = addValue;
module.exports.inProgress = inProgress;
module.exports.startTrip = startTrip;
module.exports.endTrip = endTrip;
module.exports.getFare = getFare;
module.exports.passengerCardData = passengerCardData;
module.exports.tripHistoryData = tripHistoryData;
module.exports.updateHistory = updateHistory;
module.exports.stationListData = stationListData;
module.exports.endStationListData = endStationListData;
module.exports.removeCard = removeCard;
module.exports.checkBreezecardOwnership = checkBreezecardOwnership;
module.exports.passengerCards = passengerCards;
module.exports.deleteIfConflict = deleteIfConflict;