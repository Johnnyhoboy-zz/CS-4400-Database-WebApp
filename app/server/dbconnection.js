const mysql = require('mysql2')

const conn = mysql.createConnection({
    host: 'academic-mysql.cc.gatech.edu',
    user: 'cs4400_Group_86',
    password: 'mRNogirU',
    database: 'cs4400_Group_86'
});


var selectForStationManagement = function(callback) {
    var sql = "SELECT Name, StopID, EnterFare, ClosedStatus FROM Station";
    conn.query(sql, function(err, result, fields) {
        if (err) throw err;
        callback(result);
    });
}

var test = function() { console.log('test successful'); }

module.exports.selectFromUser = selectFromUser;
module.exports.test = test;
module.exports.selectForStationManagement = selectForStationManagement;