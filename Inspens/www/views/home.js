room_home = ""+
"<header class=\"header\">"+
"	<div class=\"header-left\">"+
"		Inspens"+
"	</div>"+
"	<div class=\"header-right\">"+
"		|||"+
"	</div>"+
"</header>"+
"<section class=\"main\">"+
"	<div id=\"left full\">"+
"		(<%this.base.number%>/<%this.base.total%>) Base account: <%this.base.name%>"+
"	</div>"+
"	"+
"	<div class=\"mid full\">"+
"		Summary"+
"	</div>"+
"	"+
"	<div class=\"mid full\">"+
"		Period is:"+
"		<button type=\"button\">"+
"			<%this.setting.period_change%>"+
"		</button>"+
"	</div>"+
"	"+
"	<div class=\"left full grid-container\">"+
"		<div class=\"left half\">"+
"			Last Period Balance"+
"		</div>"+
"		<div class=\"right half\">"+
"			<%this.setting.currency%> <%this.summary.last_period_balance%>"+
"		</div>"+
"	</div>"+
"	<div class=\"left full grid-container\">"+
"		<div class=\"left half\">"+
"			Total Income"+
"		</div>"+
"		<div class=\"right half\">"+
"			<%this.setting.currency%> <%this.summary.total_income%>"+
"		</div>"+
"	</div>"+
"	<div class=\"left full grid-container\">"+
"		<div class=\"left half\">"+
"			Total Expense"+
"		</div>"+
"		<div class=\"right half\">"+
"			<%this.setting.currency%> <%this.summary.total_expense%>"+
"		</div>"+
"	</div>"+
"	<div class=\"left full grid-container\">"+
"		<div class=\"left half\">"+
"			Total Transfer Income"+
"		</div>"+
"		<div class=\"right half\">"+
"			<%this.setting.currency%> <%this.summary.total_transfer_income%>"+
"		</div>"+
"	</div>"+
"	<div class=\"left full grid-container\">"+
"		<div class=\"left half\">"+
"			Total Transfer Expense"+
"		</div>"+
"		<div class=\"right half\">"+
"			<%this.setting.currency%> <%this.summary.total_transfer_expense%>"+
"		</div>"+
"	</div>"+
"	"+
"	<div class=\"full hr\">"+
"	</div>"+
"	"+
"	<div class=\"left full grid-container\">"+
"		<div class=\"left half\">"+
"			Balance"+
"		</div>"+
"		<div class=\"right half\">"+
"			<%this.setting.currency%> <%this.summary.total_transfer_income + this.summary.total_income - this.summary.total_expense - this.summary.total_transfer_expense%>"+
"		</div>"+
"	</div>"+
"</section>";