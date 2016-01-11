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
			
			var endorsement_controls =  $('#page select');
			endorsement_controls.each(function(){
				// the next two lines make them flip toggles
				$(this).slider();
				$(this).slider('refresh');
			});
			
			$("body").on("click", "#ip_add_expense_account", add_expense_ctl.pick_account);
			$("#ip_add_expense_date_").datepicker(
				{  
					dateFormat: "yy-mm-dd",
				}
			);
			$("#ip_add_expense_date").click(function(){
				$("#ip_add_expense_date_").datepicker("show");
			});
			$("#ip_add_expense_date_").change(function(){
				$("#ip_add_expense_date").html($(this).val());
			});
		},
	close:
		function(){
			$("body").off("click", "#ip_add_expense_account", add_expense_ctl.pick_account);
		},
	data: {
		amount:0,
		from_account_id:0,
		date:"",
		description:"",
	},
	pick_account:
		function(){
			account_list_ctl.account_ctx.message = "Select expense account"
			account_list_ctl.show_filter(
				" type='EXPENSE' ",
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
