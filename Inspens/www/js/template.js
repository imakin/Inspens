TemplateEngine = function(html, options) {
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
	return result;
}

// Register room in index.html, folder room/[name].js
$(function() {
compiledpage = TemplateEngine(
		room_home, {
			kecu:'aa',
			setting: {
				period_change: "1 to 1",
				currency: "IDR"
			},
			summary: {
				last_period_balance: 0,
				total_income: 0,
				total_expense: 200000,
				total_transfer_income: 500000,
				total_transfer_expense: 0
			},
			base: {
				number: 1,
				total: 6,
				name: "Cash in Hand"
			},
		}
	);
$("#page").html(compiledpage);
});
