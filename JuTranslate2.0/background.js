
function ju_ajax(msg,sendResponse){
	try{
		var url = msg.protocol + "//fanyi.youdao.com/openapi.do?keyfrom=jsusecom&key=1798034141&type=data&doctype=json&version=1.1&q="+encodeURIComponent(msg.word);
		var ajax = new XMLHttpRequest();
		ajax.open("GET", url, true);
		ajax.onreadystatechange = function() {
			if (ajax.readyState != 4) return;
			var json = JSON.parse(ajax.responseText);
			if(!json){
				return;
			}
			if(json.errorCode==0){
				sendResponse(json);
			}else if (msg.word.indexOf("-") !== -1) {
				ju_ajax(msg.word.replace(/-/g, ""),sendResponse);
			}
		};
		ajax.send();
	}catch(e){
		sendResponse(e.message);
	}
	return true;
}

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse){
	if(!msg.word&&!msg.protocol){
		return;
	}
	ju_ajax(msg,sendResponse);
	return true;
});
