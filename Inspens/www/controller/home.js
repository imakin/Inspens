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
				home_ctl.ctx_reload(function(){
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
							home_ctl.ctx_reload(function(){
								refreshTo("#home_base"+ctx.base.pos,room_home_perbase, ctx);
							});
						}
					},
					(winW*0.6)%500
				);
			},
	ctx_reload: function(done_callback){
			//-- reload all ctx values that retrieved from database, specific for this home room only
			//-- done callback called when ctx is reloaded
			//-- don't judge me, this is how asynchronous done
			model.accounts.filter(
				"type='BASE' ORDER BY id",
				function(tx,res){
					ctx.base.names = [{id:0, name:'zero'}]
					for (aci=0; aci<res.rows.length; aci++){
						ctx.base.names.push({id:res.rows.item(aci).id, name:res.rows.item(aci).name});
					}
					ctx.base.total = res.rows.length;
					ctx.base.number = ctx.base.names[ctx.base.pos].id;
					
					console.log("pos: "+ctx.base.pos+" and id:"+ctx.base.number);
					
					getMonthSummary("EXPENSE", 0, "BETWEEN", -1, ctx.base.number,
						function(tx, res){
							if (res.rows.length<1 || res.rows.item(0).sum_amount==null) {
								ctx.summary.total_expense = 0.0;
							}
							else {
								ctx.summary.total_expense = parseFloat(res.rows.item(0).sum_amount);
							}
							getMonthSummary("INCOME", 0, "BETWEEN", -1, ctx.base.number,
								function(tx,res){
									if (res.rows.length<1 || res.rows.item(0).sum_amount==null) {
										ctx.summary.total_income = 0.0;
									}
									else {
										ctx.summary.total_income = parseFloat(res.rows.item(0).sum_amount);
									}
									getMonthSummary("TRANSFERINCOME", 0, "BETWEEN", -1, ctx.base.number,
										function(tx,res){
											if (res.rows.length<1 || res.rows.item(0).sum_amount==null) {
												ctx.summary.total_transfer_income = 0.0;
											}
											else {
												ctx.summary.total_transfer_income = parseFloat(res.rows.item(0).sum_amount);
											}
											getMonthSummary("TRANSFEREXPENSE", 0, "BETWEEN", -1, ctx.base.number,
												function(tx,res){
													if (res.rows.length<1 || res.rows.item(0).sum_amount==null) {
														ctx.summary.total_transfer_expense = 0.0;
													}
													else {
														ctx.summary.total_transfer_expense = parseFloat(res.rows.item(0).sum_amount);
													}
													done_callback();
												}
											);//--transfer expense
										}
									);//-- transfer income
								}
							);//--income
						}
					);//--expense
				},
				function(){}
			);
			
		},
	scroll: function (room_template, direction, speed) {
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
			home_ctl.ctx_reload(function() {
				home_ctl.not_currently_scrolling = false;
				TemplateEngine(
					room_template,
					ctx,
					function(compiledpage){
						$(targetdiv).html(compiledpage);
						 //reload css related styles			
						$("#page-container").animate(
							{left:leftto},
							{
								duration: speed,
								complete: function(){
									$("#page").html(compiledpage);
									refresh_style();
									home_ctl.not_currently_scrolling = true;
								}
							}
						);
					}
				);
			});
		},
}
