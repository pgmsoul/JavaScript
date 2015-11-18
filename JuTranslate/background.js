
function ju_ajax(url,data,onsuccess,onfail){
	var param = {
		'url':url,
		'data':data,
		'type':'get',
		'cache':false,
		'dataType':'json',
		'success':function(data) {
			if(typeof onsuccess === "function") onsuccess(data);
		},
		'error' : function(e) {
			if(typeof onsuccess === "function") {
				if(!onfail(e)){
					console.log(e.responseText);
				}
			}
		}
	}
	$.ajax(param);
}
chrome.runtime.onMessage.addListener(function(msg, sender, sendRequest){
	if(!msg.word) return;
	console.log("recv msg:"+msg.word);
	//ju_ajax();
});
