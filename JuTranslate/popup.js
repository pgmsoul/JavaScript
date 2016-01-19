
(function(){
	console.log("ju translate extension init");
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.sendMessage(tab.id, {"fanyi_command":"switch_fanyi"}, function(response) {
			console.log(response.show);
			$("#resonse_div").html(response.show);
			if(resonse.word)
				get_fanyi(response.word,tab.id);
		});
	});
})();
function requestSuccess(result){
	$("#fanyi_body").empty();
	$("#fanyi_body").append("<div>"+safe_html(word)+"</div>");
	$("#fanyi_body").append("<div class='red'>没有查询到结果</div>");
}
