var admin = "";
function init(){
	var flag = window.location.toString();
	var url = "" + decodeURI(flag);
	if (flag.indexOf('admin') == -1) {
		body = document.getElementById("body");
		body.innerHTML = "系统只有在登录之后才能使用,将在<span id='second' style='color: red;'>5</span>秒之后自动跳转到<a href='../index.html'>登录界面</a>";
		timer = setInterval("changeSecond()", 1000);
	} else {
		start = url.indexOf('=');
		admin = url.substring(start+1);
		adminEle = document.getElementById("admin");
		adminEle.innerHTML = "欢迎您！管理员：" + admin + "&nbsp;&nbsp;&nbsp;&nbsp;<a href='../index.html'>退出</a>";
	}
}
var i = 4;
function changeSecond() {
	var secondEle = document.getElementById("second");
	secondEle.innerHTML = i;
	if (i == 0) {
		clearInterval(timer);
		location.href = "../index.html";
	}
	i--;
}
function checkBike(e) {
	var acceptRect = document.getElementById("acceptable").getBoundingClientRect();
	var left = acceptRect.left;
	var right = acceptRect.right;
	var top = acceptRect.top;
	var bottom = acceptRect.bottom;
	var globalRect = document.getElementById("global").getBoundingClientRect();
	var g_left = globalRect.left;
	var g_right = globalRect.right;
	var g_top = globalRect.top;
	var g_bottom = globalRect.bottom;
	if (e.clientX >= left && e.clientX <= right && e.clientY >= top && e.clientY <= bottom) {
		alert("停车成功！");
	} else if (e.clientX >= g_left && e.clientX <= g_right && e.clientY >= g_top && e.clientY <= g_bottom){
		handleIllegalBike(e.clientX, e.clientY);
	}
}
function handleIllegalBike(x, y){
	var isConfirm = confirm("该地点坐标为(" + x + ", " + y + ")不是指定停放地点！随意停放单车将不会上锁并且会一直计时收费最终会罚款，您确定停放吗？");
	if (isConfirm) {
		timer = setInterval("fine()", 5000);
	} else {
		var acceptRect = document.getElementById("acceptable").getBoundingClientRect();
		var left = acceptRect.left;
		var top = acceptRect.top;
		if (x > left && y == top) {
			alert("最近的停车点请往正西方向骑行！");
		}
		if (x < left && y == top) {
			alert("最近的停车点请往正东方向骑行！");
		}
		if (x == left && y < top) {
			alert("最近的停车点请往正南方向骑行！");
		}
		if (x == left && y > top) {
			alert("最近的停车点请往正北方向骑行！");
		}
		if (x > left && y < top) {
			alert("最近的停车点请往西南方向骑行！");
		}
		if (x > left && y > top) {
			alert("最近的停车点请往西北方向骑行！");
		}
		if (x < left && y < top) {
			alert("最近的停车点请往东南方向骑行！");
		}
		if (x < left && y > top) {
			alert("最近的停车点请往东北方向骑行！");
		}
	}
}
function fine(){
	alert("在非指定地点停放时间达到上限！单车自动上锁！用户罚款￥200！通知管理员前往清理单车");
	clearInterval(timer);
}