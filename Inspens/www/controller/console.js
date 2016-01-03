function console_run() {
	var query = $("#console").val();
	db.transaction(function(tx) {
		tx.executeSql(
			query,[],
			function(tx, res){
				hasileiki = res;
				var div_content = ""
				for (i=0;i<res.rows.length;i++) {
					var data = hasileiki.rows.item(i);
					var keys = Object.keys(data);
					for (j=0;j<keys.length;j++) {
						
						div_content = div_content + res.rows.item(i)[keys[j]]+", ";
					}
					div_content = div_content+"<br/>"+"<br/>";
				}
				$("#console_result").html(div_content);
			}
		);
	});
}
$(function(){
	$("#console_run").click(console_run);
});
