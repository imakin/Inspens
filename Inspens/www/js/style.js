function refresh_style(){
	winW = $(window).width();
	winH = $(window).height();
	fontsizedefault = parseFloat($("#page").css("font-size").
						replace("px","").replace("pt",""));
	
	$("#page-container").width(winW);
	$("#page-container .scrollright").width(
		$("#page-container").width()*$(".scrollright .main").length
	);
	
	var  mainmargin = parseInt($(".scrollright .main").css("margin-left"));
	$(".scrollright .main").width(winW - 2*(mainmargin));
	
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
