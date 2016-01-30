//-- init default setting
var c = new Date();
setting = {
	period_change: 1, //-- date of period change, alias close_book_date
	close_book_date: 1,
	currency: "IDR",
	
	report_picked_year: c.getFullYear(), 
	report_picked_month: c.getMonth()+1,
	
	base_account_id: 2,
};
function zeroFill( number, width )
{
	width -= number.toString().length;
	if ( width > 0 )
	{
		return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
	}
	return number + ""; // always return a string
}

function getMonthSummary(type, month, scope, specificAccountId, baseAccountId, cbfunction){
	//-- type: 'INCOME', 'EXPENSE', 'TRANSFERINCOME', 'TRANSFEREXPENSE'
	//-- month is month number 1=jan, 2=feb, 3=mar
	//--    or relative to current month 0=thismonth -1=last month, -2 before last month
	//-- scope is "BETWEEN" or "BEFORE" or "ALL",
	//-- 	between is this month only, before is before this month, all is for no date filter
	//-- specific account is passed non (-1) if want to get only specific account INCOME/EXPENSE
	//-- 	like passing (3) will set specific for Accounts[3]: "Main Income" 
	//-- 	(basic account defined in index.js)
	//--    only work for EXPENSE & INCOME type, doesn't work for TRANSFERINCOME/TRANSFEREXPENSE
	//-- baseAccountId is mandatory, it is the Expense/Income account target
	//--	e.g. 2 is Bank account, the month summary calculated for the specific bank account
	//--	TODO: -1 for all sum
	//-- cbfunction receives (tx, res) argument
	//-- 	res is result of the query res.rows.item(0).sum_amount is the result 
	var account_filter;
	if (specificAccountId!= -1 && (type=="INCOME" || type=="EXPENSE"))
		account_filter = " AND from_account_id="+specificAccountId+" ";
	else
		account_filter = " ";
	var c = new Date();
	var mYear = setting.report_picked_year;
	var mMonth;
	var mDay = c.getDay();
	
	if (month>0)
		mMonth = month
	else
		mMonth = setting.report_picked_month + month;
	
	if (mDay < setting.close_book_date)
		mMonth -= 1; //-- means this period started from previous month
	
	var this_month = (
		""+mYear+"-"+
		zeroFill(mMonth,2) + "-"+
		zeroFill(setting.close_book_date,2)
	); //--sql format date
	
	var date_filter;
	if (scope == "BEFORE")
		date_filter = " AND date < DATE('"+this_month+"')";
	else if (scope == "ALL")
		date_filter = "";
	else
		date_filter = " AND date BETWEEN DATE('" + this_month + "') AND DATE('" + 
			this_month + "','+1 month', '-1 day')";
	
	
	if (type=="TRANSFERINCOME")
	{//--this one is a bit different, (searching TRANSFEREXPENSE to baseaccount)
		db.transaction(function(tx) {
			tx.executeSql(
				"SELECT SUM(amount) as sum_amount FROM incomesexpenses WHERE from_account_id='"+
					baseAccountId + "' AND type='TRANSFEREXPENSE' "+date_filter,
				[],
				cbfunction
			);
		});
	}
	else {
		db.transaction(function(tx) {
			tx.executeSql(
				"SELECT SUM(amount) as sum_amount FROM incomesexpenses "+
					"WHERE base_account_id='"+baseAccountId +"' "+
					"AND type='"+type+"' "+ 
					date_filter + " " + account_filter,
				[],
				cbfunction
			);
		});
	}
	//return return_val_MonthSummary;
}
function model_refreshBaseNames(cb2){
	model.accounts.filter(
				"type='BASE' ORDER BY id",
				function(tx,res){
					ctx.base.names = [{id:0, name:'zero'}]
					for (aci=0; aci<res.rows.length; aci++){
						ctx.base.names.push({id:res.rows.item(aci).id, name:res.rows.item(aci).name});
					}
					ctx.base.total = res.rows.length;
					cb2(tx,res);
				}, function(){}
			);
}
model = {
	accounts: {
		name: 'accounts',
		fields: ['id', 'name', 'type', 'enabled'],
		sql: "SELECT * FROM accounts WHERE enabled=1 ",
		//all_disabled://not needed
		/**
		 * all executed callback params are cbfunction(tx,res) and cb2(void)
		 * passed to function
		 */
		all: 
			function(cbfunction,cb2){
				//-- get all, when done cbfunction(tx,res) will be called,
				//-- and cb2(void) will be called also if any
				db.transaction(function(tx){
					tx.executeSql(model.accounts.sql, [], 
						function(tx,res){
							cbfunction(tx,res);
							cb2();
						}
					);
				});
			},
		filter:
			function(filter_string, cbfunction, cb2){
				//-- e.g. filter_string "type='EXPENSE'"
				db.transaction(function(tx){
					tx.executeSql(model.accounts.sql+" AND "+filter_string, [], 
						function(tx,res){
							cbfunction(tx,res);
							cb2();
						}
					);
				});
			},
		replace: //-- index is id field
			function(data, cbfunction, cb2){
				for (field in model.accounts.fields) {
					//-- manually fill non specified data to current data. (SQLITE can't update, only replace)
					if (!data[field])
						data[field] = "(SELECT "+field+" FROM "+model.accounts.name+
									" WHERE id="+data.id+")";	
				}
				db.transaction(function(tx){
					tx.executeSql(
						"INSERT OR REPLACE INTO "+model.accounts.name+
						" (id,name,type,enabled) VALUES("+
							data.id+", "+
							"'"+data.name+"', "+
							"'"+data.type+"', "+
							"1)",
						[],
						function(tx,res){
							cbfunction(tx,res);
							cb2();
						}
					);
				});
			},
		insert:
			function(data, cbfunction, cb2){
				//--replace. executed
				db.transaction(function(tx){
					tx.executeSql(
						"INSERT INTO "+model.accounts.name+
						" (id,name,type,enabled) VALUES("+
							"((SELECT id FROM "+model.accounts.name+" ORDER BY id DESC LIMIT 1)+1), "+
							"'"+data.name+"', "+
							"'"+data.type+"', "+
							"1)",
						[],
						function(tx,res){
							cbfunction(tx,res);
							cb2();
						}
					);
				});
			},
		disable:
			function(id, cbfunction, cb2){
				db.transaction(function(tx){
					tx.executeSql("UPDATE "+model.accounts.name+" set enabled=0"+
						" WHERE id="+id,
						[],
						function(tx,res){
							cbfunction(tx,res);
							cb2();
						}
					);
				});
			}
	},
	incomesexpenses: {
		name: 'incomesexpenses',
		fields: ['id', 'base_account_id', 'from_account_id', 'description', 'type', 'amount', 'date'],
		sql: 'select * from incomesexpenses ',
		
		/**
		 * all executed callback params are cbfunction(tx,res) and cb2(void)
		 * passed to function
		 */
		all: 
			function(cbfunction,cb2){
				//-- get all, when done cbfunction(tx,res) will be called,
				//-- and cb2(void) will be called also if any
				db.transaction(function(tx){
					tx.executeSql(model.incomesexpenses.sql, [], 
						function(tx,res){
							cbfunction(tx,res);
							cb2();
						}
					);
				});
			},
		filter:
			function(filter_string, cbfunction, cb2){
				//-- e.g. filter_string "type='EXPENSE'"
				db.transaction(function(tx){
					tx.executeSql(model.accounts.sql+" WHERE "+filter_string, [], 
						function(tx,res){
							cbfunction(tx,res);
							cb2();
						}
					);
				});
			},
		replace: //-- index is id field
			function(data, cbfunction, cb2){
				for (field in model.accounts.fields) {
					//-- manually fill non specified data to current data. (SQLITE can't update, only replace)
					if (!data[field])
						data[field] = "(SELECT "+field+" FROM "+model.incomesexpenses.name+
									" WHERE id="+data.id+")";	
				}
				db.transaction(function(tx){
					tx.executeSql(
						"INSERT OR REPLACE INTO "+model.incomesexpenses.name+
						" (id, base_account_id, from_account_id, description, type, amount, date) VALUES("+
							"'"+data.id+"', "+
							"'"+data.base_account_id+"', "+
							"'"+data.from_account_id+"', "+
							"'"+data.description+"', "+
							"'"+data.type+"', "+
							"'"+data.amount+"', "+
							"'"+data.date+"')",
						[],
						function(tx,res){
							cbfunction(tx,res);
							cb2();
						}
					);
				});
			},
		insert:
			function(data, cbfunction, cb2){
			//--replace. executed
				db.transaction(function(tx){
					tx.executeSql(
						"INSERT INTO "+model.incomesexpenses.name+
						" (id, base_account_id, from_account_id, description, type, amount, date) VALUES("+
							"((SELECT id FROM "+model.incomesexpenses.name+" ORDER BY id DESC LIMIT 1)+1), "+
							"'"+data.base_account_id+"', "+
							"'"+data.from_account_id+"', "+
							"'"+data.description+"', "+
							"'"+data.type+"', "+
							"'"+data.amount+"', "+
							"'"+data.date+"')",
						[],
						function(tx,res){
							cbfunction(tx,res);
							cb2();
						}
					);
				});
			},
	},
}


