TemplateEngine = function(html, options, templatecbfunction) {
	//-- upon finished, templatecbfunction(result) will be called
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
//-- apply to selector 
function refreshTo(selector, room_template, context) {
	TemplateEngine(
		room_template, context, 
		function(compiledpage){
			$(selector).html(compiledpage);
			refresh_style(); //reload css related styles: style.js
		}
	);
}
//--init called in index.js
ctx = {}

function scrollLeftOverflow(idname,left) {
	/** cordova fix to set scroll position when overflow is not scroll **/
	$("#"+idname).css("overflow","hidden");
	document.getElementById(idname).scrollLeft = left;
	$("#"+idname).css("overflow","scroll");
}
function scrollLeftOverflowAnimate(idname,horpos) {
	/** todo **/
	var start = document.getElementById(idname).scrollLeft;
	$("#"+idname).css("overflow","hidden");
	if (horpos<start)
	{
		for (i=5;i<30;i+=5){
			setTimeout(function(){
				document.getElementById(idname).scrollLeft -= (start-horpos)/6;
			}, i);
		}
	}
	else
	{
		for (i=5;i<30;i+=5){
			setTimeout(function(){
				document.getElementById(idname).scrollLeft += (horpos-start)/6;
			}, i);
		}
	}
	//~ document.getElementById(idname).scrollLeft = horpos;
	$("#"+idname).css("overflow","scroll");
}
