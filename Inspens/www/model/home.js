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
	scroll_done = false;
	compiledpage = TemplateEngine(
		room_template, context
	);
	$(targetdiv).html(compiledpage);
	refresh_style(); //reload css related styles
	$("#page-container").animate(
		{left:leftto},
		{
			duration: speed,
			complete: function(){
				$("#page").html(compiledpage);
				scroll_done = true;
			}
		}
	);
}
$(function() {
	
	$(window).on(
		"swipe",
		function (e) {
			if (scroll_done)
			{
				getMonthSummary("EXPENSE", 0, "BETWEEN", -1,
					function(tx, res){
						if (res.rows.length<1)
							ctx.summary.total_expense = 0.0;
						else
							ctx.summary.total_expense = parseFloat(res.rows.item(0).sum_amount);
						console.log("MAKINLOG: "+res.rows.length+" len, item"+res.rows.item(0) + 
							" = " + res.rows.item(0).sum_amount
						);
					}
				);
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
function getMonthSummary(type, month, scope, specificAccountId, cbfunction){
	//-- type: 'INCOME', 'EXPENSE', 'TRANSFERINCOME', 'TRANSFEREXPENSE'
	//-- month is month number 1=jan, 2=feb, 3=mar
	//--    or relative to current month 0=thismonth -1=last month, -2 before last month
	//-- scope is "BETWEEN" or "BEFORE" or "ALL",
	//-- 	between is this month only, before is before this month, all is for no date filter
	//-- specific account is passed non (-1) if want to get only specific account INCOME/EXPENSE
	//-- 	like passing (3) will set specific for Accounts[3]: "Main Income" 
	//-- 	(basic account defined in index.js)
	//--    only work for EXPENSE & INCOME type, doesn't work for TRANSFERINCOME/TRANSFEREXPENSE
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
		date_filter = (
			" AND date BETWEEN DATE('" + this_month + "') AND DATE('" + 
			this_month + "','+1 month', '-1 day')"
		);
	
	//return_val_MonthSummary = "ERROR";
	
	if (type=="TRANSFERINCOME")
	{//--this one is a bit different, (searching TRANSFEREXPENSE to baseaccount)
		db.transaction(function(tx) {
			tx.executeSql(
				(
					"SELECT SUM(amount) as sum_amount FROM incomesexpenses WHERE from_account_id='"+
					setting.base_account_id + "' AND type='TRANSFEREXPENSE' "+date_filter
				), [],
				cbfunction
			);
		});
	}
	else {
		db.transaction(function(tx) {
			tx.executeSql(
				(
					"SELECT SUM(amount) as sum_amount FROM incomesexpenses "+
					"WHERE base_account_id='"+setting.base_account_id +"' "+
					"AND type='"+type+"' "+ 
					date_filter + " " + account_filter
				), [],
				cbfunction
			);
		});
	}
	//return return_val_MonthSummary;
}
