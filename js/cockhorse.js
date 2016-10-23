/**
 * Created by andy on 2015/11/23.
 */
// 多个属性运动框架  添加回调函数
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
    },10)
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
 var wrap = document.getElementById("wrap_cockhorse");  // 大盒子
    var arrow = document.getElementById("arrow_cockhorse");  // 三角
    var slider = document.getElementById("slide_cockhorse");
    var lis = slider.getElementsByTagName("li");  // 所有要操作的盒子
    wrap.onmouseover = function() {  // 鼠标经过显示和隐藏 左右两个箭头
         animate(arrow,{'opacity':100});
    }
    wrap.onmouseout = function() {
        animate(arrow,{'opacity':0});
    }
    //  存储了每个图片的信息
    var json = [
        {   //  1
            width:400,
            top:20,
            left:50,
            opacity:20,
            z:2
        },
        {  // 2
            width:600,
            top:70,
            left:0,
            opacity:80,
            z:3
        },
        {   // 3
            width:800,
            top:100,
            left:200,
            opacity:100,
            z:4
        },
        {  // 4
            width:600,
            top:70,
            left:600,
            opacity:80,
            z:3
        },
        {   //5
            width:400,
            top:20,
            left:750,
            opacity:20,
            z:2
        }
    ];
    //  两个按钮点击事件
    // 函数节流
    var jieliu = true; //  用来控制函数节奏的 变量
    var as = arrow.children;
    change();
    for(var k in as)
    {
        as[k].onclick = function() {
            if(this.className == "prev")
            {
                //  alert("左侧")  移除第一个   放到json 最后一个
                if(jieliu == true)
                {
                    change(false);
                    jieliu = false;  // 点击完毕之后，立马取反
                }

            }
            else
            {
               // alert('右侧');   把 最后一个json 删除   并且把最后一个添加到json 第一个位置
                if(jieliu == true)
                {
                    change(true);
                    jieliu = false;  // 点击完毕之后，立马取反
                }
            }
        }
    }

    function change(flag) {
        //  来判断
        if(flag)
        {
            // 把 最后一个json 删除   并且把最后一个添加到json 第一个位置
             json.unshift(json.pop());
        }
        else
        {
            //   移除第一个   放到json 最后一个
            json.push(json.shift());
        }
      // 为什么给for呢？ 以为我们的json 有5个  盒子li 有 5个
        for(var i=0;i<json.length; i++)
        {
            animate(lis[i],{
                width: json[i].width,
                top: json[i].top,
                left: json[i].left,
                opacity:json[i].opacity,
                zIndex:json[i].z
            },function(){ jieliu = true;})  // 回调函数是等动画执行完毕  才行
        }
    }
