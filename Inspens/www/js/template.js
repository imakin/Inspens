TemplateEngine = function(html, options, templatecbfunction) {
	var re = /<%(.+?)%>/g, 
		reExp = /(^( )?(var|if|for|else|switch|case|break|{|}|;))(.*)?/g, 
		code = 'with(obj) { var r=[];\n', 
		cursor = 0, 
		result;
	var add = function(line, js) {
		js? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
			(code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
		return add;
	}
	while(match = re.exec(html)) {
		add(html.slice(cursor, match.index))(match[1], true);
		cursor = match.index + match[0].length;
	}
	add(html.substr(cursor, html.length - cursor));
	code = (code + 'return r.join(""); }').replace(/[\r\t\n]/g, '');
	try { result = new Function('obj', code).apply(options, [options]); }
	catch(err) { console.error("'" + err.message + "'", " in \n\nCode:\n", code, "\n"); }
	templatecbfunction(result);
	//~ return result;
}

// Register room in index.html, 
// store room template at folder room/[name].html, compiled to .js by make all (see Makefile)
function refresh(room_template, context) {
	TemplateEngine(
		room_template, context, 
		function(compiledpage){
			$("#page").html(compiledpage);
			refresh_style(); //reload css related styles: style.js
		}
	);
	
}
ctx = {}
$(function(){
	home_ctl.initialize();
	TemplateEngine(
		room_room_list, {}, 
		function(cp) {
			$("#room_list_container").html(cp);
			refresh_style();
		}
	);
	
	$("body").on("click", "#bt_goto_home", function() { home_ctl.initialize(); $("#room_list_container").toggle() });
	$("body").on("click", "#bt_goto_console", function() {console_ctl.initialize(); $("#room_list_container").toggle()});
	$("body").on("click", "#bt_goto_add_expense", function() {add_expense_ctl.initialize(); $("#room_list_container").toggle()});
	$("body").on("click", "#menu", function(){$("#room_list_container").toggle();});
});
//~ $(function(){refresh(room_console, ctx);});
	
