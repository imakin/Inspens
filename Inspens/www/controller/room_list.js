room_list_ctl = {
	initialize: 
			function() {
				//-- back button on Home must trigger to exit
				document.addEventListener("backbutton", backButtonHandler, false);
				function backButtonHandler(e )
				{
					if (window.location.hash.search("#home")>=0 || 
						window.location.hash==""
					)
					{
						// Code to exit app for android
						navigator.app.exitApp();
					}
					else
					{
						// Code to navigate to the history action
						navigator.app.backHistory();
					}
				}
				
				//-- decide which link shall we go on all action
				if (window.location.pathname.search("index.jump.html")>=0)
					windowjump = "index.html"
				else
					windowjump = "index.jump.html"
				//-- get all the $_GET vars
				var parts = window.location.hash.substr(window.location.hash.search("\\?")+1).split("&");
				$_GET = {};
				for (var i = 0; i < parts.length; i++) {
					var temp = parts[i].split("=");
					$_GET[decodeURIComponent(temp[0])] = decodeURIComponent(temp[1]);
				}
				if (!ctx.base)
					ctx.base = {}
				if ($_GET['ctx.base.number'])
					ctx.base.number = $_GET['ctx.base.number'];
				if ($_GET['ctx.base.pos'])
					ctx.base.pos = $_GET['ctx.base.pos'];
				
				TemplateEngine(
					room_room_list, {}, 
					function(cp) {
						$("#room_list_container").html(cp);
						refresh_style();
						room_list_ctl.setup_buttoncb()
					}
				);
				model_refreshBaseNames(function(){
					//-- decide which room is now
					if (window.location.hash.search("#add_expense")>=0)
					{
						add_expense_ctl.initialize();
					}
					else if(window.location.hash.search("#console")>=0)
					{
						console_ctl.initialize();
					}
					else 
					{
						home_ctl.initialize();
					}
				});
			},
	close: 
			function() {
			},
	setup_buttoncb:
			function() {
				$("body").on("click", "#bt_goto_home", room_list_ctl.goto_home);
				$("body").on("click", "#bt_goto_console", room_list_ctl.goto_console);
				$("body").on("click", "#bt_goto_add_expense", room_list_ctl.goto_add_expense);
				
				$("body").on("click", "#menu", function(){$("#room_list_container").toggle();});
			},
	goto_home:
			function() {
				window.location = windowjump+"#home?"+
						"ctx.base.pos="+ctx.base.pos;
				$("#room_list_container").hide() 
			},
	goto_console:
			function() {
				window.location = windowjump+"#console?"+
						"ctx.base.pos="+ctx.base.pos;
				$("#room_list_container").hide()
			},
	goto_add_expense:
			function() {
				window.location = windowjump+"#add_expense?"+
						"ctx.base.pos="+ctx.base.pos;
				$("#room_list_container").hide()
			},
	goto_add_income:
			function() {},
	goto_edit_accounts:
			function() {},
}
