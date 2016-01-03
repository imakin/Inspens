function refresh_style(){
	winW = $(window).width();
	winH = $(window).height();
	fontsizedefault = parseFloat($("#page").css("font-size").
						replace("px","").replace("pt",""));
	
	$("#page-container").width(winW*3);
	$("#page-container").css("left", -winW);
	$("#page-container >div").width(winW/100*90 - 1);
	$("#page-container >div").css("padding-left", winW/100*5);
	$("#page-container >div").css("padding-right", winW/100*5);
	
	$(".space-vertical").each(function(){
			$(this).css(
				"height",
				fontsizedefault*parseFloat($(this).attr("data-space"))+"px"
			);
		}
	);
}

$(refresh_style);
