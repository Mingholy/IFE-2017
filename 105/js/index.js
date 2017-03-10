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
 * 绑定元素与事件函数
 * @param selector
 * @param func
 */
function bindEvent(selector, func) {
    let element = $(selector);
    element.addEventListener("click", function(ev) {
        //应该是检查函数合法性并修改this指向
        func && func.call(element, ev);
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
        let inputEl = $(selector),
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

function getLiNum ($li) {
    if (! $li) return false;
    return parseFloat($li.textContent);
}

function setCompare($li) {
    return $li.className = "current";
}

function setKey($li) {
    return $li.className = "key";
}

function setNormal($li) {
    return $li.className = "";
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

        _createLi: function (number, index) {
            index = index ? this._list.length + 1 : 0;
            let $li = document.createElement("li"),
                height = (3 * number).toString() + "px",
                mtop = (300 - 3 * number).toString() + "px";
            $li.id = "item-" + index.toString();
            $li.addEventListener("click", this._remove(this));
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
            let $li = this._createLi(number, 1);
            this._list.push($li);
            this._$container.appendChild($li);
            this._reIndex();
            return $li;
        },

        _pop: function () {
            if (this._list.length === 0) {
                return false;
            }
            let text = this._list.pop().textContent;
            this._$container.lastChild.remove();
            this._reIndex();
            return text;
        },

        _unshift: function (number) {
            if (this._list.length === this._listMaxLength) {
                alert("队列满啦！");
                return false;
            }
            let $li = this._createLi(number),
                $firstLi = this._$container.firstChild;
            this._list.unshift($li);
            this._$container.insertBefore($li, $firstLi);
            this._reIndex();
            return $li;
        },

        _shift: function () {
            if (this._list.length === 0) {
                return false;
            }
            let text = this._list.shift().textContent;
            this._$container.firstChild.remove();
            this._reIndex();
            return text;
        },

        _remove: function (obj) {
            return function () {
                let queueObj = obj,
                    index = this.id.split("-")[1];
                queueObj._list[index].remove();
                queueObj._list.splice(index, 1);
                queueObj._reIndex();
            };
        },

        _removeAll: function () {
            let $nodeList = this._$container.childNodes;
            if ($nodeList.length !== 0) {
                for (let i = $nodeList.length - 1; i >= 0; i--) {
                    $nodeList[i].remove();
                }
            }
        },

        _renderAll: function() {
            this._reIndex();
            this._removeAll();
            for (let i = 0; i < this._list.length; i++) {
                this._$container.appendChild(this._list[i]);
            }
        },

        _reIndex : function() {
            this._list.forEach(($el, index) => $el.id = "item-" + index.toString());
        },

        _test : function() {
            for (let i = 20; i > 10; i--) {
                this._list.push(this._createLi(i));
                this._reIndex();
                this._renderAll();
            }
        }

    };
    return Queue;
})();

/**
 * 启动函数
 */
window.onload = function() {
    let queueObj = new Queue("#queue"),
        getNum = getInputValue("#input");

    queueObj._renderAll();

    function leftInEvent() {
        let num = getNum();
        if (num) {
            queueObj._unshift(num);
        }
    }

    function rightInEvent() {
        let num = getNum();
        if (num) {
            queueObj._push(num);
        }
    }

    function leftOutEvent() {
        let deletedNum = queueObj._shift();
        deletedNum ? alert(deletedNum) : alert("Queue is already empty!");
    }

    function rightOutEvent() {
        let deletedNum = queueObj._pop();
        deletedNum ? alert(deletedNum) : alert("Queue is already empty!");
    }

    function testEvent() {
        queueObj._test();
    }

    function bubbleSortEvent() {
        if (queueObj._list.length === 0){
            alert("队列为空！");
            return false;
        }
        let iter = bubbleSort(queueObj);
        let loop = function() {
            iter.next();
        };
        setInterval(loop, 100);
    }

    function quickSortEvent() {
        if (queueObj._list.length === 0){
            alert("队列为空！");
            return false;
        }
        let iter = quickSort(queueObj);
        let loop = function() {
            iter.next();
        };
        setInterval(loop, 500);
    }

    //绑定事件处理函数
    bindEvent("#left-in", leftInEvent);
    bindEvent("#right-in", rightInEvent);
    bindEvent("#left-out", leftOutEvent);
    bindEvent("#right-out", rightOutEvent);
    bindEvent("#bubble-sort", bubbleSortEvent);
    bindEvent("#quick-sort", quickSortEvent);
    bindEvent("#test", testEvent);
};

function bubbleSort (queue) {

    function* sort (queue) {

        let array = queue._list,
            n = array.length,
            compareTimes = 0,
            temp;
        $("#compare-times").textContent = compareTimes;

        while (n--) {
            for (var i = 0; i < n; i++) {
                setCompare(array[i]);
                setCompare(array[i + 1]);
                $("#compare-times").textContent = ++compareTimes;
                if (getLiNum(array[i]) > getLiNum(array[i + 1])) {
                    temp = array[i];
                    array[i] = array[i + 1];
                    array[i + 1] = temp;
                }
                yield queue._renderAll();
                setNormal(array[i]);
            }
            setNormal(array[i]);
        }
    }
    return sort(queue);
}

function quickSort (queue) {

    var arr = queue._list,
        compareTimes = 0;
    $("#compare-times").textContent = compareTimes;

    function* sort(start, end){
        var pivotLi = arr[start],
            pivot = getLiNum(pivotLi),
            i = start,
            j = end - 1;

        if ((end - start) <= 1) {
            return arr;
        }

        if ((end - start) > 1) {
           while (i < j) {
               for(; j > i; j--) {
                   $("#compare-times").textContent = ++compareTimes;
                   if (getLiNum(arr[j]) < pivot) {
                       arr[i++] = arr[j];
                       break;
                   }
               }
               for (; i < j; i++) {
                   $("#compare-times").textContent = ++compareTimes;
                   if (getLiNum(arr[i]) > pivot) {
                       arr[j--] = arr[i];
                       queue._renderAll();
                       break;
                   }
               }
           }
           arr[i] = pivotLi;
           queue._renderAll();
           yield;
           yield* sort(0, i);
           yield* sort(i + 1, end);
        }
    }

    return sort(0, arr.length);
}
