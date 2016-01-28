room_home_perbase = ""+
"<div class=\"left full\">"+
"	(<%this.base.pos%>/<%(this.base.names.length-1)%>) Base account: <%this.base.names[this.base.pos].name%>"+
"</div>"+
""+
"<div class=\"mid full\">"+
"	Summary"+
"</div>"+
""+
"<div class=\"mid full\">"+
"	Period is:"+
"	<button type=\"button\" id=\"bt_periodchange\">"+
"		<%this.setting.period_change%>"+
"	</button>"+
"</div>"+
""+
"<div class=\"left full grid-container\">"+
"	<div class=\"left half\">"+
"		Last Period Balance"+
"	</div>"+
"	<div class=\"right half\">"+
"		<%this.setting.currency%> <%this.summary.last_period_balance%>"+
"	</div>"+
"</div>"+
"<div class=\"left full grid-container\">"+
"	<div class=\"left half\">"+
"		Total Income"+
"	</div>"+
"	<div class=\"right half\">"+
"		<%this.setting.currency%> <%this.summary.total_income%>"+
"	</div>"+
"</div>"+
"<div class=\"left full grid-container\">"+
"	<div class=\"left half\">"+
"		Total Expense"+
"	</div>"+
"	<div class=\"right half\">"+
"		<%this.setting.currency%> <%this.summary.total_expense%>"+
"	</div>"+
"</div>"+
"<div class=\"left full grid-container\">"+
"	<div class=\"left half\">"+
"		Total Transfer Income"+
"	</div>"+
"	<div class=\"right half\">"+
"		<%this.setting.currency%> <%this.summary.total_transfer_income%>"+
"	</div>"+
"</div>"+
"<div class=\"left full grid-container\">"+
"	<div class=\"left half\">"+
"		Total Transfer Expense"+
"	</div>"+
"	<div class=\"right half\">"+
"		<%this.setting.currency%> <%this.summary.total_transfer_expense%>"+
"	</div>"+
"</div>"+
""+
"<div class=\"full hr\">"+
"</div>"+
""+
"<div class=\"left full grid-container\">"+
"	<div class=\"left half\">"+
"		Balance"+
"	</div>"+
"	<div class=\"right half\">"+
"		<%this.setting.currency%> <%this.summary.total_transfer_income + this.summary.total_income - this.summary.total_expense - this.summary.total_transfer_expense%>"+
"	</div>"+
"</div>"+
""+
"<div class=\"full\" style=\"height:1.5em\"> </div>"+
""+
"<div class=\"full grid-container\">"+
"	<div class=\"left half\">"+
"		<button id=\"bt_home_add_income\">Add Income</button>"+
"	</div>"+
"	<div class=\"right half\">"+
"		<button id=\"bt_home_add_expense\">Add Expense</button>"+
"	</div>"+
"</div>"+
""+
"<div class=\"full\" style=\"height:1em\"> </div>"+
""+
"<div class=\"full grid-container\">"+
"	<div class=\"full center\">"+
"		<button id=\"bt_home_edit_accounts\" class=\"full\" style=\"max-width:240px;\">Edit Accounts</button>"+
"	</div>"+
"</div>";