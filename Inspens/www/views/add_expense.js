room_add_expense = ""+
"<header class=\"header\">"+
"	<div class=\"header-left\">"+
"		Inspens"+
"	</div>"+
"	<div class=\"header-right\">"+
"		|||"+
"	</div>"+
"</header>"+
"<section class=\"main\">"+
"	<div class=\"left full\">"+
"		Expense for: { <%this.base.number%>. <%this.base.name%> }"+
"	</div>"+
"	<div class=\"center full\">"+
"		<select name=\"sl_expense_type\" id=\"sl_expense_type\" data-role=\"slider\" class=\"ui-slider-label ui-slider-label-a ui-btn-active\">"+
"			<option value=\"normal\">Normal Expense</option>"+
"			<option value=\"transfer\">Transfer Expense</option>"+
"		</select> "+
"	</div>"+
"	<div class=\"center full\">"+
"		<label for=\"ip_expense_amount\">Amount</label>"+
"		<input class=\"center full\" id=\"ip_expense_amount\" name=\"ip_expense_amount\"/>"+
"	</div>"+
"	<div class=\"center full\">"+
"		<label for=\"ip_expense_account\">Account</label>"+
"		<button class=\"center full\" id=\"ip_expense_account\" name=\"ip_expense_account\">-</button>"+
"	</div>"+
"</section>";