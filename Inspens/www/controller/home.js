/** 
 * controller for home
 * view : ../views/home.js (room_home)
 */


home_ctl = {
	initialize: 
			function(){
				try {ctx.active_room_close();} catch (err) {}
				ctx.active_room_close = home_ctl.close;
				ctx.setting = setting; //-- global var setting in core.js
				ctx.setting.report_picked_month = new Date().getMonth()+1;
				ctx.summary = {
							last_period_balance: 0,
							total_income: 0,
							total_expense: 200000,
							total_transfer_income: 500000,
							total_transfer_expense: 0
						};
				if (!ctx.base)
					ctx.base = {};
				if (!ctx.base.pos)
					ctx.base.pos = 1;
				if (!ctx.base.total)
					ctx.base.total = 3;
				if (!ctx.base.name)
					ctx.base.name = "Cash";
				if (!ctx.base.number)
					ctx.base.numver = 1; //-- this is base id
				model.incomesexpenses.ctx_reload_all(function(){
					refresh(room_home, ctx);
					scrollLeftOverflow("page-container",winW*(ctx.base.pos-1)+2);
				});
				home_ctl.not_currently_scrolling = true;
				
				$("body").off("click", "#bt_home_add_income", room_list_ctl.goto_add_income);
				$("body").on("click", "#bt_home_add_income", room_list_ctl.goto_add_income);
				$("body").off("click", "#bt_home_add_expense", room_list_ctl.goto_add_expense);
				$("body").on("click", "#bt_home_add_expense", room_list_ctl.goto_add_expense);
				$("body").off("click", "#bt_home_edit_accounts", room_list_ctl.goto_edit_accounts);
				$("body").on("click", "#bt_home_edit_accounts", room_list_ctl.goto_edit_accounts);
				terakhir = null;
				$("#page-container").on("scroll",home_ctl.sidescroll_handler_new);
				
				
				
			},
	close:
			function(){
				$(window).off("swipe",home_ctl.on_swipe_handler);
			},
	not_currently_scrolling: true,
	sidescroll_once: false,
	sidescroll_once_val: 0,
	sidescroll_handler_new:
			function() {
				var sl = $("#page-container").scrollLeft();
				var edge = $("#page-container").width();
				terakhir = setTimeout(
					function(){
						home_ctl.sidescroll_once_val = $("#page-container").scrollLeft();
						if (home_ctl.sidescroll_once_val==sl) {
							clearTimeout(terakhir);
							var c1,c2;
							var closest;
							c1 = sl%edge;
							c2 = edge - c1;
							if (c1>c2)
								closest = sl+c2;
							else
								closest = sl-c1;

							scrollLeftOverflow("page-container", closest);
							ctx.base.pos = closest/edge +1;
							model.incomesexpenses.ctx_reload_all(function(){
								refreshTo("#home_base"+ctx.base.pos,room_home_perbase, ctx);
							});
						}
					},
					(winW*0.6)%500
				);
			},
}
