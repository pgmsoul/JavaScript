
chrome.tabs.query({
    active: true,
	currentWindow: true,
    lastFocusedWindow: true
},
function(tabs) {
    var tab = tabs[0];//url: tab.url,description: tab.title
	chrome.tabs.sendMessage(tab.id, {"fanyi_command":"switch_fanyi"}, function(response) {
		document.getElementById("resonse_div").innerHTML = (response.show=="Show")?"再次点击关闭":"已关闭极优翻译";
	});
});
