
function ju_ajax(url,word,soundUrl,sendResponse){
	try{
		var ajax = new XMLHttpRequest();
		ajax.open("GET", url, true);
		ajax.onreadystatechange = function() {
			if (ajax.readyState != 4) return;
			var json = JSON.parse(ajax.responseText);
			if(!json){
				return;
			}
			json.sound = soundUrl;
			json.word = word;
			sendResponse(json);
			/*if (queryWord.indexOf("-") !== -1 && !self.checkErrorCode(result.errorCode).error && !self.haveTranslation(result)) {
				//优化使用连字符的词的查询结果
				new ChaZD(queryWord.replace(/-/g, " "), useHttps, wordSource, sendResponse);
			} else {
				var resultObj = self.parseResult.call(self, result);
				sendResponse(resultObj);
			}*/
		};
		ajax.send();
	}catch(e){
		sendResponse(e.message);
	}
}

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse){
	if(!msg.word&&!msg.protocol){
		return;
	}
	var url = msg.protocol + "//fanyi.youdao.com/openapi.do?keyfrom=jsusecom&key=1798034141&type=data&doctype=json&version=1.1&q="+encodeURIComponent(msg.word);
	msg.url = url;
	var soundUrl = msg.protocol + "//dict.youdao.com/dictvoice?audio="+msg.word+"&type=1";
	msg.sound = soundUrl;
	ju_ajax(url,msg.word,soundUrl,sendResponse);
	return true;
});
