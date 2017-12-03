'use strict';

var mysql = require('mysql2');

var conn = mysql.createConnection({
    host: 'academic-mysql.cc.gatech.edu',
    user: 'cs4400_Group_86',
    password: 'mRNogirU',
    database: 'cs4400_Group_86'
});

var selectFromUser = function selectFromUser() {
    conn.connect(function (err) {
        if (err) throw err;
        conn.query("SELECT * FROM User;", function (err, result, fields) {
            if (err) throw err;
            console.log(result);
        });
    });
    conn.end();
};

var test = function test() {
    console.log('test successful');
};

module.exports.selectFromUser = selectFromUser;
module.exports.test = test;