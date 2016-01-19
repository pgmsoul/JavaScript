
function get_select_text(){
	var sel = window.getSelection ? window.getSelection().toString() : document.selection.createRange().text;
	return sel.trim();
}
document.body.addEventListener('mouseup',function(e){
	var sel = get_select_text();
	var fanyi = document.getElementById("jsuse_fanyi_div");
	if(isInFanyiDiv(e.target)) return;
	if(sel!=""){
		if(sel.length>64) return;
		if(fanyi.style.display=="block"){
			var msg = {"word":sel,"protocol":document.location.protocol}
			chrome.extension.sendMessage(msg,onFanyiSuccess);
		}
	}else{
		if(fanyi.style.display=="block"){
			fanyi.style.padding = 0;
			fanyi.innerHTML = "";
		}		
	}
});
function isInFanyiDiv(target){
	for(var i=0;i<4;i++){
		if(target.id=="jsuse_fanyi_div") return true;
		target = target.parentNode;
		if(!target) return false;
	}
	return false;
}

function onFanyiSuccess(data){
	var fanyi_html = "<div style='padding-bottom:0.3em;text-align:left;font-size:20px;'>"+safe_html(data.query)+"&nbsp;&nbsp;<img id='_ju_sound_img' style='margin-bottom:-0.21em;cursor:pointer;' width='24px' height='22px' src='"+
	_ju_sound_url+"0.png'>"+
	"<audio id='_ju_sound' src='"+document.location.protocol+"//dict.youdao.com/dictvoice?audio="+encodeURIComponent(data.query)+"'></div>";
	if(data.errorCode!=0){
		fanyi_html += "<div style='color:red;padding-bottom:0.3em;text-align:left;'>没有查询到结果</div>";
		showFanyi(fanyi_html);
		return;
	}
	var basic = data.basic;
	if(!basic&&data.translation){
		for(var i=0;i<data.translation.length;i++){
			var trans = data.translation[i];
			fanyi_html += "</div><div style='padding-bottom:0.3em;text-align:left;'>"+safe_html(trans)+"</div>";
		}
		showFanyi(fanyi_html);
		return;
	}
	if(basic){
		fanyi_html += "<div style='margin-bottom:0.8em'>";
		var hasPhonetic = false;
		if(basic["uk-phonetic"]){
			fanyi_html += getPhoneticHtml(basic["uk-phonetic"],data.query,1,"英");
			fanyi_html += "&nbsp;&nbsp;";
			hasPhonetic = true;
		}
		if(basic["us-phonetic"]){
			fanyi_html += getPhoneticHtml(basic["us-phonetic"],data.query,2,"美");
			hasPhonetic = true;
		}
		if(!hasPhonetic&&basic["phonetic"]){
			fanyi_html += getPhoneticHtml(basic["phonetic"],data.query,1,"");
		}
		fanyi_html += "</div>";
	}
	if(basic&&basic.explains){
		for(var i=0;i<basic.explains.length;i++){
			var exp = basic.explains[i];
			fanyi_html += "<div style='padding-bottom:0.3em;text-align:left;'>"+safe_html(exp)+"</div>";
		}
	}
	showFanyi(fanyi_html);
}
function getPhoneticHtml(phonetic,word,type,tname){
	return "<span id='_ju_phonetic"+type+"' style='color:#090;padding-bottom:0.3em;text-align:left;cursor:pointer'>"+tname+" ["+safe_html(phonetic)+
	"]</span><audio id='_ju_sound_"+type+"' src='"+document.location.protocol+"//dict.youdao.com/dictvoice?audio="+encodeURIComponent(word)+"&type="+type+"'></audio>";
}

function showFanyi(html){
	var fanyi = document.getElementById("jsuse_fanyi_div");
	fanyi.innerHTML = html;
	fanyi.style.padding = "1em";
	function playEffect(){
		var img = document.getElementById("_ju_sound_img");
		var i = 0,j = 0;
		var iv = setInterval(function(){
			i++;j++;
			if(i>2) i = 0;
			img.src = _ju_sound_url+i+".png";
			if(j==6) clearInterval(iv);
		},300);
	}
	var sound;
	sound = document.getElementById("_ju_sound_img");
	if(sound) sound.addEventListener("click",function(){
		document.getElementById("_ju_sound").play();
		playEffect();
	});
	sound = document.getElementById("_ju_phonetic1");
	if(sound) sound.addEventListener("click",function(){
		document.getElementById("_ju_sound_1").play();
		playEffect();
	});
	sound = document.getElementById("_ju_phonetic2");
	if(sound) sound.addEventListener("click",function(){
		document.getElementById("_ju_sound_2").play();
		playEffect();
	});
}
chrome.extension.onMessage.addListener(function(result, sender, sendResponse) {
	var fanyi = document.getElementById("jsuse_fanyi_div");
	if(result.fanyi_command === "switch_fanyi"){
		if(fanyi.style.display!="none"){
			fanyi.style.display = "none";
			sendResponse({"show":"Close"});
		}else{
			fanyi.style.display = "block";
			sendResponse({"show":"Show"});
			window._ju_sound_url = chrome.extension.getURL("sound");
		}
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
	fanyi.style.width = "260px";
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
	fanyi.innerHTML = "极优翻译加载成功";
	document.body.appendChild(fanyi);
}
createFanyiDiv();


