(function () {
    function Point(option) {
        this.x = option.x || Math.random() * option.context.canvas.width;
        this.y = option.y || Math.random() * option.context.canvas.height;

        this.defaultX = this.x;
        this.defaultY = this.y;
        this.img = option.img;

        this.angle = 0;

        this.maxHeight = (Math.random() * 100 + 100);

        this.iNow = 0;

        this.speed = Math.random() * 2;
        this.context = option.context;

        this.size = Math.random() * 5;

        this.speedX = Math.random();

        this.rotate = Math.random() * 360 / 180 * Math.PI;
        this.render();
    }

    Point.prototype.render = function () {

        this.context.save();
        this.context.rotate = this.rotate;
        this.context.drawImage(this.img, this.x, this.y, this.size, this.size);
        this.context.restore();
    }

    Point.prototype.update = function (params) {
        this.render();
    }


    var zmitiUtil = {
        init: function () {
            document.getElementsByTagName('html')[0].style.fontSize = window.innerWidth / 10 + 'px';
            this.setCanvasSize();
            this.textEffect();
        },
        setCanvasSize: function () {
            var width = window.innerWidth;
            var img = new Image();
            var canvas = $('#zmiti-header-canvas')[0];
            this.canvas = canvas;
            var s = this;
            img.onload = function (params) {

                canvas.width = width;
                canvas.height = $('#zmiti-header-title').height();
                s.initPoints();

            }
            img.src = $('#zmiti-header-title').attr('src');
        },
        textEffect:function(){
            var texts = $('#zmiti-meetting-name');
            var html = '';
            texts.html().split('').forEach(function(item,i){
                html+='<span>'+item+'</span>'
            });
            texts.html(html)
        },
        initPoints: function () {

            var canvas = this.canvas;
            var context = canvas.getContext('2d');

            var width = canvas.width,
                height = canvas.height;
            var img = new Image();
            var points = [];
            this.points = points;
            var s = this;
            img.onload = function (params) {
                for (var i = 0; i < 100; i++) {
                    var p = new Point({
                        img,
                        context,
                    })
                    this.points.push(p);
                }
            }.bind(this);
            img.src = $("#zmiti-point").attr('src');

            var s = this;
            var animationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame,
                m = Math;

            function render() {
                if (width <= 0) {
                    width = canvas.width,
                        height = canvas.height;
                }
                context.clearRect(0, 0, width, height);

                s.points.forEach(function (point, i) {
                    point.angle += point.speed;
                    point.angle %= 360;
                    point.x += m.sin(point.angle / 180 * m.PI) * point.speedX;

                    point.y -= 1;
                    if (point.defaultY - point.y > point.maxHeight) {
                        point.y = point.defaultY
                    }
                    point.update();
                });
                animationFrame(render);
            }

            render()


        }
    }
    zmitiUtil.init();

})()