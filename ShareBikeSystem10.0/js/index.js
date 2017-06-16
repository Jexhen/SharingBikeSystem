var users = new Array(4);
users[0] = new Array("3114004049", "廖志行", "15521130104");
users[1] = new Array("3214004066", "黄欣欣", "18826135322");
users[2] = new Array("3214004072", "林舒欣", "18826139186");
users[3] = new Array("3214004073", "彭娇娇", "18813292663");

function check() {
	idVal = document.getElementById("id").value;
	passwdVal = document.getElementById("password").value;
	if (idVal == "test" && passwdVal == "") {
		alert("欢迎您，游客！");
		location.href = "web/system.html?admin=" + "游客";
		return;
	}
	if(idVal == "") {
		showTips("账号不能为空！");
	} else if(passwdVal == "") {
		showTips("密码不能为空！");
	} else {
		checkUser(idVal, passwdVal);
	}
}

function checkUser(id, passwd) {
	for (var i = 0; i < users.length; i++) {
		if (id == users[i][0] && id != 'visitor') {
			if (passwd == users[i][2]) {
				alert("欢迎您！管理员：" + users[i][1]);
				location.href = "web/system.html?admin=" + users[i][1];
				break;
			}
		}
	}
	if (i == users.length){
		showTips("账号或者密码错误！")
	}
}

function showTips(tip) {
	tipsEle = document.getElementById("tips");
	tipsEle.innerHTML = tip;
	tipsEle.style.display = "block";
}

function changeColor(color) {
	loginBtnEle = document.getElementById("login_button");
	loginBtnEle.style.backgroundColor = color;
}