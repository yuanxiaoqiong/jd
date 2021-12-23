/* let more=new mor;
console.log(more.gid); */
let smallBox= document.querySelector('.mid_photo');
let mask=document.querySelector('.mask')
let bigBox=document.querySelector('.big_photo')
let bigImg=document.querySelector('.big_photo>img')
console.log(bigImg);

/* ****放大镜**** */
  //当鼠标划入到smallBox里面时，让隐藏的元素显示
  smallBox.onmouseover = function(){
    mask.style.display = 'block'
    bigBox.style.display = 'block'
}
//当鼠标划到smallBox外面时，让显示的元素隐藏
smallBox.onmouseout = function(){
    mask.style.display = 'none'
    bigBox.style.display = 'none'
}
//当鼠标移入到smallBox里面时让鼠标进行跟随
smallBox.onmousemove = function(e){
    e = e || window.event
    //获取鼠标的坐标
    let x = e.clientX - smallBox.offsetParent.offsetLeft - mask.offsetWidth/2 
    let y = e.clientY - smallBox.offsetParent.offsetTop - mask.offsetHeight/2
    //边界值判断
    if(x<=0){
        x = 0
    }else if(x>=smallBox.offsetWidth - mask.offsetWidth){
        x = smallBox.offsetWidth - mask.offsetWidth
    }
    if(y<=0) {
        y = 0
    }else if (y>=smallBox.offsetHeight - mask.offsetHeight) {
        y = smallBox.offsetHeight - mask.offsetHeight
    }
    //进行赋值
    mask.style.left = x + 'px'
    mask.style.top = y + 'px'
    //计算比例
    let w = x / (smallBox.offsetWidth - mask.offsetWidth)
    let h = y / (smallBox.offsetHeight - mask.offsetHeight)
    //给大图进行赋值操作
    bigImg.style.left = -w * (bigImg.offsetWidth - bigBox.offsetWidth) + 'px'
    bigImg.style.top = -h * (bigImg.offsetHeight - bigBox.offsetHeight) + 'px'
}

/* ***商品详情*** */
class Goods {
    constructor() {
      // 获取节点
      this.cont = document.querySelector('.row');
      // 调用方法
      this.getGoods();
    }
    async getGoods () {
      // 发送请求,回去json数据
      let data = await axios.get({ url: './js/goods.json', data: '' });
      // 遍历追加到页面中
      let html = '';
      data.forEach(goods => {
        html += `<div class="row">
        <img src="${goods.src}" alt="">
        <h5>${goods.name}</h5>
        <div class="price">
            <div id="triangle-topleft"></div>
            <div class="new_price">￥${goods.price}</div>
            <div class="old_price">￥59.00</div>
        </div>
    </div>`;
      });
      this.cont.innerHTML = html;
      this.cont.addEventListener('click', Goods.addCart(goods.id,1))
    };
    // 点击+号加入购物车
    static addCart (id, num) {
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
        cartGoods[id] = num;
        localStorage.setItem('cart', JSON.stringify(cartGoods))
      } else { // 4-1 没有数据
        cartGoods = { [id]: num };
        localStorage.setItem('cart', JSON.stringify(cartGoods))
      }
    }
  }
  new Goods;



/* ***切换图片*** */

/* let contains = document.querySelectorAll('.mid_photo .mid_img');
let images = document.querySelector('.preview_list .list_item .list_item_menu').children;
console.log(images);


for (let i = 0; i <images.length; i++) {

    images[i].onclick = function (ele) {
        //contain.innerHTML=this.images[i]

        console.log(123);

        for (let j = 0; j < images.length; i++) {
            images[j].display = 'none';
        }
        this.display = 'block'
    }
}
 */

