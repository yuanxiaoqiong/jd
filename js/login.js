let form = document.querySelector('main>form'); //表单
let btn = document.querySelector('main>form button'); //登录按钮
//input节点
let username = document.querySelectorAll('main>form input')[0];
let password1 = document.querySelectorAll('main li>input')[1];
let password2 = document.querySelectorAll('main li>input')[2];
//console.log(password2);
//提示节点
let userTip = document.querySelector('main>form .tip1');
let pas1Tip = document.querySelector('main>form .tip2');
let pas2Tip = document.querySelector('main>form .tip3');
//console.log(userTip);

//用户名失去焦点就获取input的值
username.onblur = function () {
    let name = username.value; //拿到输入的用户名
    if (!name) {
        userTip.innerHTML = '用户名不能为空';
        userTip.style.color = 'red';
    }
    let loname = JSON.parse(localStorage.getItem('user')); //取出local里的用户名
    console.log(name,loname);
    for (let k in loname) { //遍历local,对比用户名
        if (k != name) {
            userTip.innerHTML = '该用户名不存在';
            userTip.style.color = 'red';
            btn.type = "button"; //阻止按钮跳动行为
            form.removeAttribute('action'); //阻止按钮提交表单-改变按钮的默认类型submit
        }
    }
}
username.onfocus = function () { //用户名获得焦点
    userTip.innerHTML = '用户名不能为空';
    userTip.style.color = '#ff9911';
}
btn.onclick = function () { //点击登录,为空不能提交,两次密码不同不能提交
    let name = username.value; //拿到输入的用户名
    let pas1 = password1.value;
    let pas2 = password2.value;
    if (!name || !pas1 || !pas2) { //为空
        // form.setAttribute('action','./registered.html')
        btn.type = "button"; //阻止按钮跳动行为
        form.removeAttribute('action');
    }
    if (pas1 == pas2) { //两次密码匹配
        let user = JSON.parse(localStorage.getItem('user'));
        console.log(pas1);
        for (let k in user) { //判断local的匹配
            if (user[k] == pas1) {
                btn.type = 'submit';//按钮提交
            }
        }
    } else { //两次密码不匹配
        //	btn.type = 'button'; ////阻止按钮跳动行为
        form.removeAttribute('action');
        pas2Tip.innerHTML = '两次输入的密码不匹配';
        pas2Tip.style.color = 'red';
    }

}