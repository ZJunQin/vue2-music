export const setStorage = ({key, data}) => {
    localStorage.setItem(key, JSON.stringify(data))
}

export const getStorage = ({key, success}) => {
    const data = localStorage.getItem(key)
    if(typeof data == 'string'){
        success(JSON.parse(data))
    }else{
        success([])
    }
}

export const removeStorage = ({key, success}) => {
    localStorage.removeItem(key)
    success()
}

export const debounce = (fn, delay) => {
    delay = delay || 200;
    var timer;
    return function () {
        var th = this;
        var args = arguments;
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(function () {
            timer = null;
            fn.apply(th, args);
        }, delay);
    };
}

export const scrollAnimation = (currentY, targetY) => {
    // 获取当前位置方法    600            0
    // const currentY = document.documentElement.scrollTop || document.body.scrollTop

    // 计算需要移动的距离
    let needScrollTop = targetY - currentY
    let _currentY = currentY
    setTimeout(() => {
        // 一次调用滑动帧数，每次调用会不一样
        const dist = Math.ceil(needScrollTop / 10)
        _currentY += dist
        window.scrollTo(_currentY, currentY)
        // 如果移动幅度小于十个像素，直接移动，否则递归调用，实现动画效果
        if (needScrollTop > 10 || needScrollTop < -10) {
            scrollAnimation(_currentY, targetY)
        } else {
            window.scrollTo(_currentY, targetY)
        }
    }, 1)
}

export const numberFormat = (num) => {
    let k = 10000,
        unit = ['', '万', '亿'],
        value = '',
        i
    if(num < k){
        return num
    }else{
        i = Math.floor(Math.log(num) / Math.log(k)); 
        value = ((num / Math.pow(k, i))).toFixed(2) + unit[i]
        return value
    }
}