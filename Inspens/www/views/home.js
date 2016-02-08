room_home = ""+
"<div class=\"sidescroll\">"+
"<% /** skip zero, start from 1 **/ %>"+
"<% for ("+
"		base_page=1; /** only show 3 each render: current base, its left, & its right **/"+
"		base_page<this.base.names.length;"+
"		base_page++"+
"	) {%>"+
"	<section class=\"main home\" id=\"home_base<%base_page%>\">"+
"		<div class=\"left full\">"+
"			(<%base_page%>/<%(this.base.names.length-1)%>) Base account: <%this.base.names[base_page].name%>"+
"		</div>"+
"		"+
"		<div class=\"mid full\">"+
"			Summary"+
"		</div>"+
"		"+
"		<div class=\"mid full\">"+
"			Period is:"+
"			<button type=\"button\" id=\"bt_periodchange\">"+
"				<%this.setting.period_change%>"+
"			</button>"+
"		</div>"+
"		"+
"		<div class=\"left full grid-container\">"+
"			<div class=\"left half\">"+
"				Last Period Balance"+
"			</div>"+
"			<div class=\"right half\">"+
"				<%this.setting.currency%> <%this.summary.last_period_balance%>"+
"			</div>"+
"		</div>"+
"		<div class=\"left full grid-container\">"+
"			<div class=\"left half\">"+
"				Total Income"+
"			</div>"+
"			<div class=\"right half\">"+
"				<%this.setting.currency%> <%this.summary.total_income%>"+
"			</div>"+
"		</div>"+
"		<div class=\"left full grid-container\">"+
"			<div class=\"left half\">"+
"				Total Expense"+
"			</div>"+
"			<div class=\"right half\">"+
"				<%this.setting.currency%> <%this.summary.total_expense%>"+
"			</div>"+
"		</div>"+
"		<div class=\"left full grid-container\">"+
"			<div class=\"left half\">"+
"				Total Transfer Income"+
"			</div>"+
"			<div class=\"right half\">"+
"				<%this.setting.currency%> <%this.summary.total_transfer_income%>"+
"			</div>"+
"		</div>"+
"		<div class=\"left full grid-container\">"+
"			<div class=\"left half\">"+
"				Total Transfer Expense"+
"			</div>"+
"			<div class=\"right half\">"+
"				<%this.setting.currency%> <%this.summary.total_transfer_expense%>"+
"			</div>"+
"		</div>"+
"		"+
"		<div class=\"full hr\">"+
"		</div>"+
"		"+
"		<div class=\"left full grid-container\">"+
"			<div class=\"left half\">"+
"				Balance"+
"			</div>"+
"			<div class=\"right half\">"+
"				<%this.setting.currency%> <%this.summary.last_period_balance + this.summary.total_transfer_income + this.summary.total_income - this.summary.total_expense - this.summary.total_transfer_expense%>"+
"			</div>"+
"		</div>"+
"		"+
"		<div class=\"full\" style=\"height:1.5em\"> </div>"+
"		"+
"		<div class=\"full grid-container\">"+
"			<div class=\"right half\">"+
"				<button id=\"bt_home_add_income\" class=\"full\">ADD INCOME</button>"+
"			</div>"+
"			<div class=\"left half\">"+
"				<button id=\"bt_home_add_expense\" class=\"full\">ADD EXPENSE</button>"+
"			</div>"+
"		</div>"+
"		"+
"		<div class=\"full\" style=\"height:1em\"> </div>"+
"		"+
"		<div class=\"full grid-container\">"+
"			<div class=\"full center\">"+
"				<button id=\"bt_home_edit_accounts\" class=\"full\" style=\"max-width:480px;\">EDIT ACCOUNT</button>"+
"			</div>"+
"		</div>"+
"		<div class=\"full\" style=\"height:1em\"> </div>"+
"		<div class=\"full grid-container\">"+
"			<div class=\"right half\">"+
"				<button id=\"bt_home_edit_incomes\" class=\"full\" style=\"max-width:240px;\">Edit Incomes</button>"+
"			</div>"+
"			<div class=\"left half\">"+
"				<button id=\"bt_home_edit_expenses\" class=\"full\" style=\"max-width:240px;\">Edit Expenses</button>"+
"			</div>"+
"		</div>"+
"		"+
"	</section>"+
"<%}%>"+
"</div>";