
function get_select_text(){
	var sel = window.getSelection ? window.getSelection().toString() : document.selection.createRange().text;
	return sel.trim();
}
document.body.addEventListener('mouseup',function(){
	var sel = get_select_text();
	var fanyi = document.getElementById("jsuse_fanyi_div");
	if(sel!=""){
		if(sel.length>64) return;
		if(fanyi.style.display=="block"){
			chrome.extension.sendMessage(sel,document.location.protocol);
		}
	}else{
		if(fanyi.style.display=="block"){
			fanyi.style.padding = 0;
			fanyi.innerHTML = "";
		}		
	}
});
chrome.extension.onMessage.addListener(function(result, sender, sendResponse) {
	var fanyi = document.getElementById("jsuse_fanyi_div");
	if(result.fanyi_command === "switch_fanyi"){
		if(fanyi.style.display!="none"){
			fanyi.style.display = "none";
			sendResponse({"show":"Close"});
		}else{
			fanyi.style.display = "block";
			sendResponse({"show":"Show"});
		}
	}else if(result.fanyi_command === "fanyi"){
		createHtml(result);
	}
});

function safe_html(str){
	if(typeof str!="string") return "";
	str = str.replace(new RegExp('&','g'),'&#38;');
	str = str.replace(new RegExp('<','g'),'&lt;');
	str = str.replace(new RegExp('>','g'),'&gt;');
	return str;
}
function createFanyiDiv(){
	var fanyi = document.createElement("div");
	fanyi.id = "jsuse_fanyi_div";
	fanyi.style.align = "left";
	fanyi.style.fontSize = "14px";
	fanyi.style.width = "200px";
	fanyi.style.minHeight = "3px";
	fanyi.style.position = "fixed";
	fanyi.style.top = 0;
	fanyi.style.right = 0;
	fanyi.style.borderLeft = "1px solid #eee";
	fanyi.style.borderBottom = "1px solid #eee";
	fanyi.style.background = "#f6f6f6";
	fanyi.style.padding = "1em";
	fanyi.style.zIndex = "1999999999";
	fanyi.style.display = "none";
	fanyi.style.boxShadow = "1px 1px 5px 1px #ddd";
	fanyi.style.borderBottomLeftRadius = "10px";
	fanyi.innerHTML = "load success";
	document.body.appendChild(fanyi);
}
function create_html(data){
	var fanyi_html = "<div style='padding-bottom:0.3em;'>"+safe_html(data.query)+"</div>";
	if(data.errorCode!=0){
		fanyi_html += "<div style='color:red;padding-bottom:0.3em;'>no content return</div>";
		return fanyi_html;
	}
	var basic = data.basic;
	if(!basic&&data.translation){
		for(var i=0;i<data.translation.length;i++){
			var trans = data.translation[i];
			fanyi_html += "<div style='padding-bottom:0.3em;'>"+safe_html(trans)+"</div>";
		}
		return fanyi_html;
	}
	if(basic&&basic.phonetic)
		fanyi_html += "<div style='color:#090;padding-bottom:0.3em;'>["+safe_html(basic.phonetic)+"]</div>";
	if(basic&&basic.explains){
		for(var i=0;i<basic.explains.length;i++){
			var exp = basic.explains[i];
			fanyi_html += "<div style='padding-bottom:0.3em;'>"+safe_html(exp)+"</div>";
		}
	}
	return fanyi_html;
}
createFanyiDiv();


