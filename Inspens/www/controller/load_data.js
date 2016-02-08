/** 
 * controller for console
 * view : ../views/console.js (room_console)
 */

//~ $(function(){
	//~ $("#console_run").click(console_run);
//~ });
load_data_ctl = {
	initialize: 
		function(){
			try {ctx.active_room_close();} catch (err) {}
			refresh(room_load_data, ctx);
			ctx.active_room_close = load_data_ctl.close;
			$("#ip_load_data_phid").val("ab7727cd39702167");
			$("body").off("click", "#bt_load_data_phid", load_data_ctl.load);
			$("body").on("click", "#bt_load_data_phid", load_data_ctl.load);
		},
	close:
		function(){
			
		},
	loaded_db:
		{
			accounts:[],
			incomesexpenses:[],
			settings:[],
		},
	load_snapshot_dfs:
		function(snapshot){
			if (snapshot.hasChildren())
			{
				load_data_ctl.loaded_db[snapshot.key()] = {};
				snapshot.forEach(
					function(c_snapshot){
						console.log("going in"+c_snapshot.key());
						load_data_ctl.load_snapshot_dfs(c_snapshot);
					}
				);
			}
			else
			{
				load_data_ctl.loaded_db[snapshot.key()] = snapshot.val();
				load_data_ctl.loadlog(snapshot.val());
			}
		},
	load:
		function(){
			$("#ip_load_data_phid").attr("disabled","");
			$("#bt_load_data_phid").attr("disabled","");
			for (x=0;x<inspense_export["ab7727cd39702167"]["accounts"].length;x++)
			{
				var data = {
					id:inspense_export["ab7727cd39702167"]["accounts"][x]["col0"],
					name:inspense_export["ab7727cd39702167"]["accounts"][x]["col1"],
					type:inspense_export["ab7727cd39702167"]["accounts"][x]["col2"],
					enabled:inspense_export["ab7727cd39702167"]["accounts"][x]["col4"]
				}
				model.accounts.replace(data, function(tx,rs){}, function(){
						//~ load_data_ctl.loadlog("inserted "+data.name);
					});
			}
			for (x=0;x<inspense_export["ab7727cd39702167"]["incomesexpenses"].length;x++)
			{
				var data = {
					id:
						inspense_export["ab7727cd39702167"]["incomesexpenses"][x]["col0"],
					base_account_id:
						inspense_export["ab7727cd39702167"]["incomesexpenses"][x]["col1"],
					from_account_id:
						inspense_export["ab7727cd39702167"]["incomesexpenses"][x]["col2"],
					description:
						inspense_export["ab7727cd39702167"]["incomesexpenses"][x]["col3"],
					type:
						inspense_export["ab7727cd39702167"]["incomesexpenses"][x]["col4"],
					amount:
						inspense_export["ab7727cd39702167"]["incomesexpenses"][x]["col5"],
					date:
						inspense_export["ab7727cd39702167"]["incomesexpenses"][x]["col6"],
				};
				model.incomesexpenses.replace(data, function(tx,rs){}, function(){
						load_data_ctl.loadlog("inserted #"+data.id);
					});
			}
		},
	loadlog:
		function(msg){
			$("#load_data_status").html(""+msg);
		}
}
