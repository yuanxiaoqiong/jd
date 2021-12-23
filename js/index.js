window.addEventListener('load', function () {
  //--获取元素
  let btnLf = document.querySelector('.miaosha_lunbo .btn_l') //左按钮
  let btnRg = document.querySelector('.miaosha_lunbo .btn_r') //右按钮
  let swiper = document.querySelector('.miaosha_lunbo');//拿到轮播图
  let swiperWidth = swiper.offsetWidth; //放到全局,因为多次点击事件的动画里会使用

  let ul = swiper.querySelector('.miaosha_lunbo .miaosha_content');
  /*-- 第二个模块  点击左右按钮移动ul */
  //2.克隆第一个li,追加到ul最后面
  let last = ul.children[0].cloneNode(true); 
  ul.appendChild(last)
  //1. 点击右边按钮,图片向左滚动一张
  let num = 0; //记录点击按钮ul的移动距离,相当于图片下标
  let flag = true; //节流阀  当点击一次按钮后,就要先判断一下是true,才执行点击事件,不过是true之后就要马上关闭为false
  btnRg.addEventListener('click', function () {
      if (flag) {
          flag = false; //是true就马上关闭,然后再执行事件功能
           if (num == ul.children.length - 1) { //如果ul走到了最后一张克隆的图片时,就让ul快速复原到0的位置,同时变量复原
               ul.style.left = 0;
               num = 0
           }
           num++;
          animate(ul, -num * swiperWidth, function () {
              flag = true;
          });
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
  /*-- 第三个模块  自动轮播,当鼠标经过轮播图,自动播放停止*/
  let timer = null;

  function auto() {
      timer = setInterval(function () {
          btnRg.click(); //定时器手动调用右侧按钮点击事件 ,打开页面定时器就是开启的.使用的onclick调用时就是onclick()
      }, 4000) //使用的监听 click,调用时就是 click()
  }
  auto(); //记得调用
  swiper.addEventListener('mouseenter', function () { //鼠标经过轮播图,显示左右按钮,清除自动播放
      clearInterval(timer); //清除定时器
      // timer=null;   //因为timer变量已经不使用了,所以最后接着就清除这个变量
  })
  swiper.addEventListener('mouseleave', function () { //鼠标离开轮播图,显示左右按钮,开启自动播放
      auto()
  })

})



class mor {
  constructor() {
    // 获取节点
    this.col = document.querySelectorAll('.miaosha_content .col')[0];
    this.colt = document.querySelector('.for_you_tab .for_you_goodslist');
    console.log(this.col);
    // 调用方法
    this.getGoods();
    this.getGoodss();
    //获取倒计时
    this.hours = document.querySelector('.hour');
    this.minutes = document.querySelector('.minute');
    this.seconds = document.querySelector('.seconds');
    this.input = new Date('2022-12-25 10:16:18') ;//把要输入的时间变量拿到定时器外面来,方便修改时间
    this.countdown(); //在调用定时器之前先调用一次总剩余时间,防止定时器执行前1秒的空白
    this.setTime(); //用定时器控制每隔1秒就调用一次总剩余时间
   
  }
  //轮播下的商品
  async getGoods() {
    // 发送请求,回去json数据
    let data = await axios.get({
      url: './js/goods.json',
      data: ''
    });
    // 遍历追加到页面中
    let html = '';
    data.forEach(goods => {
      html += `<div class="row" onclick="mor.more(${goods.id})">
        <img src="${goods.src}" alt="">
        <h5>${goods.name}</h5>
        <div class="price">
            <div id="triangle-topleft"></div>
            <div class="new_price">￥${goods.price}</div>
            <div class="old_price">￥59.00</div>
        </div>
    </div>`;
    });
    console.log(this.col);
    this.col.innerHTML = html;
  }
  

  
  //秒杀倒计时
  countdown() {
    var now = new Date()
    var times = (this.input - now) / 1000
    var h =this.completed(parseInt(times / 60 / 60 % 24)) //先获得剩余小时
    this.hours.innerHTML = h //再赋值给span
    var m = this.completed(parseInt(times / 60 % 60))
    this.minutes.innerHTML = m
    var s =this.completed(parseInt(times % 60))
    this.seconds.innerHTML = s
  }
  completed(num) {
    return num < 10 ? '0' + num : num;
  }
  setTime(){  //通过类的方法,调用window的定时器
    setInterval(this.countdown.bind(this),1000)
  }

  //可点击加入购物车的商品--为你推荐 商品列表
  async getGoodss() {
    // 发送请求,回去json数据
    let data = await axios.get({
      url: './js/goods.json',
      data: ''
    });
    // 遍历追加到页面中
    let html = '';
    data.forEach(goods => {
      html += `<li>
        <img src="${goods.src}" alt=" ">
        <div class="goods_msg ">
            <h4 class="googs_title two_row ">
                <span class="ziying ">自营</span> ${goods.name}
            </h4>
            <div class="price ">
                <i>￥</i><span>${goods.price}</span>
            </div>
            <div class="lookfor_sim ">
                <div class="xiangsi" onclick="mor.addCart(${goods.id},1)">加入购物车</div>
            </div>
        </div>
    </li>`;
    });
    this.colt.innerHTML = html;
  }
  //点击加入购物车
  static addCart(id, num) {
    // 1 取出local中的值
    let cartGoods = localStorage.getItem('cart');
    // 2 判断是否有值
    if (cartGoods) { // 3-1 有值
      // 3-2 解析数据
      cartGoods = JSON.parse(cartGoods);
      // 3-3 判断商品是否购买,当前添加的id,是否已经存在于购物车中
      for (let attr in cartGoods) { // attr 表示商品id
        // 3-4 存在则修改数量
        attr == id && (num = num + cartGoods[attr]);
      }
      // 3-5 存在则修改数量,不存在则添加
      cartGoods[id] = num;
      localStorage.setItem('cart', JSON.stringify(cartGoods))
    } else { // 4-1 没有数据
      // 4-2 以id为key,数量为val
      cartGoods = {
        [id]: num
      };
      localStorage.setItem('cart', JSON.stringify(cartGoods))
    }

  }


};
new mor;