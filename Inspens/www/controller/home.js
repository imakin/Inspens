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
				ctx.summary = {
							last_period_balance: 0,
							total_income: 0,
							total_expense: 200000,
							total_transfer_income: 500000,
							total_transfer_expense: 0
						};
				ctx.base = {
							number: 1,
							total: 6,
							name: "Cash in Hand"
						};
				
				refresh(room_home, ctx);
				home_ctl.not_currently_scrolling = true;
				$(window).on("swipe",home_ctl.on_swipe_handler);
			},
	close:
			function(){
				$(window).off("swipe",home_ctl.on_swipe_handler);
			},

	not_currently_scrolling: true,
	on_swipe_handler: 
			function (e) {
				swipee = e;
				//~ keys = Object.keys(e);
				//~ var debug = "";
				//~ for (i=0; i<keys.length; i++)
				//~ {
					//~ ob = e[keys[i]];
					//~ try {
						//~ ob = JSON.stringify(ob);
					//~ }
					//~ catch (err) {
					//~ }
					//~ debug = debug + ob + "<br/>";
				//~ }
				//~ $("#title").html(debug+"<br/><br/>"+this.not_currently_scrolling);
				//~ $("#dot1").css("left",e.swipestart.coords[0]);
				//~ $("#dot1").css("top",e.swipestart.coords[1]);
				//~ $("#dot2").css("left",e.swipestop.coords[0]);
				//~ $("#dot2").css("top",e.swipestop.coords[1]);
				if (home_ctl.not_currently_scrolling)
				{
					if ((e.swipestart.coords[0]-e.swipestop.coords[0])>30
						&& ctx.base.number<6
					){
						ctx.base.number += 1;
						home_ctl.scroll(room_home, "right", (e.swipestop.time - e.swipestart.time)*2);
					} 
					else if ((e.swipestart.coords[0]-e.swipestop.coords[0])<-30
						&& ctx.base.number>1
					){
						ctx.base.number -= 1;
						home_ctl.scroll(room_home, "left", (e.swipestop.time - e.swipestart.time)*2);
					}
				}
			},
	ctx_reload: function(done_callback){
			//-- reload all ctx values that retrieved from database, specific for this home room only
			//-- done callback called when ctx is reloaded
			//-- don't judge me, this is how asynchronous done
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
