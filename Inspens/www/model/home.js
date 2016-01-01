ctx = {
		setting: setting, //-- global var setting in core.js
		summary: {
			last_period_balance: 0,
			total_income: 0,
			total_expense: 200000,
			total_transfer_income: 500000,
			total_transfer_expense: 0
		},
		base: {
			number: 1,
			total: 6,
			name: "Cash in Hand"
		},
};

function scroll(room_template, context, direction, speed) {
	var leftto;
	var targetdiv;
	if (speed>700)
		speed = 700
	if (direction=="right") {
		leftto = -2*winW;
		targetdiv = "#page-right";
	}
	else {
		leftto = 0;
		targetdiv = "#page-left"
	}
	not_currently_scrolling = false;
	TemplateEngine(
		room_template,
		context,
		function(compiledpage){
			$(targetdiv).html(compiledpage);
			refresh_style(); //reload css related styles			
			$("#page-container").animate(
				{left:leftto},
				{
					duration: speed,
					complete: function(){
						$("#page").html(compiledpage);
						not_currently_scrolling = true;
					}
				}
			);
		}
	);
}
$(function() {
	not_currently_scrolling = true;
	$(window).on(
		"swipe",
		function (e) {
			if (not_currently_scrolling)
			{
				if ((e.swipestart.coords[0]-e.swipestop.coords[0])>30
					&& ctx.base.number<6
				){
					ctx.base.number += 1;
					scroll(room_home, ctx, "right", (e.swipestop.time - e.swipestart.time)*2);
				} 
				else if ((e.swipestart.coords[0]-e.swipestop.coords[0])<-30
					&& ctx.base.number>1
				){
					ctx.base.number -= 1;
					scroll(room_home, ctx, "left", (e.swipestop.time - e.swipestart.time)*2);
				}
				getMonthSummary("EXPENSE", 0, "BETWEEN", -1, ctx.base.number,
					function(tx, res){
						penghasilan = res;
						if (res.rows.length<1) {
							ctx.summary.total_expense = 0.0;
							refresh(room_home, ctx);
						}
						else {
							ctx.summary.total_expense = parseFloat(res.rows.item(0).sum_amount);
							refresh(room_home, ctx);
						}
						console.log(
							"MAKINLOG: "+
							res.rows.length+" len, item"+ 
							res.rows.item(0).sum_amount
						);
					}
				);
			}
		}
	);
});
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
