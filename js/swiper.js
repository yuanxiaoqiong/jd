//const { from } = require("pumpify");

window.addEventListener('load', function () {
    //--获取元素
    let btnLf = document.querySelector('.lunbotu .btn_l') //左按钮
    let btnRg = document.querySelector('.lunbotu .btn_r') //右按钮
    let swiper = document.querySelector('.shop_nav .lunbotu') //拿到轮播图
    let swiperWidth = swiper.offsetWidth; //放到全局位置,因为多次点击事件的动画里会使用


    /*--第一个模块-1.动态创建小圆圈,2.默认给第一个小圆圈设置白色背景,3.给当前点击小圆圈设置背景色,4.点击小圆圈图片滑动*/

    //1.动态生成小圆圈,遍历ul拿到li的个数,几个li就生成几个,放进ol
    let lis = swiper.querySelector('.lunbotu .content').children; //一定限定是轮播图里的ul,拿到所有li
    let ol = swiper.querySelector('.lunbotu ol');
    let ul = swiper.querySelector('.lunbotu .content');

    for (let i = 0; i < lis.length; i++) {
        let li = document.createElement('li'); //创建一个小圆圈
        li.setAttribute('index', i); //自定义属性保存小圆圈的下标,用于缓动距离计算
        ol.appendChild(li); //追加到ol里面
        //3.当前小圆圈变白色
        li.addEventListener('click', function () { //创建小圆圈时给小圆圈绑定点击事件:小圆圈排他思想,生成li的同时绑定点击事件
            for (let i = 0; i < ol.children.length; i++) { //遍历ol拿到所有li
                ol.children[i].className = ''; //清除所有li的类名
            }
            this.className = 'white'; //再给当前的li设置类名
            //4.小圆圈的图片轮播-移动ul
            let index = this.getAttribute('index'); //拿到自定义属性:当前点击的小圆圈的下标.
            //                                        因为小圆圈下标是局部变量,所以在控制ul移动的个地方要重新声明变量去代替下标,然后使变量和下标同步
            num = index; //点击小圆圈同时--让记录图片下标的num和小圆圈下标同步
            circle = index; //点击小圆圈同时--让记录小圆圈下标的circle和小圆圈下标同步

            animate(ul, -index * swiperWidth); // ul 缓动动画
        })
    }
    ol.children[0].className = 'white'; //默认给第一个li设置一个类名,类名里白色背景

    /*-- 第二个模块  点击左右按钮移动ul,小圆圈跟随: */
    //2.克隆第一个li,追加到ul最后面
    let last = ul.children[0].cloneNode(true); //注意,在遍历图片创建小圆圈之和克隆图片
    ul.appendChild(last)
    //1. 点击右边按钮,图片向左滚动一张
    let num = 0; //记录点击按钮ul的移动距离,相当于图片下标
    let circle = 0; //小圆圈的下标
    let flag = true; //节流阀  当点击一次按钮后,就要先判断一下是true,才执行点击事件,不过是true之后就要马上关闭为false
    
    btnRg.addEventListener('click', function () {
        if (flag) {
            flag = false; //是true就马上关闭,然后再执行事件功能
             if (num == ul.children.length - 1) { //如果ul走到了最后一张克隆的图片时,就让ul快速复原到0的位置,同时变量复原
                 ul.style.left = 0;
                 num = 0
             }
             num++;
            //showBanner(tar); //当前下标图片透明度1
            animate(ul, -num * swiperWidth, function () {
                flag = true;
            });
            circle++ //点击右边按钮事件里,小圆圈跟随右边按钮变动,颜色也要变动,要使图片下标和小圆圈下标同步:
            if (circle == ol.children.length) { //当小圆圈下标自增走到最后一个小圆圈时,下标复原到第一个.因为点击按钮时,图片比小圆圈下标多一个,图片自增到最后一个,小圆圈下标和图片下标一样,也要复原到0
                circle = 0
            }
            for (let i = 0; i < ol.children.length; i++) { //排他设置颜色
                ol.children[i].className = '';
            }
            ol.children[circle].className = 'white';
        }
    })
    //3. 点击左边按钮,图片向右滚动一张,点击事件使用--节流阀
    btnLf.addEventListener('click', function () {
        if (flag) {
            flag = false;
             if (num == 0) { //如果ul走到了第一张克隆的图片时,就让ul快速移动到最后的位置,同时变量下标恢复到最后一个
                 // ul.style.left =(ul.children.length - 1)*swiperWidth+'px';
                 // num = ul.children.length - 1;//加入num值和移动距离下标一样,又没有先后要求,就可以把num写在前面,然后替换
                 num = ul.children.length - 1
                 ul.style.left = -num * swiperWidth + 'px'; //注意left是负值
             }
             num--;
           // showBanner(tar); //当前下标图片透明度1
            animate(ul, -num * swiperWidth, function () {
                flag = true;
            });
            circle-- //点击右边按钮事件里,小圆圈跟随右边按钮变动,颜色也要变动,要使图片下标和小圆圈下标同步:
            if(circle<0){ //当小圆圈下标自减走到第一个小圆圈以后,下标复原到最后一个.因为点击按钮时,图片比小圆圈下标多一个,图片自减到第一个以后,小圆圈下标和图片下标一样,也要复原到最后一个
                circle=ol.children.length-1
            }
            circle < 0 ? circle = ol.children.length - 1 : circle;
            for (let i = 0; i < ol.children.length; i++) { //排他设置颜色 可以封装成函数给左右按钮点击调用
                ol.children[i].className = '';
            }
            ol.children[circle].className = 'white';
        }
    })
    /* function showBanner(tar) { //当前下标图片透明度1   
        for (let i = 0; i < lis.length; i++) {
            lis[i].className = '';
        }
        tar.className = 'show';
        flag = true;
    } */



    /*-- 第三个模块  自动轮播,当鼠标经过轮播图,自动播放停止*/
    let timer = null;

    function auto() {
        timer = setInterval(function () {
            btnRg.click(); //定时器手动调用右侧按钮点击事件 ,打开页面定时器就是开启的.使用的onclick调用时就是onclick()
        }, 3000) //使用的监听 click,调用时就是 click()
    }
    auto(); //记得调用
    swiper.addEventListener('mouseenter', function () { //鼠标经过轮播图,显示左右按钮,清除自动播放
        clearInterval(timer); //清除定时器
        // timer=null;   //因为timer变量已经不使用了,所以最后接着就清除这个变量
    })
    swiper.addEventListener('mouseleave', function () { //鼠标离开轮播图,显示左右按钮,开启自动播放
        auto()
    })



    /*-- 第一个模块  动态创建小圆圈,几张图片就生成几个,点击小圆圈移动ul:
                    1.拿到所有li,遍历所有li,创建一个li,放进ol
                    2.默认给第一个小圆圈设置白色背景.
                    创建li的同时给li绑定点击事件:
                    3.点击li变色:一个遍历拿到所有li,清除li的类名,遍历外给当前this点击小圆圈设置背景色
                    4.点击小圆圈图片滑动,滑动的是ul: 去创建li的地方把li的下标设置成li的自定义属性,
                      回到点击事件:拿到下标保存起来,拿到轮播的宽度(一张图片的宽度和轮播屏宽度相同)
                      调用缓动动画(把封装的缓动动画引入html)传参, animate(obj, target, cal1back) 
                      target: ul移动的距离=图片宽度*图片li的下标,注意是向左移动,是负值*/
    /*-- 第二个模块  点击左右按钮移动ul,小圆圈跟随:
                    1.点击右边按钮,图片滚动一张:
                      声明一个全局变量num,点击一次自增1,动画ul的目标距离=变量*图片宽度
                      无缝滚动: 把第一个li克隆一个追加到ul最后面,判断当ul滚到了最后一个li时,
                               让ul快速的,无动画的跳到第一个li:left=0,同时num=0,快速复原,准备开始重新滚动
                               li cloneNode() 里面加true 深克隆,复制节点和内容 ; false浅克隆 不复制节点

                    2.点击左右按钮,小圆圈跟随:声明一个全局变量circle,
                     
                    a.点击右边按钮一次就自增1,同时清除所有小圆圈的背景色,给当前下标的小圆圈设置背景色.
                      但是图片加上克隆的一共有6张,但是小圆圈length只有5个,所有必须在清除小圆圈背景前,加一个判断条件: 如果circle==length,那么circle=0
                      注意:克隆完的图片下标num,和小圆圈下标并不同步,必须要在点击小圆圈时拿到小圆圈下标,然后赋值给num
                     
                    b.点击左边按钮一次就自减1,同时清除所有小圆圈的背景色,给当前下标的小圆圈设置背景色.
                      但是图片加上克隆的一共有6张,但是小圆圈length只有5个,所有必须在清除小圆圈背景前,加一个判断条件: 如果circle<0,那么circle=ol.children.length-1
                    */

    /*-- 第三个模块  自动播放轮播图,当鼠标经过轮播图,自动播放停止
                    1,添加一个定时器
                    2.自动播放,实际就类似于点击右边按钮,因为右侧按钮要点击才能触发,
                      此时我们可以在定时器里手动调用右侧按钮点击事件  btnRg.click()  
                    3.在鼠标经过事件里面去停止定时器,鼠标离开就自动播放轮播图*/

    /* 节流阀   作用:当上一个函数动画执行完毕,再执行下一个动画,让事件无法连续触发
                目的: 在左右按钮的点击事件里使用,防止轮播图连续点击过快,造成播放过快

    核心实现思路:利用回调函数,添加-个变量来控制,锁住函数和解锁函数。因为回调函数就是等着上一个动作执行完毕再执行的.
                开始设置一个变量:
                var flag= true; 
                if(flag) {
                    flag= false;
                     do something}  判断等于true,就马上先取反为false关闭水龙头,再执行功能
                什么时候打开呢:在动画里传递callback,动画执行完毕才会执行回调函数
                 animate(obj, target,function(){
                      flag=true;
                  };
                利用回调函数,打开水龙头
*/



})