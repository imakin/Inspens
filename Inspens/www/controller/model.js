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
	var mDay = c.getDate();
	
	if (month>0)
		mMonth = month
	else
		mMonth = ctx.setting.report_picked_month + month;
	
	if (mDay < ctx.setting.close_book_date)
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
model = {}
// model can be found in the same folder: model_accounts.js, model_incomesexpenses.js etc

