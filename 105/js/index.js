/**
 * Created by Mingholy on 2017/3/8.
 */

/**
 * 仿JQuery写法 简单的选择器
 * @param selector
 * @returns {*}
 */
function $(selector) {
    if (selector[0] === "#") {
        return document.querySelector(selector);
    } else {
        return document.querySelectorAll(selector);
    }
}

/**
 *  获取元素内部数值
 * @param $li
 * @returns {Number}
 */
function getLiNum($li) {
    return parseFloat($li.textContent);
}

/**
 * 绑定元素与事件函数
 * @param selector
 * @param func
 */
function bindEvent(selector, func) {
    var element = $(selector);
    element.addEventListener("click", function() {
        //这里这样写应该是判断func的合法性并将this指向调用者
        func && func.call(element);
    });
}

/**
 * 判断类型
 * @param type
 * @returns {Function}
 */
function isType(type) {
    return function (target) {
        return toString.call(target) === "[object " + type + "]";
    }
}

/**
 * 获取输入值并检验合法性
 * @param selector
 * @returns {*}
 */
function getInputValue(selector) {
    return function(){
        var inputEl = $(selector),
            inputValue = parseFloat(inputEl.value);

        if (!inputEl) {
            alert("输入框错误！");
            return false;
        }

        if (!isType("Number") || isNaN(inputValue)) {
            alert("请输入一个数字！");
            return false;
        }

        if (inputValue > 100 || inputValue < 10) {
            alert("输入超出范围！(10~100数字)");
            return false;
        }
        inputEl.value = "";
        return inputValue;
    }
}

/**
 * 定义Queue对象
 * @type {Function}
 */
var Queue = (function () {

    function Queue(container) {
        //存放列表项
        this._list = [];
        this._$container = $(container);
        this._listMaxLength = 20;
    }

    Queue.prototype = {
        constructor: Queue,

        _createLi: function (number) {
            var $li = document.createElement("li"),
                height = (3 * number).toString() + "px",
                mtop = (300 - 3 * number).toString() + "px";
            $li.addEventListener("click", this._remove);
            $li.style.height = height;
            $li.style.marginTop = mtop;
            $li.textContent = number;
            return $li;
        },

        _push: function (number) {
            if (this._list.length === this._listMaxLength) {
                alert("队列满啦！");
                return false;
            }
            var $li = this._createLi(number);
            this._list.push($li);
            this._$container.appendChild($li);
            return $li;
        },

        _pop: function () {
            if (this._list.length === 0) {
                return false;
            }
            this._$container.lastChild.remove();
            return this._list.pop().textContent;
        },

        _unshift: function (number) {
            if (this._list.length === this._listMaxLength) {
                alert("队列满啦！");
                return false;
            }
            var $li = this._createLi(number),
                $firstLi = this._$container.firstChild;
            this._list.unshift($li);
            this._$container.insertBefore($li, $firstLi);
            return $li;
        },

        _shift: function () {
            if (this._list.length === 0) {
                return false;
            }
            this._$container.firstChild.remove();
            return this._list.shift().textContent;
        },

        _remove: function () {
            this.remove();
            return false;
        },

        _bubbleSort: function () {
            var array = this._list,
                temp,
                n = array.length;
            if (array.length === 0) {
                return false;
            }
            while(n--) {
                for(var i = 0; i < n; i++){
                    if( getLiNum(array[i]) > getLiNum(array[i + 1])) {
                        this._switch(i, i + 1);
                    }
                }
            }
            return array;
        }
    };
    return Queue;
})();

/**
 * 启动函数
 */
window.onload = function() {
    var queueObj = new Queue("#queue"),
        getNum = getInputValue("#input");

    function leftInEvent() {
        var num = getNum();
        if (num) {
            queueObj._unshift(num);
        }
    }

    function rightInEvent() {
        var num = getNum();
        if (num) {
            queueObj._push(num);
        }
    }

    function leftOutEvent() {
        var deletedNum = queueObj._shift();
        deletedNum ? alert(deletedNum) : alert("Queue is already empty!");
    }

    function rightOutEvent() {
        var deletedNum = queueObj._pop();
        deletedNum ? alert(deletedNum) : alert("Queue is already empty!");
    }

    function bubbleSortEvent() {
        if (! queueObj._bubbleSort()){
            alert("队列为空！");
        }
    }


    //绑定事件处理函数
    bindEvent("#left-in", leftInEvent);
    bindEvent("#right-in", rightInEvent);
    bindEvent("#left-out", leftOutEvent);
    bindEvent("#right-out", rightOutEvent);
    bindEvent("#bubble-sort", bubbleSortEvent);
};



function quickSort(array) {
    function sort(start, end){
        var key = array[start],
            i = start,
            j = end - 1;
        if (end > (start + 1)) {
            while (i < j) {
                for (; i < j; j--) {
                    if (array[j] < key) {
                        array[i++] = array[j];
                        break;
                    }
                }
                for (; i < j; i++) {
                    if (array[i] > key) {
                        array[j--] = array[i];
                        break;
                    }
                }
            }
            array[i] = key;
            sort(0, i);
            sort(i + 1, end);
        }
    }
    sort(0, array.length);
    return array;
}
