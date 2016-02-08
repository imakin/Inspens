model.accounts = {
	name: 'accounts',
	fields: ['id', 'name', 'type', 'enabled'],
	sql: "SELECT * FROM accounts WHERE enabled=1 ", //all_disabled://not needed
		/**
		 * all executed callback params are cbfunction(tx,res) and cb2(void)
		 * passed to function
		 */
	all: 
			function(cbfunction,cb2){
				//-- get all, when done cbfunction(tx,res) will be called,
				//-- and cb2(void) will be called also if any
				db.transaction(function(tx){
					tx.executeSql(model.accounts.sql, [], 
						function(tx,res){
							cbfunction(tx,res);
							cb2();
						}
					);
				});
			},
	filter:
			function(filter_string, cbfunction, cb2){
				//-- e.g. filter_string "type='EXPENSE'"
				db.transaction(function(tx){
					tx.executeSql(model.accounts.sql+" AND "+filter_string, [], 
						function(tx,res){
							cbfunction(tx,res);
							cb2();
						}
					);
				});
			},
	replace: //-- index is id field
			function(data, cbfunction, cb2){
				for (field in model.accounts.fields) {
					//-- manually fill non specified data to current data. (SQLITE can't update, only replace)
					if (!data[field])
						data[field] = "(SELECT "+field+" FROM "+model.accounts.name+
									" WHERE id="+data.id+")";	
				}
				db.transaction(function(tx){
					tx.executeSql(
						"INSERT OR REPLACE INTO "+model.accounts.name+
						" (id,name,type,enabled) VALUES("+
							data.id+", "+
							"'"+data.name+"', "+
							"'"+data.type+"', "+
							"'"+data.enabled+"')",
						[],
						function(tx,res){
							cbfunction(tx,res);
							cb2();
						}
					);
				});
			},
	insert:
			function(data, cbfunction, cb2){
				var data_enabled = 1;
				try{ data_enabled = data.enabled;}
				catch(err){data_enabled = 1;}
					
				db.transaction(function(tx){
					tx.executeSql(
						"INSERT INTO "+model.accounts.name+
						" (id,name,type,enabled) VALUES("+
								"("+
										"("+
											"case (select exists (select 1 from "+model.accounts.name+")) "+
											"when NULL then 0 "+
											"when 0 then 0 "+
											"when 1 then ("+
												"((SELECT id FROM "+model.accounts.name+" ORDER BY id DESC LIMIT 1)+1)"+
											")"+
											"end"+
										")"+
								"), "+
							"'"+data.name+"', "+
							"'"+data.type+"', "+
							"'"+data_enabled+"')",
						[],
						function(tx,res){
							cbfunction(tx,res);
							cb2();
						}
					);
				});
			},
	disable:
			function(id, cbfunction, cb2){
				db.transaction(function(tx){
					tx.executeSql("UPDATE "+model.accounts.name+" set enabled=0"+
						" WHERE id="+id,
						[],
						function(tx,res){
							cbfunction(tx,res);
							cb2();
						}
					);
				});
			},
	reset:
			function(cbfunction, cb2){
				db.transaction(function(tx){
					tx.executeSql("DELETE FROM "+model.accounts.name,
						[],
						function(tx,res){
							cbfunction(tx,res);
							cb2();
						}
					);
				});
			},
}
