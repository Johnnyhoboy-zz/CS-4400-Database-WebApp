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
                                               "AND (t.StartTIme BETWEEN ? AND ?))) as StationNames " +
                        "LEFT JOIN " +
                            "(SELECT COUNT(*) as pIn, s.StopID, SUM(t.Tripfare) as fare " +
                            "FROM Station as s, Trip as t " +
                            "WHERE s.StopID = t.StartsAt " +
                            "AND (t.StartTIme BETWEEN ? AND ?) " +
                            "GROUP BY s.StopID) as Entry " +
                        "ON Entry.StopID = StationNames.StopID " +
                    ") " +
                    "LEFT JOIN " +
                        "(SELECT COUNT(*) as pOut, s.StopID " +
                        "FROM Station as s, Trip as t " +
                        "WHERE s.StopID = t.EndsAt " +
                        "AND (t.StartTIme BETWEEN ? AND ?) " +
                        "GROUP BY s.StopID) as Exiting " +
                    "ON Exiting.StopID = StationNames.StopID " +
                ") " +
                "ORDER BY " + sort + ' ' + desc + ';';

    conn.query(sql, [start, end, start, end, start, end], function(err, result, fields) {
        if(err) throw err;
        callback(result);
    });
}

var inProgress = function(callback) {
    var sql = "SELECT COUNT(*) as count FROM Trip WHERE EndsAt is null";
    conn.query(sql, function(err, result, fields) {
        if (err) throw err;
        callback(result);
    });
}

var getValue = function(breezecard, callback) {
    var sql = "SELECT Value FROM Breezecard WHERE BreezecardNum = ?";
    conn.query(sql, [breezecard], function(err, result, fields) {
        if (err) throw err;
        callback(result);
    });
};

var startTrip = function(start, breezecard) {
    var sql = "INSERT INTO Trip(Tripfare, StartsAt, BreezecardNum) " +
    "VALUES ((SELECT EnterFare FROM Station WHERE StopID=?),?,?)";
    conn.query(sql, [start, start, breezecard], function(err, result, fields) {
        if (err) throw err;
    });
     sql = "UPDATE Breezecard SET Value = Value - (SELECT EnterFare FROM Station WHERE Name=?) WHERE BreezecardNum = ?";
    conn.query(sql, [start, breezecard], function(err, result, fields) {
        if (err) throw err;
    });
};

var getFare = function(start, callback) {
    var sql = "SELECT EnterFare FROM Station WHERE Name=?";
    conn.query(sql, [start], function(err, result, fields) {
        if (err) throw err;
        callback(result);
    });
}

var endTrip = function(end, breezecard) {
    var sql = "UPDATE Trip SET EndsAt = ? WHERE EndsAt is null AND BreezecardNum = ?";
    conn.query(sql, [end, breezecard], function(err, result, fields) {
        if (err) throw err;
        
    });
};

var stationListData = function(callback) {
    var sql = "SELECT StopID, Name, IsTrain, EnterFare FROM Station WHERE ClosedStatus = false";
    conn.query(sql, function(err, result, fields) {
        if (err) throw err;
        
        callback(result);
    });
};

var endStationListData = function(start, callback) {
    var sql = "SELECT StopID, Name, IsTrain, EnterFare FROM Station WHERE ClosedStatus = false AND (IsTrain= (SELECT IsTrain FROM Station WHERE StopID = ?))";
    conn.query(sql, [start], function(err, result, fields) {
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

var removeCard = function(breezecard) {
    var sql = "UPDATE Breezecard SET BelongsTo = null WHERE BreezecardNum = ?";
    conn.query(sql,[breezecard], function(err, result, fields) {
        if (err) throw err;
    });
}

var addValue = function(value, card) {
    var sql = "UPDATE Breezecard SET Value = Value + ? WHERE BreezecardNum=? AND Value + ? <= 1000";
    conn.query(sql, [value, card], function(err, result, fields) {
        if (err) throw err;
    });
};

var tripHistoryData = function(callback) {
    var sql = "SELECT StartTime, StartsAt, EndsAt, Tripfare, BreezecardNum FROM Trip";
    conn.query(sql, function(err, result, fields) {
        if (err) throw err;
        callback(result);
    });
};

var addCard = function(breezecard) {
    var sql = "INSERT INTO Breezecard(BreezecardNum, Value) VALUES (?,0)";
    conn.query(sql,[breezecard], function(err, result, fields) {
        if (err) throw err;
    });
};

var updateHistory = function(start, end, callback) {
    var sql = "SELECT StartTime, StartsAt, EndsAt, Tripfare, BreezecardNum FROM Trip" + 
    " WHERE (StartTime BETWEEN ? AND ?)";
    conn.query(sql, [start, end], function(err, result, fields) {
        if (err) throw err;
        callback(result);
    });
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
module.exports.passengerFlowData = passengerFlowData;
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
