function console_run() {
	query = $("#console").val();
	db.transaction(function(tx) {
		tx.executeSql(
			query,[],
			function(tx,res){
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
