class Cart {
    constructor() {
        this.getCartGoods(); //获取购物车数据
        this._$('.cart-item-list .shop_list').addEventListener('click', this.clickBubbleFn.bind(this));
        this.checkAll(); //全选
        // 给tbody绑定点击事件 单选
        //this.subTotal();//统计
    };
    /****判断操作的节点****/
    clickBubbleFn(event) {
        let tar = event.target;
        // 1 判断是否为单选
        tar.classList.contains('j-checkbox') && this.oneCheckFn(tar);
        // 2 判断点击的是否为类 加号
        tar.classList.contains('increment') && this.addClickFn(tar);
        // 2 判断点击的是否为类 减号
        tar.classList.contains('decrement') && this.reduceClickFn(tar);
        // 3判断点击的是否为删除
        tar.classList.contains('delete') && this.delClickFn(tar);
    }

    /******获取购物车数据*****/
    async getCartGoods() {
        // 1 取出local数据
        let cartGoods = localStorage.getItem('cart');
        // 没有数据则停止
        if (!cartGoods) return;
        cartGoods = JSON.parse(cartGoods)
        // 2 发送ajax获取商品数据
        let goodsData = await axios.get({
            url: './js/goods.json'
        });
        //3 循环商品信息,根据id取购物车中的值,有值说明商品在购物车
        let existsCartGoods = goodsData.filter(item => {
            // 结果为数字 转化为 true  undefined 转化为false
            return cartGoods[item.id];
        });
        this.render(existsCartGoods, cartGoods)
    }
    /****渲染购物车列表******/
    render(goodsData, cg) {
        let template = '';
        // 1 循环购物车商品
        goodsData.forEach(ele => {
            template += `
      <div class="cart-item check-cart-item" goods-id="${ele.id}">
          <div class="p-checkbox">
              <input type="checkbox"  class="j-checkbox">
          </div>
          <div class="p-goods">
              <div class="p-img">
                  <img src="${ele.src}" alt="">
              </div>
              <div class="p-msg two_row">【${ele.name}</div>
              <div class="p_taocan">小米灰（12+256G）标准版+定制皮套</div>
          </div>
          <div class="p-price">${ele.price}</div>
          <div class="p-num">
              <div class="quantity-form">
                  <a href="javascript:;" class="decrement">-</a>
                  <input type="text" class="itxt" value="${cg[ele.id]}">
                  <a href="javascript:;" class="increment">+</a>
              </div>
          </div>
          <div class="p-sum">${ele.price*cg[ele.id]}</div>
          <div class="p-action"><a href="javascript:;" class="delete">删除</a><br><a href="javascript:;">移入收藏</a></div>
      </div>`
        });

        this._$('.cart-item-list .shop_list').innerHTML = template;
    }
    /*********全选实现********/
    checkAll() {
        //1 给全选按钮绑定事件
        let allObj = this.$$('.checkall');
        // 2 给全选按钮绑定事件,事件回调函数的this指向节点对象,使用bind
        allObj[0].addEventListener('click', this.allClickFn.bind(this, 1))
        allObj[1].addEventListener('click', this.allClickFn.bind(this, 0))
    }
    // 使用bind和event时,bind传递的参数在前
    allClickFn(checkAllIndex, event) {
        //获取点击的全选按钮状态
        let status = event.target.checked;
        // 设置另一个全选的状态
        this.$$('.checkall')[checkAllIndex].checked = status;
        this.oneChecked(status);
        // 统计数量和价格,传递全选的状态
        this.subTotal(status)
    }

    /*****单个商品选中****/
    oneChecked(status) {
        this.$$('.j-checkbox').forEach(one => {
            one.checked = status;
        })
    }
    /****商品单选框回调函数***/
    oneCheckFn(target) {
        this.subTotal(); // 统计数量和价格,传递全选的状态

        if (!target.checked) { // 取消
            this.$$('.checkall')[0].checked = false;
            this.$$('.checkall')[1].checked = false;
            return;
        }
        let count = 0; //判断选中的商品数量
        this.$$('.j-checkbox').forEach(v => {
            v.checked && count++;
        })
        // 选中的数量,等于购物车商品数量,则全选选中
        if (count == this.$$('.j-checkbox').length) {
            this.$$('.checkall')[0].checked = true;
            this.$$('.checkall')[1].checked = true;
        }
    }
    /******统计价格和数量******/
    // 全选和单个商品的input框,都要调用
    subTotal(statu = true) {
        // 1 总价和总数的变量
        let totalNum = 0,
            totalPrice = 0;
        // 2 获取所有的单选节点,遍历找出选中的
        statu && this.$$('.j-checkbox').forEach(ele => {
            // console.log(ele);
            if (ele.checked) {
                // console.log(ele);
                // 3 找到tr
                let trObj = ele.parentNode.parentNode;
                // 4 获取 总价和总数
                totalPrice += (trObj.querySelector('.p-sum').innerHTML - 0); //总价
                totalNum += (trObj.querySelector('.itxt').value - 0); //总数
                //console.log(totalNum, totalPrice);
            }
        })
        // 5 放入页面中
        this._$('.price-sum>em').innerHTML = totalPrice;
        this._$('.amount-sum>em').innerHTML = totalNum;
    }

    /******点击加号******/
    addClickFn(target) {
        // console.log(target);
        // 1 获取数量,上一个兄弟节点
        let num = target.previousElementSibling;
        num.value = num.value - 0 + 1;
        // 2 获取单价和小计
        let price = (target.parentNode.parentNode.previousElementSibling).innerHTML;
        let sub = target.parentNode.parentNode.nextElementSibling;
        //console.log(price);
        // 123.484   121.485
        // sub.innerHTML = (num.value * price).toFixed(2);
        sub.innerHTML = parseInt((num.value * price) * 100) / 100;
        // 3 当input是选中时,统计价格和数量
        let tr = target.parentNode.parentNode.parentNode
       
        tr.querySelector('.j-checkbox').checked && this.subTotal();
        console.log(tr);
        // 4 修改local的值
        this.modifyLocal(tr.getAttribute('goods-id'), num.value)
        console.log(tr.getAttribute('goods-id'));

    }
    /******点击减号******/
    reduceClickFn(target) {
        // console.log(target);
        // 1 获取数量,下一个兄弟节点
        let num = target.nextElementSibling;
        num.value = num.value - 1;
        if (num.value <= 1) {
            num.value=1;
        }
        // 2 获取单价和小计
        let price = (target.parentNode.parentNode.previousElementSibling).innerHTML;
        let sub = target.parentNode.parentNode.nextElementSibling;
        // 123.484   121.485
        // sub.innerHTML = (num.value * price).toFixed(2);
        sub.innerHTML = parseInt((num.value * price) * 100) / 100;

        // 3 当input是选中时,统计价格和数量
        let tr = target.parentNode.parentNode.parentNode
        tr.querySelector('.j-checkbox').checked && this.subTotal();
      
        
        // 4 修改local的值
        this.modifyLocal(tr.getAttribute('goods-id'), num.value)

    }

    /****点击删除****/
    delClickFn(target) {
        let that = this;
        let tr = target.parentNode.parentNode;
        // 确认删除框
        layer.open({
            title: '确认删除框',
            content: '确认抛弃奴家吗?',
            btn: ['取消', '确认'],
            btn2: function (index, layero) {
                //按钮【按钮二】的回调
                //return false 开启该代码可禁止点击该按钮关闭
                // 删除当前商品节点
                tr.remove();
                // 处于选中状态,则重新计算总价格和数量
                tr.querySelector('.j-checkbox').checked && that.subTotal();
            }
        });
        this.modifyLocal(tr.getAttribute('goods-id')) //修改数量,num为0则删除
    }

    /******修改数量,num为0则删除****/
    modifyLocal(id, num = 0) {
        // 1 取出local数据
        let cartGoods = localStorage.getItem('cart');
        // console.log(cartGoods);
        if (!cartGoods) return;
        // 使用json解析
        cartGoods = JSON.parse(cartGoods);
        // console.log(cartGoods, id);
        // 删除对象属性
        num == 0 && delete cartGoods[id];
        // console.log(cartGoods);
        // 修改商品的数量
        num != 0 && (cartGoods[id] = num);
        localStorage.setItem('cart', JSON.stringify(cartGoods));
    }
    //获取节点方法
    _$(ele) { //删除按钮的模态框使用了jquery里的$,这里的$要改变的不一样 _$   然后 ctrl+h 找到所有this.$( 替换成this._$(
        return document.querySelector(ele)
    }
    $$(ele) {
        return document.querySelectorAll(ele)
    }
}

new Cart;