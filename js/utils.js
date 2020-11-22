//创建函数
function createEle(element,classArr,styleObj){
    var dom = document.createElement(element);
   
    for(var i = 0;i < classArr.length; i ++){
        dom.classList.add(classArr[i]);
    }

    for(var key in styleObj){
        //[key]相当于.key，但是key是一个变量，而不是一个具体的属性值，应该用方括号
        dom.style[key] = styleObj[key];
    }
    return dom;
}

//存数据
function setLocal(key,value){
    //如果value的值是一个数组或对象
    if(typeof value === 'object' && value !== null){
        //让value以键值对的形式存在
        value = JSON.stringify(value);

    }
    localStorage.setItem(key,value);
}
//取数据
function getLocal(key){

    var value = localStorage.getItem(key);
    if(value === null){
        return value;
    };
    //如果value的值是一个数组或对象
    if(value[0] === '[' || value[0] === '{'){
        //返回标准的json格式的value值
        return JSON.parse(value);
    }
    return value;
}

function formatNum(num){
    if(num < 10){
        return '0' + num;
    }
    return num;
}