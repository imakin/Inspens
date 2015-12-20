function refresh_style(){
	winW = $(window).width();
	winH = $(window).height();
	
	$("#page-container").width(winW*3);
	$("#page-container").css("left", -winW);
	$("#page-container >div").width(winW/100*90 - 1);
	$("#page-container >div").css("padding-left", winW/100*5);
	$("#page-container >div").css("padding-right", winW/100*5);
	
}

$(refresh_style);
