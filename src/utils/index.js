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
