function console_run() {
	var query = $("#console").val();
	db.transaction(function(tx) {
		console.log("querying "+query);
		tx.executeSql(
			query,[],
			function(tx,res){
				console.log("DONE querying "+query);
				var div_content = ">"
				for (i=0;i<res.rows.length;i++) {
					div_content = div_content + res.rows.item(i).toSource();
					console.log(res.rows.item(i).toSource());
				}
				$("#console_result").html(div_content);
			}
		);
	});
}
$(function(){
	$("#console_run").click(function() {
		console_run();
		console.log("perkecuan");
	});
});
