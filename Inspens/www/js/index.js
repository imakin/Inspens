/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        
        try {
			db = window.sqlitePlugin.openDatabase({name: "Inspens.db"});
		}
		catch (err) {
			db = window.openDatabase("Inspens.db", '1.0', 'inspens', 2*1024*1024);
		}
		db.transaction(
				function(tx) {
					tx.executeSql(
						"SELECT name FROM sqlite_master WHERE type='table' AND name='accounts'", [],
						function(tx, res){
							if (res.rows.length<1) {
								//-- no table yet, let's create all of them
								tx.executeSql("CREATE TABLE IF NOT EXISTS accounts(id INT, name VARCHAR, type VARCHAR, balance INT, enabled BOOLEAN)"); //-- Main accounts
								tx.executeSql("CREATE TABLE IF NOT EXISTS account_balances(id INT, base_account_id INT, balance_before INT, balance INT, date DATE)");
								tx.executeSql("CREATE TABLE IF NOT EXISTS incomesexpenses(id INT, base_account_id INT, from_account_id INT, description VARCHAR, type VARCHAR, amount INT, date DATE)");
								tx.executeSql("CREATE TABLE IF NOT EXISTS settings(name VARCHAR, value VARCHAR)");

								tx.executeSql("INSERT INTO accounts VALUES(1, 'Cash in Hand', 'BASE', 0, 1)");
								tx.executeSql("INSERT INTO accounts VALUES(2, 'Bank', 'BASE', 0 ,1)");
								tx.executeSql("INSERT INTO accounts VALUES(8, 'e-Money', 'BASE', 0 ,1)");

								//-- basic accounts
								tx.executeSql("INSERT INTO accounts VALUES(3, 'Main Income',      'INCOME',   0, 1)");
								tx.executeSql("INSERT INTO accounts VALUES(4, 'Job Salary',       'INCOME',   0, 1)");
								tx.executeSql("INSERT INTO accounts VALUES(5, 'Remaining Cash',   'INCOME',   0, 1)"); //-- remaining cash in hand
								tx.executeSql("INSERT INTO accounts VALUES(6, 'Eating',           'EXPENSE',  0, 1)");
								tx.executeSql("INSERT INTO accounts VALUES(7, 'Transportation',   'EXPENSE',  0, 1)");

								tx.executeSql("INSERT INTO settings VALUES('base_account', 1)");
								tx.executeSql("INSERT INTO settings VALUES('base_account_page','0')");
								tx.executeSql("INSERT INTO settings VALUES('close_date','1')");
							}
						},
						function(e) {
						}
					);
				}
		);
		/**var db = window.sqlitePlugin.openDatabase({name: "Inspens.db"});
		db.transaction(function(tx) {
			tx.executeSql('DROP TABLE IF EXISTS test_table');
			tx.executeSql('CREATE TABLE IF NOT EXISTS test_table (id integer primary key, data text, data_num integer)');

			tx.executeSql("INSERT INTO test_table (data, data_num) VALUES (?,?)", ["test", 100], function(tx, res) {
				alert("insertId: " + res.insertId + " -- probably 1");
				alert("rowsAffected: " + res.rowsAffected + " -- should be 1");

				tx.executeSql("select count(id) as cnt from test_table;", [], function(tx, res) {
				alert("res.rows.length: " + res.rows.length + " -- should be 1");
				alert("res.rows.item(0).cnt: " + res.rows.item(0).cnt + " -- should be 1");
				});

			}, function(e) {
				console.log("ERROR: " + e.message);
			});
		});//**/
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
       
    }
};

app.initialize();
