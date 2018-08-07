(function ($) {
    $.fn.swipe = function (type, fn, option) {
        var setting = {
            disX: 50,
            disY: 50,
            responseTime: 200,
            isPreventDefult: true,
            tag: "123"

        };
        if (this.size() <= 0) {
            return false;
        }
        this[0].listener = this[0].listener || {};
        this[0].listener[type] = this[0].listener[type] || [];
        this[0].listener[type].push(fn);
        var _this = this[0];
        var self = this;

        var config = $.extend(setting, option);
        this.on("touchstart", function (e) {
            e = e.changedTouches[0];
            var startX = e.pageX, startY = e.pageY, startTime = Date.now();
            self.on("touchmove", function (e) {
                e = e.changedTouches[0];
                var endX = e.pageX, endY = e.pageY, endTime = Date.now();
                if (type.toLowerCase() === "left" && Math.abs((endY - startY) / (endX - startX)) <= 1 && (startX - endX) > config.disX) {
                    self.off("touchmove");
                    for (var i = 0; i < _this.listener[type].length; i++) {
                        _this.listener[type][i] && _this.listener[type][i](e, _this);
                    }
                }
                else if (type.toLowerCase() === "right" && Math.abs((endY - startY) / (endX - startX)) <= 1 && (endX - startX) > config.disX) {
                    self.off("touchmove");
                    for (var i = 0; i < _this.listener[type].length; i++) {
                        _this.listener[type][i] && _this.listener[type][i](e, _this);
                    }
                }
                else {
                    if (e.target.nodeName.toLowerCase() !== config.tag) {//如果指定了不阻止默认事件的标签则可以不阻止。
                        //e.preventDefault && e.preventDefault();
                        //return false;
                    }
                }

            }).on("touchend", function (e) {
                e = e.changedTouches[0];
                var endX = e.pageX, endY = e.pageY, endTime = Date.now();
                if (endTime - startTime >= config.responseTime) {
                    return;
                }
                switch (type.toLowerCase()) {
                    case "down":
                        if ((endY - startY) > config.disY && Math.abs((endY - startY) / (endX - startX)) > 1) {
                            for (var i = 0; i < _this.listener[type].length; i++) {
                                _this.listener[type][i] && _this.listener[type][i](e, _this);
                            }
                        }
                        break;
                    case "up":
                        if ((startY - endY) > config.disY && Math.abs((endY - startY) / (endX - startX)) > 1) {
                            for (var i = 0; i < _this.listener[type].length; i++) {
                                _this.listener[type][i] && _this.listener[type][i](e, _this);
                            }
                        }
                        break;
                }
            });
        });

        return this;
    }

})(Zepto);


(function ($) {
    $.fn.tap = function (fn, opt) {

        var _default = {
            resposetime: 200
        };
        var config = $.extend(_default, opt);
        var startTime = 0;
        var startX = 0;
        var startY = 0;
        var device = "ontouchstart" in document;
        if (device) {
            var id = this.attr("id") || "";

            this[0].listener = this[0].listener || {};
            this[0].listener["tap"] = this[0].listener["tap"] || [];
            this[0].listener["type"] = this[0].listener["type"] || [];
            this[0].listener["tap"].push(fn);
            this[0].listener["type"].push(id)
            var _this = this[0];

            if (arguments.length === 0) {
                for (var i = 0; i < this[0].listener["type"].length; i++) {
                    if (this.attr("id") === this[0].listener["type"][i]) {
                        _this.listener["tap"][i] && _this.listener["tap"][i]();
                    }
                }
            }
            else {
                this.on("touchstart", function (e) {
                    e = e.changedTouches[0];
                    startX = e.pageX;
                    startY = e.pageY;
                    startTime = Date.now();
                }).on("touchend", function (e) {
                    var endTime = Date.now();
                    e = e.changedTouches[0];
                    var endX = e.pageX;
                    var endY = e.pageY;
                    if (endTime - startTime <= config.resposetime && Math.abs(endY - startY) < 6 && Math.abs(endX - startX) < 6 && fn) {
                        for (var i = 0; i < this.listener["tap"].length; i++) {
                            this.listener["tap"][i] && this.listener["tap"][i](e, this);
                        }

                    }
                });
            }

        } else {
            this.on("click", function (e) {
                if (fn) {
                    fn(e, this);
                }
            });
        }

        return this;
    };
})(Zepto);
(function () {

    var zmitiUtil = {
        init:function () {
            this.setSize();
            this.setLoyout()
        },
        setLeft: function (e, _this, list, len){
            _this.iNow = _this.iNow === undefined ? 0 : _this.iNow;
            _this.iNow++;
            _this.iNow %= len;
            list.css({transform:"translate(-"+_this.iNow*8.4+"rem,0)"})
        },
        setRight: function (e, _this, list, len){
              _this.iNow = _this.iNow === undefined ? 0 : _this.iNow;
                     _this.iNow = _this.iNow === undefined ? 0 : _this.iNow;
                    _this.iNow--;
                    if(_this.iNow < 0){
                        _this.iNow =  len -1;
                    }
                    _this.iNow %= len;
                    console.log(_this.iNow)
                    list.css({ transform: "translate(-" + _this.iNow * 8.4 + "rem,0)" })
        },
        setSize:function (params) {
            var index = 0;
            var s = this;
            $('.zmiti-meetting-content').each(function(i,n){
                var list = $(this).find('.zmiti-meetting-list');
                var len = $(this).find('li').size()
                list.width(len * 8.4 + 'rem');
              
                $(this).find('.zmiti-prev').tap(function(e,_this){
                    s.setRight(e, _this, list, len)
                })

                $(this).find('.zmiti-next').tap(function(e,_this){
                    s.setLeft(e, _this, list, len)
                })

                $(this).swipe('left',function(e,_this){
                    s.setLeft(e, _this, list, len)
                }).swipe('right',function(e,_this){
                    s.setRight(e, _this, list, len)
                });
            })
        },
        setLoyoutSize:function(){
            var canvas = $('.zmiti-layout')[0];
            canvas.width = window.innerWidth;
            canvas.height= 0;
            var img = new Image();
            img.onload = function(){
                canvas.height = $('.zmiti-splendid-img').height()
            };

            img.src =$('.zmiti-splendid-img').attr('src');

            return canvas;

        },
        setLoyout:function(){

            var canvas = this.setLoyoutSize();
            var width = canvas.width,
                height =$('.zmiti-splendid-img').height();



            var stage = new createjs.Stage(canvas);

            var shape = new createjs.Shape();
            shape.graphics.setStrokeStyle(10).moveTo(0,0);
            shape.graphics.lineTo(width/2+5,0);
            shape.graphics.lineTo(width/3.1,height/2.6);
            shape.graphics.lineTo(0,height/3.7)
            stage.addChild(shape);
createjs.Touch.enable(stage,true,false); 


            shape.on('click',function(){
                alert(1)
            })

            setInterval(function(){
                stage.update();
            },40)



        }
       
    }
    zmitiUtil.init();
    
})()