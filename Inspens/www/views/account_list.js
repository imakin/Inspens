room_account_list = ""+
"<div class=\"fr\">"+
"	<div class=\"center full\">"+
"		<%this.message%> "+
"	</div>"+
"	<%for (var index=0; index<this.len;index++) {%>"+
"		<div class=\"center full\">"+
"			<button "+
"				id=\"bt_account_list_<%this.accounts.item(index).id%>\" "+
"				data-id=\"<%this.accounts.item(index).id%>\""+
"				data-name=\"<%this.accounts.item(index).name%>\""+
"				data-type=\"<%this.accounts.item(index).type%>\""+
"				data-enabled=\"<%this.accounts.item(index).enabled%>\""+
"				class=\"w7\""+
"			>"+
"				<%this.accounts.item(index).name%>"+
"			</button>"+
"		</div>"+
"	<%}%>"+
"</div>";