var admin = "";
function init(){
	var flag = window.location.toString();
	var url = "" + decodeURI(flag);
	if (flag.indexOf('admin') == -1) {
		//不是登陆页面进来的
		body = document.getElementById("body");
		body.innerHTML = "系统只有在登录之后才能使用,将在<span id='second' style='color: red;'>5</span>秒之后自动跳转到<a href='../index.html'>登录界面</a>";
		timer = setInterval("changeSecond()", 1000);
	} else {
		//是登陆界面进来的，获得管理员名字
		start = url.indexOf('=');
		admin = url.substring(start+1);
		adminEle = document.getElementById("admin");
		adminEle.innerHTML = "欢迎您！管理员：" + admin + "&nbsp;&nbsp;&nbsp;&nbsp;<a href='../index.html'>退出</a>";
	}
}
//用于秒数动态改变
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
//监测单车是否停在指定地点，e为点击事件
function checkBike(e) {
	//获取指定停放地点的坐标
	var acceptRect = document.getElementById("acceptable").getBoundingClientRect();
	var left = acceptRect.left;
	var right = acceptRect.right;
	var top = acceptRect.top;
	var bottom = acceptRect.bottom;
	//获取全局地图的坐标，防止点击地图外界也会有响应
	var globalRect = document.getElementById("global").getBoundingClientRect();
	var g_left = globalRect.left;
	var g_right = globalRect.right;
	var g_top = globalRect.top;
	var g_bottom = globalRect.bottom;
	//在指定地点停放
	if (e.clientX >= left && e.clientX <= right && e.clientY >= top && e.clientY <= bottom) {
		dot = drawDot(e.clientX + 'px', e.clientY + 'px', 'regular');
		document.body.innerHTML += dot;
		alert("停车成功！");
	} else if (e.clientX >= g_left && e.clientX <= g_right && e.clientY >= g_top && e.clientY <= g_bottom){
		//在地图内的非指定地点停放
		handleIllegalBike(e.clientX, e.clientY);
	}
}
var timer = new Array();//放置计时器的数组，二维数组[][2],[i][0]存储计时器[i][1]存储是否空闲的布尔变量true为空闲
var timerLength = 0;//计时器数组的计数器
//处理不停在违规地点的单车，xy为坐标
function handleIllegalBike(x, y){
	var isConfirm = confirm("该地点坐标为(" + x + ", " + y + ")不是指定停放地点！随意停放单车将不会上锁并且会一直计时收费最终会罚款，您确定停放吗？");
	//如果知道非指定地点仍然停车
	if (isConfirm) {
		dot = drawDot(x + 'px', y + 'px', 'irregular');
		document.body.innerHTML += dot;
		//检查计时器数组有无空闲存储单元(即有单车已经被罚款,不需要再使用计时器)
		var i;
		for (i = 0; i < timer.length; i++) {
			//用空闲的存储单元将新的不停在指定地点的单车计时器放入
			if (timer[i][1]) {
				timer[i][1] = false;//将标志置为不空闲
				timer[i][0] = setInterval("fine(" + i + ")", 5000);
				break;
			}
		}
		//没有空闲的存储单元则在数组内创建一个新的存储单元
		if (i == timer.length) {
			timer[timerLength] = new Array();
			timer[timerLength][1] = false;//将标志置为不空闲
			timer[timerLength][0] = setInterval("fine(" + timerLength + ")", 5000);
			timerLength++;
		}
	//如果知道非指定地点不停车，则给出相应最近停放位置的提示
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
//罚款，index数组对应坐标
function fine(index){
	alert("在非指定地点停放时间达到上限！单车自动上锁！用户罚款￥200！通知管理员前往清理单车");
	clearInterval(timer[index][0]);//清除计时器
	timer[index][1] = true;//将数组单元设为空闲，以便新来的违规单车使用
	//当数组长度大于5时，检查违规车数是否大于5
	if (timer.length >= 5) {
		//当违规单车未被罚款数大于5时(占用数组空间)或者数组空间已经大于10时，管理员回收单车
		var num = 0;
		for (var i = 0; i < timer.length; i++) {
			if (timer[i][1] == false) {
				num++;
			}
		}
		if (num >= 5 || timer.length >= 10) {
			processIrregularBike();
			for (var i = 0; i < timer.length; i++) {
				clearInterval(timer[i][0]);//清除数组的全部计时器
				timer[i][1] = true;//数组全部单元置为空闲
			}
			timerLength = 0;//数组计数器置为0
			alert("管理员已经回收所有共享单车，在被回收单车时还未被罚款一律罚款￥200");
		}
	}	
}
//清场，回收全部违规单车
function processIrregularBike() {
	var irregularBikes = document.getElementsByClassName("irregular");
	for (var i = 0; i < irregularBikes.length; i++) {
		irregularBikes[i].style.display = "none";
	}
}
//在单车停放地点画一个单车图标，flag单车是否停在指定地点的标志，方便后来清场
function drawDot(x, y, flag) {
	var div = "<div class='"+ flag +"' style='position: absolute;left: "+(x)+";top: "+(y)+";width: 30px;height: 20px;background-image: url(../img/bike.png);'></div>"
	return div;
}
