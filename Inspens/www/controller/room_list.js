room_list_ctl = {
	initialize: 
			function() {
				TemplateEngine(
					room_room_list, {}, 
					function(cp) {
						$("#room_list_container").html(cp);
						refresh_style();
						room_list_ctl.setup_buttoncb()
					}
				);
				
			},
	close: 
			function() {
			},
	setup_buttoncb:
			function() {
				$("body").on("click", "#bt_goto_home", room_list_ctl.goto_home);
				$("body").on("click", "#bt_goto_console", room_list_ctl.goto_console);
				$("body").on("click", "#bt_goto_add_expense", room_list_ctl.goto_add_expense);
				
				$("body").on("click", "#menu", function(){$("#room_list_container").toggle();});
			},
	goto_home:
			function() { home_ctl.initialize(); $("#room_list_container").hide() },
	goto_console:
			function() {console_ctl.initialize(); $("#room_list_container").hide()},
	goto_add_expense:
			function() {add_expense_ctl.initialize(); $("#room_list_container").hide()},
	goto_add_income:
			function() {},
	goto_edit_accounts:
			function() {},
}
