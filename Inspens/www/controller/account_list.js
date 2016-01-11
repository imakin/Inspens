//-- this is popup showing list of account to be selected
//-- action executed as cb2 bellow
account_list_ctl = {
	initialize: 
			function() {
			},
	show:
			function() {
				$(".popup_container").show();
				$("#account_list").show();
			},
	hide:
			function() {
				$(".popup_container").hide();
				$("#account_list").hide();
			},
	show_all:
			function(cb2) {
				model.accounts.all(account_list_ctl.result_to_div, cb2);
				this.show();
				refresh_style();
			},
	show_filter:
			function(filter_string, cb2) {
				model.accounts.filter(filter_string, account_list_ctl.result_to_div, cb2);
				this.show();
				refresh_style();
			},
	show_base:
			function(cb2) {
				model.accounts.filter("WHERE type='BASE'",account_list_ctl.result_to_div, cb2);
				this.show();
				refresh_style();
			},
	account_ctx: {
				accounts: {},
				len: 0,
				message: "Select Account",
			},
	result_to_div:
			function(tx,res){
				account_list_ctl.account_ctx.accounts = res.rows;
				account_list_ctl.account_ctx.len = res.rows.length;
				TemplateEngine(room_account_list, account_list_ctl.account_ctx, function(cp){
					$("#account_list").html(cp);
				});
			},
}
