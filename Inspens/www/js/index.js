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
			console.log = hpconsole;
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
								tx.executeSql("CREATE TABLE IF NOT EXISTS accounts(id INT UNIQUE ON CONFLICT REPLACE, name VARCHAR, type VARCHAR, enabled BOOLEAN)"); //-- Main accounts
								tx.executeSql("CREATE TABLE IF NOT EXISTS incomesexpenses(id INT UNIQUE ON CONFLICT REPLACE, base_account_id INT, from_account_id INT, description VARCHAR, type VARCHAR, amount INT, date DATE)");
								tx.executeSql("CREATE TABLE IF NOT EXISTS settings(name VARCHAR UNIQUE ON CONFLICT REPLACE, value VARCHAR)");

								tx.executeSql("INSERT INTO accounts VALUES(1, 'Cash in Hand', 'BASE', 1)");
								tx.executeSql("INSERT INTO accounts VALUES(2, 'Bank', 'BASE', 1)");
								tx.executeSql("INSERT INTO accounts VALUES(8, 'e-Money', 'BASE', 1)");

								//-- basic accounts
								tx.executeSql("INSERT INTO accounts VALUES(3, 'Main Income',      'INCOME',   1)");
								tx.executeSql("INSERT INTO accounts VALUES(4, 'Job Salary',       'INCOME',   1)");
								tx.executeSql("INSERT INTO accounts VALUES(5, 'Remaining Cash',   'INCOME',   1)"); //-- remaining cash in hand
								tx.executeSql("INSERT INTO accounts VALUES(6, 'Eating',           'EXPENSE',  1)");
								tx.executeSql("INSERT INTO accounts VALUES(7, 'Transportation',   'EXPENSE',  1)");

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
		room_list_ctl.initialize();
        account_list_ctl.initialize();
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
       
    }
};

app.initialize();
