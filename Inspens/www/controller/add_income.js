/** 
 * controller for add_income
 * view : ../views/add_income.js (room_add_income)
 */

add_income_ctl = {
	initialize: 
		function(){
			try {ctx.active_room_close();} catch (err) {}
			var d = new Date();
			ctx.nowdate = d.getFullYear()+"-"+zeroFill(d.getMonth()+1, 2)+"-"+zeroFill(d.getDate(),2);
			ctx.edit_incomesexpenses_date = ctx.nowdate;
			
			refresh(room_add_income, ctx);
			ctx.active_room_close = add_income_ctl.close;
			ctx.room_back = room_list_ctl.goto_home;
			
			
			$("body").off("click", "#ip_add_income_account");
			$("body").on("click", "#ip_add_income_account", add_income_ctl.pick_account);
			
			this.datepickeri= new Pikaday(
				{
					field: document.getElementById('ip_add_income_date_'),
				}
			);
			$("#ip_add_income_date").off("click");
			$("#ip_add_income_date").click(
				function(){
					add_income_ctl.datepickeri.show();
				}
			);
			$("#ip_add_income_date_").off("change");
			$("#ip_add_income_date_").change(
				function(){
					$("#ip_add_income_date").html($(this).val());
				}
			);
			$("#bt_add_income_save").off("click");
			$("#bt_add_income_save").click(
				function(){
					add_income_ctl.save();
				}
			);
		},
	close:
		function(){
			$("body").off("click", "#ip_add_income_account", add_income_ctl.pick_account);
		},
	data: {
		from_account_id:0,
	},
	getval: 
		function(prop){
			return prop=="account"?
					add_income_ctl.data.from_account_id:(
						$("#ip_add_income_"+prop).val()==""?
							$("#ip_add_income_"+prop).text():
							$("#ip_add_income_"+prop).val()
					);
		},
	save:
		function() {
			var data_local = {
						amount : this.getval("amount"),
						base_account_id : ctx.base.names[ctx.base.pos].id,
						from_account_id : this.getval("account"),
						date : this.getval("date"),
						description : this.getval("description"),
						type : 'INCOME',
				};
			model.incomesexpenses.insert(
							data_local,function(tx,res){}, 
							function(){ctx.room_back();}
						);
		},
	pick_account:
		function(){
			var type = add_income_ctl.getval("type");
			var actype;
			actype = "INCOME"
			account_list_ctl.account_ctx.message = "Select "+actype+" account from";
			account_list_ctl.show_filter(
				" type='"+actype+"' ",
				function(){
					$("#account_list button").each(function(){
						$(this).off("click");
						$(this).on("click", function(){
							add_income_ctl.data.from_account_id = $(this).attr("data-id"); //-- save to data
							$("#ip_add_income_account").html($(this).attr("data-name"));
							account_list_ctl.hide();
						});
						
					});
				}
			);
			
		}
}
