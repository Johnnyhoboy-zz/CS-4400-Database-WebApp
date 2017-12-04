const mysql = require('mysql2')

const conn = mysql.createConnection({
    host: 'academic-mysql.cc.gatech.edu',
    user: 'cs4400_Group_86',
    password: 'mRNogirU',
    database: 'cs4400_Group_86'
});

// gets data for station management
var stationManagementData = function(sort, desc, callback) {
    var sql = "SELECT Name, StopID, EnterFare, ClosedStatus FROM Station ORDER BY " + sort + ' ' + desc;
    conn.query(sql, function(err, result, fields) {
        if (err) throw err;
        callback(result);
    });
};

// gets the view station data for a specific station
var stationData = function(id, callback) {
    var sql = "SELECT * FROM Station WHERE StopID= ?";
    conn.query(sql, [id], function(err, result, fields) {
        if (err) throw err;
        callback(result[0]);
    });
};

// gets the intersection for view station
var busData = function(id, callback) {
    var sql = "SELECT * FROM BusStationIntersection WHERE StopID=?";
    conn.query(sql, [id], function(err, result, fields) {
        if (err) throw err;
        callback(result[0]);
    });
};

// adds a new station to Station
var createStation = function(stopId, name, fare, closed, train, callback) {
    var sql = "INSERT INTO Station(StopID, Name, EnterFare, ClosedStatus, IsTrain) VALUES (?, ?, ?, ?, ?)";
    conn.query(sql, [stopId, name, fare, closed, train], function(err, result, fields) {
        if (err) {
            callback(err.sqlMessage);
        } else {
            callback('');
        }
    });
};

// adds new station to BusStation
var writeBusEntry = function(stopId, intersection) {
    var sql = "INSERT INTO BusStationIntersection(StopID, Intersection) VALUES (?, ?);";
    var arr = [stopId, null]
    if (intersection)
        arr = [stopId, intersection]
    conn.query(sql, arr, function(err, result, fields) {
        if (err) throw err;
    });
};

// updates in Station if a station is open or closed
var updateOpen = function(id, closedStatus) {
    var str = closedStatus ? "1" : "0";
    var sql = "UPDATE Station SET ClosedStatus= ? WHERE StopID=?";
    conn.query(sql, [str, id], function(err, result, fields) {
        if (err) throw err;
    });
};

// updates in Station what the fare for a station is
var updateFare = function(id, fare) {
    var sql = "UPDATE Station SET EnterFare= ? WHERE StopID= ?";
    conn.query(sql, [fare, id], function(err, result, fields) {
        if (err) throw err;
    });
};

// gets the data for the admin breezecard management page
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

var adminBreezecardValueChange = function(cardNumber, value) {
    var sql = "UPDATE Breezecard as b " +
              "SET b.Value = ? " +
              "WHERE b.BreezecardNum = ?;";
    conn.query(sql, [value, cardNumber], function(err, result, fields) {
        if(err) throw err;
  });
};

var adminBreezecardCheckNumBreezecards = function(cardNumber, callback) {
    var sql = "SELECT COUNT(*) AS count " +
              "FROM (Breezecard AS b JOIN User AS u ON (b.BelongsTo = u.Username)) " +
              "WHERE (u.Username = (SELECT c.BelongsTo " +
                                   "FROM Breezecard as c " +
                                   "WHERE c.BreezecardNum = ?));";
    conn.query(sql, [cardNumber], function(err, result, fields) {
        if(err) throw err;
        callback(result);
    });
};

var insertNewBreezecard = function(cardNumber, owner, callback) {
    var sql = "INSERT INTO Breezecard VALUES (?, 0, ?);";
    conn.query(sql, [cardNumber, owner], function(err, result, fields) {
        if(err) {
            callback(err.sqlMessage);
        } else {
            callback('');
        }
    });
};

var transferBreezecard = function(cardNumber, owner, callback) {
    var sql = "UPDATE Breezecard as b " +
              "SET b.BelongsTo = ?" +
              "WHERE b.BreezecardNum = ?;";
    conn.query(sql, [owner, cardNumber], function(err, result, fields) {
        if(err) {
            callback(err.sqlMessage);
        } else {
            callback('');
        }
    });
}

var passengerFlowData = function(start, end, sort, desc, callback) {
    var sql = "SELECT StationNames.Name as stationName, COALESCE(Entry.pIn, 0) " +
              "as passIn, COALESCE(Exiting.pOut, 0) as passOut, COALESCE(Entry.pIn, 0) " +
              "- COALESCE(Exiting.pOut, 0) as flow, Coalesce(Entry.fare, 0.00) as revenue " +
              "FROM " +
              "( " +
                    "( " +
                        "(SELECT s.Name, s.StopID " +
                            "FROM Station as s " +
                            "WHERE s.StopID IN (SELECT s.StopID " +
                                               "FROM Trip as t " +
                                               "WHERE (s.StopID = t.EndsAt OR s.StopID = t.StartsAt) " +
                                               "AND (t.StartTime BETWEEN ? AND ?))) as StationNames " +
                        "LEFT JOIN " +
                            "(SELECT COUNT(*) as pIn, s.StopID, SUM(t.Tripfare) as fare " +
                            "FROM Station as s, Trip as t " +
                            "WHERE s.StopID = t.StartsAt " +
                            "AND (t.StartTime BETWEEN ? AND ?) " +
                            "GROUP BY s.StopID) as Entry " +
                        "ON Entry.StopID = StationNames.StopID " +
                    ") " +
                    "LEFT JOIN " +
                        "(SELECT COUNT(*) as pOut, s.StopID " +
                        "FROM Station as s, Trip as t " +
                        "WHERE s.StopID = t.EndsAt " +
                        "AND (t.StartTime BETWEEN ? AND ?) " +
                        "GROUP BY s.StopID) as Exiting " +
                    "ON Exiting.StopID = StationNames.StopID " +
                ") " +
                "ORDER BY " + sort + ' ' + desc + ';';

    conn.query(sql, [start, end, start, end, start, end], function(err, result, fields) {
        if(err) throw err;
        callback(result);
    });
}

var suspendedCardsData = function(callback) {
    var sql = "SELECT * FROM Breezecard NATURAL JOIN Conflict";
    conn.query(sql, function(err, result, fields) {
        if (err) throw err;
        callback(result);
    });
};

var updateOwner = function(Username, BreezeCardNum, callback) {
    var sql = "UPDATE Breezecard SET BelongsTo= ? WHERE BreezecardNum=?";
    conn.query(sql, [Username, BreezeCardNum], function(err, result, fields) {
        if (err) throw err;
    });
    sql = "DELETE FROM Conflict WHERE Username = ?";
    conn.query(sql, [Username], function(err, result, fields) {
        if (err) throw err;
        callback(result);
    });
};

var loginCheck = function(Username, Password, callback) {
    //Check if User and Pass match in database
    var sql = "SELECT COUNT(*) as count FROM User as a WHERE a.Username = ? AND a.Password = ?;"
    conn.query(sql, [Username, Password], function(err, result, fields) {
        if (err) throw err;
        callback(result);
    });
}

var adminCheck = function(Username, callback) {
    //Check if User is an admin
    var sql = "SELECT COUNT(*) as count2 FROM User as a WHERE a.Username = ? AND a.IsAdmin = 1";
    conn.query(sql, [Username], function(err, result, fields) {
        if (err) throw err;
        callback(result);
    });
};

var registerUser = function(Username, Password, callback) {
    var sql = "INSERT INTO User(Username, Password, IsAdmin) VALUES (?, ?, 0);";
    conn.query(sql, [Username, Password], function(err, result, fields) {
        callback(err);
    });
};

var registerPassenger = function(Username, Email, callback) {
    var sql = "INSERT INTO Passenger(Username, Email) VALUES (?, ?);";
    conn.query(sql, [Username, Email], function(err, result, fields) {
        callback(err);
    });
};

var registerBreezecard = function(BreezecardNum, Username, callback) {
    var sql = "INSERT INTO Breezecard(BreezecardNum, Value, BelongsTo) VALUES (?, ?, ?);";
    conn.query(sql, [BreezecardNum, 0.00, Username], function(err, result, fields) {
        callback(err);
    });
};

var checkBreezecard = function(BreezecardNum, callback) {
    var sql = "SELECT COUNT(*) as count FROM Breezecard as b WHERE b.BreezecardNum = ?";
    conn.query(sql, [BreezecardNum], function(err, result, fields) {
        if (err) throw err;
        callback(result);
    });
};

var createConflict = function(Username,BreezecardNum, callback) {
    var sql = "INSERT INTO Conflict(Username, BreezecardNum) VALUES (?, ?);";
    conn.query(sql, [Username, BreezecardNum], function(err, result, fields) {
        callback(err);
    });
};

var test = function() { console.log('test successful'); };

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
