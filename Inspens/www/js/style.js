function refresh_style(){
	winW = $(window).width();
	winH = $(window).height();
	fontsizedefault = parseFloat($("#page").css("font-size").
						replace("px","").replace("pt",""));
	
	
	$("#page-container").width(winW);
	$("#page-container .sidescroll").width(
		$("#page-container").width()*$(".sidescroll .main").length
		//~ $("#page-container").width()*3
	);
	var  mainmargin = parseInt($(".sidescroll .main").css("margin-left"));
	$(".sidescroll .main").width(winW - 2*(mainmargin));
	
	
	
	$(".popup").each(function(){$(this).css("left", (winW-$(this).width())/2)});
	
	$(".space-vertical").each(function(){
			$(this).css(
				"height",
				fontsizedefault*parseFloat($(this).attr("data-space"))+"px"
			);
		}
	);
}
//~ $(function(){
//~ }
//~ );
