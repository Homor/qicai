
 function animate(obj,json,fn) {  // 给谁    json
    clearInterval(obj.timer);
    obj.timer = setInterval(function() {
        var flag = true;  // 用来判断是否停止定时器   一定写到遍历的外面
        for(var attr in json){   // attr  属性     json[attr]  值
            //开始遍历 json
            // 计算步长    用 target 位置 减去当前的位置  除以 10
            // console.log(attr);
            var current = 0;
            if(attr == "opacity")
            {
                current = Math.round(parseInt(getStyle(obj,attr)*100)) || 0;
            }
            else
            {
                current = parseInt(getStyle(obj,attr)); // 数值
            }
            // console.log(current);
            // 目标位置就是  属性值
            var step = ( json[attr] - current) / 10;  // 步长  用目标位置 - 现在的位置 / 10
            step = step > 0 ? Math.ceil(step) : Math.floor(step);
            //判断透明度
            if(attr == "opacity")  // 判断用户有没有输入 opacity
            {
                if("opacity" in obj.style)  // 判断 我们浏览器是否支持opacity
                {
                    // obj.style.opacity
                    obj.style.opacity = (current + step) /100;
                }
                else
                {  // obj.style.filter = alpha(opacity = 30)
                    obj.style.filter = "alpha(opacity = "+(current + step)* 10+")";

                }
            }
            else if(attr == "zIndex")
            {
                obj.style.zIndex = json[attr];
            }
            else
            {
                obj.style[attr] = current  + step + "px" ;
            }

            if(current != json[attr])  // 只要其中一个不满足条件 就不应该停止定时器  这句一定遍历里面
            {
                flag =  false;
            }
        }
        if(flag)  // 用于判断定时器的条件
        {
            clearInterval(obj.timer);
            //alert("ok了");
            if(fn)   // 很简单   当定时器停止了。 动画就结束了  如果有回调，就应该执行回调
            {
                fn(); // 函数名 +  （）  调用函数  执行函数
            }
        }
    },30)
}
function getStyle(obj,attr) {  //  谁的      那个属性
    if(obj.currentStyle)  // ie 等
    {
        return obj.currentStyle[attr];  // 返回传递过来的某个属性
    }
    else
    {
        return window.getComputedStyle(obj,null)[attr];  // w3c 浏览器
    }
}

function del_ff(elem){

var elem_child = elem.childNodes;

for(var i=0; i<elem_child.length;i++){

if(elem_child[i].nodeName == "#text" && !/\s/.test(elem_child.nodeValue))

{elem.removeChild(elem_child[i])}
}
 return elem;
}

window.onload = function() {
    // 获取元素kj_id
    function getId(id) {return document.getElementById(id);}
function getByclass(cla) {return document.getElementsByClassName(cla);}
    var  js_slider= getId("kj_id");  // 获取ul最大盒子
    var n=del_ff(js_slider);            
    var slider_main_blocks = getByclass("slider-main-block");  // 滚动图片的父亲
    var slider_ctrls = getByclass("slider-ctrl");  // 获得 控制span 的 父盒子
    var slider_obj={};
    var nb;
    for(var i=0;i<n.childNodes.length;i++)
    { 
        nb='a'+i+1;
        slider_obj[nb]={};

      slider(slider_main_blocks[i],slider_ctrls[i],slider_obj[nb]);
    }
}
 
 function slider(slider_main_block,slider_ctrl,obj){
 obj={'iNow':'0'}; //用来控制播放张数
var imgs = slider_main_block.children;  // 获得所有的图片组 需要滚动的部分


    // 操作元素
    // 生成小span
    for(var i=0;i<imgs.length; i++) {

        var span = document.createElement("span");// 创建 span
        span.className = "slider-ctrl-con"; // 添加类名
        span.innerHTML = imgs.length-i;  //  6 - 0     6 - 1   // 实现 倒序 的方式插入
        slider_ctrl.insertBefore(span,slider_ctrl.children[1]);  // 再 父亲 倒数第二个盒子的前面插入
    }
    // 下面的第一个小span  是默认的蓝色
    
    var spans = slider_ctrl.children;   // 得到所有的 span

    spans[1].setAttribute("class","slider-ctrl-con current");  // 两个类名
     obj.spans=spans;
     var scrollWidth =310; //js_slider.clientWidth; // 得到大盒子的宽度 也就是  后面动画走的距离  310
    //  刚开始，按道理   第一张图片 留下   其余的人走到 310 的位置上
    obj.scrollWidth=scrollWidth;
    for(var i = 1; i<imgs.length; i++) { // 从1 开始 因为第一张不需要计算
      imgs[i].style.left =  scrollWidth + "px";  // 其他人 先右移动到 310 的位置
    }
    obj.imgs=imgs;
    // 遍历三个按钮
     // spans 是 8个按钮 他们都是 span
   
    for(var k in spans){   //   k  是索引号  spans[k]    spans[0]  第一个span
        spans[k].onclick = function() {
             
            if(this.className == "slider-ctrl-prev"){ // 判断当前点击的这个按钮是不是 prev
                // alert("您点击了左侧按钮");
                //  当我们左侧点击时候， 当前的这张图片 先慢慢的走到右边  上一张 一定先快速走到左侧 （-310）的位置，然后慢慢的走到舞台中
                animate(imgs[obj.iNow],{left: scrollWidth});
                --obj.iNow < 0 ?  obj.iNow = imgs.length - 1 : obj.iNow;
                imgs[obj.iNow].style.left = -scrollWidth + "px";
                animate(imgs[obj.iNow],{left: 0});
                setSquare(obj);

            }
            else if(this.className == "slider-ctrl-next") {  // 右侧按钮开始
              autoplay(obj);
            }
            else {
                // alert("您点击了下面的span");
                // 我们首先要知道我们点击是第几张图片  --- 获得当前的索引号
                // alert(this.innerHTML);
                var that = this.innerHTML - 1;
                // console.log(typeof that);
                if(that > obj.iNow) {
                      // 做法等同于 右侧按钮
                    animate(imgs[obj.iNow],{left: -scrollWidth});  // 当前的这张慢慢的走出去 左侧
                    imgs[that].style.left = scrollWidth + "px"; // 点击的那个索引号 快速走到右侧  310
                }
                else if(that < obj.iNow) {
                    // 做法等同于 左侧按钮
                    animate(imgs[obj.iNow],{left: scrollWidth});
                    imgs[that].style.left = -scrollWidth + "px";
                }
                obj.iNow = that;  // 给当前的索引号
                animate(imgs[obj.iNow],{left: 0});
                /*比如 已经播放到 第4张    我点击了 第2张   把 2 给  obj.iNow
                下一次播放，应该播放第3张*/
               // animate(imgs[obj.iNow],{left: 0});
                setSquare(obj,spans);
            }
        }
    }
}
    
    //  一个可以控制 播放span 的 函数   当前
    function setSquare(obj) {
       //  清除所有的span current   留下 满足需要的拿一个
        for(var i=1;i<obj.spans.length-1;i++){   //  8个span   我们要 1-6  不要 7  索引号
            obj.spans[i].className = "slider-ctrl-con";
        }
        obj.spans[obj.iNow+1].className = "slider-ctrl-con current";  // 记住 + 1
    }
    //定时器开始  其实， 定时器就是  右侧按钮
    // var timer = null;
    // timer = setInterval(autoplay,2000);  // 开启定时器
    function autoplay(obj) {
        //  当我们点击时候， 当前的这张图片 先慢慢的走到左边  下一张 一定先快速走到右侧 （310）的位置，然后慢慢的走到舞台中
        // alert("您点击了右侧按钮");
        //obj.iNow == 0
        animate(obj.imgs[obj.iNow],{left: -obj.scrollWidth});
        // 当前的那个图片 慢慢的走到 -scrollWidth 位置
        // 变成1   先 ++   ++obj.iNow  先自加  后 运算
        ++obj.iNow > obj.imgs.length -1 ?  obj.iNow = 0 : obj.iNow;
        obj.imgs[obj.iNow].style.left = obj.scrollWidth + "px";  // 立马执行  快速走到右侧
        animate(obj.imgs[obj.iNow],{left: 0}); // 下一张走的 0 的位置  慢慢走过来
        setSquare(obj);  // 调用square
    }
    

