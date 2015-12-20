//-- init default setting
var c = new Date();
setting = {
	period_change: 1, //-- date of period change, alias close_book_date
	close_book_date: 1,
	currency: "IDR",
	
	report_picked_year: c.getFullYear(), 
	report_picked_month: c.getMonth()+1,
	
	base_account_id: 1,
};
