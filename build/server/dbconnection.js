'use strict';

var mysql = require('mysql2');

var conn = mysql.createConnection({
    host: 'academic-mysql.cc.gatech.edu',
    user: 'cs4400_Group_86',
    password: 'mRNogirU',
    database: 'cs4400_Group_86'
});

var selectFromUser = function selectFromUser(callback) {
    conn.query("SELECT * FROM User;", function (err, result, fields) {
        if (err) throw err;
        callback(result);
    });
};

var selectForStationManagement = function selectForStationManagement(callback) {
    var sql = "SELECT Name, StopID, EnterFare, ClosedStatus FROM Station";
    conn.query(sql, function (err, result, fields) {
        if (err) throw err;
        callback(result);
    });
};

var test = function test() {
    console.log('test successful');
};

module.exports.selectFromUser = selectFromUser;
module.exports.test = test;
module.exports.selectForStationManagement = selectForStationManagement;