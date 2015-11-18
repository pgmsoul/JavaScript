
(function(){
	console.log("init popup extension");
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.sendMessage(tab.id, {"fanyi_command":"switch_fanyi"}, function(response) {
			console.log(response.show);
			$("#resonse_div").html(response.show);
			if(resonse.word)
				get_fanyi(response.word,tab.id);
		});
	});
})();
function get_fanyi(word,tabid){
	ju_ajax("http://jsuse.sinaapp.com/tools/english/api.html",{
		"func": "fanyi",
		"word": word
	},
	function onsuccess(data){
		console.log("success:"+data);
		chrome.tabs.sendMessage(tabid,{"fanyi_success":data});
	},
	function onfail(){
		$("#fanyi_body").empty();
		$("#fanyi_body").append("<div>"+safe_html(word)+"</div>");
		$("#fanyi_body").append("<div class='red'>没有查询到结果</div>");
		return true;
	});
}
function ju_ajax(url,data,onsuccess,onfail){
	var param = {
		'url':url,
		'data':data,
		'type':'post',
		'cache':false,
		'dataType':'json',
		'success':function(data) {
			if(typeof onsuccess === "function") onsuccess(data);
		},
		'error' : function(e) {
			if(typeof onsuccess === "function") {
				if(!onfail(e)){
					ju_alert(e.responseText);
				}
			}
		}
	}
	$.ajax(param);
}