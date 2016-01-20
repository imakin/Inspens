/** 
 * controller for add_expense
 * view : ../views/add_expense.js (room_add_expense)
 */

add_expense_ctl = {
	initialize: 
		function(){
			try {ctx.active_room_close();} catch (err) {}
			refresh(room_add_expense, ctx);
			ctx.active_room_close = add_expense_ctl.close;
			ctx.room_back = home_ctl.initialize;
			
			try{
				var endorsement_controls =  $('#page select');
				endorsement_controls.each(function(){
					$(this).slider();
					$(this).slider('refresh');
				});
			} catch(e) {}
			
			$("body").off("click", "#ip_add_expense_account");
			$("body").on("click", "#ip_add_expense_account", add_expense_ctl.pick_account);
			
			this.datepickeri= new Pikaday(
				{
					field: document.getElementById('ip_add_expense_date_'),
				}
			);
			$("#ip_add_expense_date").off("click");
			$("#ip_add_expense_date").click(
				function(){
					add_expense_ctl.datepickeri.show();
				}
			);
			$("#ip_add_expense_date_").off("change");
			$("#ip_add_expense_date_").change(
				function(){
					$("#ip_add_expense_date").html($(this).val());
				}
			);
			$("#bt_add_expense_save").off("click");
			$("#bt_add_expense_save").click(
				function(){
					add_expense_ctl.save();
				}
			);
		},
	close:
		function(){
			$("body").off("click", "#ip_add_expense_account", add_expense_ctl.pick_account);
		},
	data: {
		from_account_id:0,
	},
	getval: 
		function(prop){
			return prop=="account"?
					add_expense_ctl.data.from_account_id:(
						$("#ip_add_expense_"+prop).val()==""?
							$("#ip_add_expense_"+prop).text():
							$("#ip_add_expense_"+prop).val()
					);
		},
	save:
		function() {
			var data = {
						amount : this.getval("amount"),
						base_account_id : this.getval("account"),
						from_account_id : this.getval("account"),
						date : this.getval("date"),
						description : this.getval("description"),
						type : this.getval("type"),
				};
			if (data.type=="normal") {
				data.type = "EXPENSE";
				data.base_account_id = ctx.base.number;
			}
			else {//--transfer expense
				data.type = "TRANSFEREXPENSE";
				data.base_account_id = ctx.base.number;
			}
			model.incomesexpenses.insert(
							data,function(tx,res){}, 
							function(){ctx.room_back();}
						);
		},
	pick_account:
		function(){
			var type = add_expense_ctl.getval("type");
			var actype;
			if (type=="normal")
				actype = "EXPENSE";
			else
				actype = "BASE"
			account_list_ctl.account_ctx.message = "Select "+actype+" account";
			account_list_ctl.show_filter(
				" type='"+actype+"' ",
				function(){
					$("#account_list button").each(function(){
						$(this).off("click");
						$(this).on("click", function(){
							add_expense_ctl.data.from_account_id = $(this).attr("data-id"); //-- save to data
							$("#ip_add_expense_account").html($(this).attr("data-name"));
							account_list_ctl.hide();
						});
						
					});
				}
			);
			
		}
}
