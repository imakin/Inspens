model.incomesexpenses = {
	name: 'incomesexpenses',
	fields: ['id', 'base_account_id', 'from_account_id', 'description', 'type', 'amount', 'date'],
	sql: 'select * from incomesexpenses ',
		
		/**
		 * all executed callback params are cbfunction(tx,res) and cb2(void)
		 * passed to function
		 */
	all: 
			function(cbfunction,cb2){
				//-- get all, when done cbfunction(tx,res) will be called,
				//-- and cb2(void) will be called also if any
				db.transaction(function(tx){
					tx.executeSql(model.incomesexpenses.sql, [], 
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
					tx.executeSql(model.accounts.sql+" WHERE "+filter_string, [], 
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
						data[field] = "(SELECT "+field+" FROM "+model.incomesexpenses.name+
									" WHERE id="+data.id+")";	
				}
				db.transaction(function(tx){
					tx.executeSql(
						"INSERT OR REPLACE INTO "+model.incomesexpenses.name+
						" (id, base_account_id, from_account_id, description, type, amount, date) VALUES("+
							"'"+data.id+"', "+
							"'"+data.base_account_id+"', "+
							"'"+data.from_account_id+"', "+
							"'"+data.description+"', "+
							"'"+data.type+"', "+
							"'"+data.amount+"', "+
							"'"+data.date+"')",
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
			//--replace. executed
				db.transaction(function(tx){
						tx.executeSql(
								"INSERT INTO "+model.incomesexpenses.name+
								" (id, base_account_id, from_account_id, description, type, amount, date) VALUES("+
									"("+
										"("+
											"case (select exists (select 1 from "+model.incomesexpenses.name+")) "+
											"when NULL then 0 "+
											"when 0 then 0 "+
											"when 1 then ("+
												"((SELECT id FROM "+model.incomesexpenses.name+" ORDER BY id DESC LIMIT 1)+1)"+
											")"+
											"end"+
										")"+
									"), "+
									"'"+data.base_account_id+"', "+
									"'"+data.from_account_id+"', "+
									"'"+data.description+"', "+
									"'"+data.type+"', "+
									"'"+data.amount+"', "+
									"'"+data.date+"')",
							[],
							function(tx,res){
								cbfunction(tx,res);
								cb2();
							}
						);
				});
			},
	ctx_reload_all: 
			function(done_callback){
				//-- reload all ctx values that retrieved from database, specific for this home room only
				//-- done callback called when ctx is reloaded
				//-- don't judge me, this is how asynchronous done
				model.accounts.filter(
					"type='BASE' ORDER BY id",
					function(tx,res){
						ctx.base.names = [{id:0, name:'zero'}]
						for (aci=0; aci<res.rows.length; aci++){
							ctx.base.names.push({id:res.rows.item(aci).id, name:res.rows.item(aci).name});
						}
						ctx.base.total = res.rows.length;
						ctx.base.number = ctx.base.names[ctx.base.pos].id;
						
						//~ console.log("pos: "+ctx.base.pos+" and id:"+ctx.base.number);
						
						getMonthSummary("EXPENSE", 0, "BETWEEN", -1, ctx.base.number,
							function(tx, res){
								if (res.rows.length<1 || res.rows.item(0).sum_amount==null) {
									ctx.summary.total_expense = 0.0;
								}
								else {
									ctx.summary.total_expense = parseFloat(res.rows.item(0).sum_amount);
								}
								getMonthSummary("INCOME", 0, "BETWEEN", -1, ctx.base.number,
									function(tx,res){
										if (res.rows.length<1 || res.rows.item(0).sum_amount==null) {
											ctx.summary.total_income = 0.0;
										}
										else {
											ctx.summary.total_income = parseFloat(res.rows.item(0).sum_amount);
										}
										getMonthSummary("TRANSFERINCOME", 0, "BETWEEN", -1, ctx.base.number,
											function(tx,res){
												if (res.rows.length<1 || res.rows.item(0).sum_amount==null) {
													ctx.summary.total_transfer_income = 0.0;
												}
												else {
													ctx.summary.total_transfer_income = parseFloat(res.rows.item(0).sum_amount);
												}
												getMonthSummary("TRANSFEREXPENSE", 0, "BETWEEN", -1, ctx.base.number,
													function(tx,res){
														if (res.rows.length<1 || res.rows.item(0).sum_amount==null) {
															ctx.summary.total_transfer_expense = 0.0;
														}
														else {
															ctx.summary.total_transfer_expense = parseFloat(res.rows.item(0).sum_amount);
														}
														done_callback();
													}
												);//--transfer expense
											}
										);//-- transfer income
									}
								);//--income
							}
						);//--expense
					},
					function(){}
				);	
			},
	ctx_reload_expense_tm: 
			function(done_callback){
				getMonthSummary("EXPENSE", 0, "BETWEEN", -1, ctx.base.number,
							function(tx, res){
								if (res.rows.length<1 || res.rows.item(0).sum_amount==null) {
									ctx.summary.total_expense = 0.0;
								}
								else {
									ctx.summary.total_expense = parseFloat(res.rows.item(0).sum_amount);
								}
								done_callback();
							}
				);
			},
	ctx_reload_income_tm: 
			function(done_callback){
				getMonthSummary("INCOME", 0, "BETWEEN", -1, ctx.base.number,
							function(tx,res){
								if (res.rows.length<1 || res.rows.item(0).sum_amount==null) {
									ctx.summary.total_income = 0.0;
								}
								else {
									ctx.summary.total_income = parseFloat(res.rows.item(0).sum_amount);
								}
								done_callback();
							}
				);
			},
	ctx_reload_transferincome_tm: 
			function(done_callback){
				getMonthSummary("TRANSFERINCOME", 0, "BETWEEN", -1, ctx.base.number,
							function(tx,res){
								if (res.rows.length<1 || res.rows.item(0).sum_amount==null) {
									ctx.summary.total_transfer_income = 0.0;
								}
								else {
									ctx.summary.total_transfer_income = parseFloat(res.rows.item(0).sum_amount);
								}
								done_callback();
							}
				);
			},
	ctx_reload_transferexpense_tm: 
			function(done_callback){
				getMonthSummary("TRANSFEREXPENSE", 0, "BETWEEN", -1, ctx.base.number,
							function(tx,res){
								if (res.rows.length<1 || res.rows.item(0).sum_amount==null) {
									ctx.summary.total_transfer_expense = 0.0;
								}
								else {
									ctx.summary.total_transfer_expense = parseFloat(res.rows.item(0).sum_amount);
								}
								done_callback();
							}
				);
			},
};
