/**
 * A mobile HTML5 game JavaScript template code
 *
 * @author: Bambridge E. Peterson
 *
 */


(function (window) {

    var WIDTH = 900,
    HEIGHT = 600,

    // true == portrait
    // false == landscapte
    orientationFlag = false,

    RATIO = null,
    GAME = {},
    currentWidth = null,
    currentHeight = null,
    canvas = null,
    context = null,
    scale = 1,
    offset = {top: 0, left: 0},
    entities = [],

    playFlag = false,

    // functions
    init,
    resize,
    update,
    render,
    start,
    stop,
    splashScreen,
    loop,
    gameLoops = 0;


    init = function () {
        if (orientationFlag) {
            var tmp;
                tmp = WIDTH;
                WIDTH = HEIGHT;
                HEIGHT = tmp;

            RATIO = WIDTH / HEIGHT;
            alert(tmp);
        } else {
            RATIO = HEIGHT / WIDTH;
        }

        currentWidth = WIDTH;
        currentHeight = HEIGHT;

        canvas = document.getElementsByTagName('canvas')[0];

        canvas.width = WIDTH;
        canvas.height = HEIGHT;

        context = canvas.getContext('2d');

        resize();
        
        window.addEventListener('click', function(e) {
                e.preventDefault();
                GAME.input.set(e);

                if ( !playFlag ) {
                    start();    
                }
            }, false);

        // listen for touches
        window.addEventListener('touchstart', function(e) {
            e.preventDefault();
            // the event object has an array
            // named touches; we just want
            // the first touch

            GAME.input.set(e.touches[0]);

            if ( !playFlag ) {
                start();    
            }

        }, false);

        window.addEventListener('touchmove', function(e) {
            // we're not interested in this,
            // but prevent default behaviour
            // so the screen doesn't scroll
            // or zoom
            e.preventDefault();

        }, false);

        window.addEventListener('touchend', function(e) {
            // as above
            e.preventDefault();
        }, false);

        // GAME.draw.text('APP', currentWidth / 2, currentHeight / 2, 30, 'black');
        loop();
    };

    update = function () {
        var i, l = entities.length;

        if (GAME.input.tapped) {
            entities.push(new Touch(GAME.input.x, GAME.input.y));
            GAME.input.tapped = false;
        }
         
        for (i = 0; i < l; i += 1) {
            if (entities[i] === undefined) {
                console.log(entities[i]);
            }
            entities[i].update();

            if (!entities[i].active) {
                entities.splice(i, 1);
            }

        }
    };

    render = function () {
        var i, l = entities.length;

        GAME.draw.clear();

        for (i = 0; i < l; i += 1) {
            entities[i].render();
        }
    };

    loop = function () {
        requestAnimationFrame(loop);
        update();
        render();
    };

    resize = function () {
        if ( orientationFlag ) {
            if (window.innerHeight < HEIGHT) {
                currentHeight = window.innerHeight;
            } else {
                currentHeight = HEIGHT;
            }
            currentWidth = currentHeight * RATIO;
            scale = currentWidth / WIDTH;
        } else {
            if (window.innerWidth < WIDTH) {
                currentWidth = window.innerWidth;
            } else {
                currentWidth = WIDTH;
            }
            currentHeight = currentWidth * RATIO;
            scale = currentHeight / HEIGHT;
        }

        canvas.style.width = currentWidth + 'px';
        canvas.style.height = currentHeight + 'px';


        offset.top = canvas.offsetTop;
        offset.left = canvas.offsetLeft;

        // alert(offset.top + " " + offset.left);
        window.setTimeout(function () {
            window.scrollTo(0, 1);
        }, 1);

    };

    start = function () {


    };

    stop = function () {


    };


    function Touch(x,y) {
        this.type = "touch";
        this.x = x;
        this.y = y;
        this.r = 5;
        this.opacity = 1;
        this.fade = 0.05;
        this.active = true;

        this.update = function () {
            this.opacity -= this.fade;
            this.active = (this.opacity < 0) ? false : true;
        };

        this.render = function () {
            GAME.draw.circle(this.x, this.y, this.r, 'rgba(255, 0, 0,' + this.opacity + ')');
        }
    }

    GAME.input = {
        x: 0,

        y: 0,

        tapped: false,

        set: function (data) {

            var offsetTop = canvas.offsetTop,
            offsetLeft = canvas.offsetLeft,
            scale;
           
            if (orientationFlag) {
                scale = currentWidth / WIDTH;
            } else {
                scale = currentHeight / HEIGHT;
            }


            this.x = (data.pageX - offset.left) / scale;
            this.y = (data.pageY - offset.top) / scale;

            this.tapped = true;

            //GAME.draw.circle(this.x, this.y, 10, 'red');
        }
    };

    GAME.draw = {
            clear:  function () {
                context.clearRect(0, 0, WIDTH, HEIGHT);
            },

            rect:   function (x, y, w, h, col) {

                var prev = context.fillStyle;
                context.fillStyle = col;
                context.fillRect(x, y, w, h);
                context.fillStyle = prev;
            },

            circle: function (x, y, r, col) {
                var prev;
                prev = context.fillStyle;
                context.fillStyle = col;
                context.beginPath();
                context.arc(x + 5, y + 5, r, 0, Math.PI * 2, true);
                context.closePath();
                context.fill();
                context.fillStyle = prev;
            },

            text: function (string, x, y, size, col) {
                var prev;
                prev = context.fillStyle;

                context.font = 'bold ' + size + 'px Monospace';
                context.fillStyle = col;
                context.fillText(string, x, y);
                context.fillStyle = prev;
            },
        
             triangle: function (height, x, y, color) {
                var cxt = context,
                    tan = Math.tan(Math.PI / 6),
                    r = tan * height;
                var prev;
                prev = context.fillStyle;
                
                cxt.beginPath();
                cxt.moveTo(x, y);
                cxt.lineTo(x - height, y - r);
                cxt.lineTo(x - height, y + r);
                cxt.lineTo(x,y);
                cxt.fillStyle= color;
                cxt.fill();
                cxt.stroke();
                
                context.fillStyle = prev;
            },

            triangleToo: function (height, x, y, angle, color, width) {
        
                var cxt = context,
                    PI = Math.PI,
                    r = height / Math.cos(PI / 6),
                    a2 = angle + (PI / 6),
                    a1 = angle - (PI / 6),
                    x1 = x + Math.cos(a1)*r,
                    y1 = y + Math.sin(a1)*r,
                    x2 = x + Math.cos(a2)*r,
                    y2 = y + Math.sin(a2)*r,
                    prevColor;
                    
                
                prevColor = cxt.fillStyle;
                cxt.lineWidth = 0;
                cxt.strokeStyle = color;
                cxt.beginPath();
                cxt.moveTo(x, y);
                
                cxt.lineTo(x1, y1);
                cxt.lineTo(x2, y2);
                cxt.lineTo(x,y);
                
                cxt.fillStyle = color;
                cxt.fill();
                cxt.stroke();
                cxt.fillStyle = prevColor;
            },            
           
            scale: 0.5,

            sun: function () {
                var scale = 0.25;
                var circlex = 270,
                     circley = 20,
                     circler = scale*70,
                     
                     tripast = scale*30*scale,
                     triheight = scale*70*scale,
                     outerr = tripast + triheight,
                     color = 'gold';
                
                  // circle
                 this.circle(circlex, circley, circler, color);

                 // t
                 this.triangleToo(triheight, circlex, circley - outerr, Math.PI /2, color);

                 // left
                 this.triangleToo(triheight, circlex - outerr, circley, 0, color);

                 // upper left
                 this.triangleToo(triheight, circlex + outerr* Math.cos(3*Math.PI / 4), circley - outerr * Math.sin(3*Math.PI /4), Math.PI / 4, color);
 
                    // upper right
                 this.triangleToo(triheight, circlex + outerr * Math.cos(Math.PI / 4), circley - outerr*Math.sin(Math.PI /4), 3*Math.PI / 4, color);

                  // right 
                 this.triangleToo(triheight, circlex + outerr, circley, Math.PI, color);
                
                 // lower right
                 this.triangleToo(triheight, circlex + outerr * Math.cos(-Math.PI / 4), circley - outerr * Math.sin(-Math.PI /4), (5)*Math.PI / 4, color);

                 // bottom
                 this.triangleToo(triheight, circlex, circley + outerr, Math.PI *3 / 2, color);

                 // lower left
                 this.triangleToo(triheight, circlex + outerr * Math.cos(5*Math.PI / 4), circley - outerr*Math.sin(5*Math.PI /4), 7*Math.PI / 4, color);
                
              
            },

            curve: function (sx, sy, cx, cy, x, y) {
                var cxt = context;
                var prev = context.fillStyle; 
                cxt.beginPath();
                cxt.moveTo(sx, sy);
                cxt.quadraticCurveTo(cx, cy, x, y);
                cxt.fillStyle = "black";
                cxt.stroke();           
                context.fillStyle = prev;
            },
            
            ellipse: function (sx, sy, cx, cy1, cy2, ex, ey, color) {
                var cxt = context;
                
                var prev = context.fillStyle; 
                cxt.beginPath();
                cxt.moveTo(sx, sy);
               
                cxt.quadraticCurveTo(cx, cy1, ex, ey);// 120,150,170,70, -10);
             
                cxt.moveTo(sx, sy);
                cxt.quadraticCurveTo(cx, cy2, ex, ey);   
              
                
                cxt.fillStyle = color;
                cxt.fill();
                cxt.stroke();            
                context.fillStyle = prev;
            },
            
        };  





    window.addEventListener('load', init, false);

    window.addEventListener('resize', resize, false);

}(window));


/**
 *  
 requestAnimationFrame code

 http://paulirish.com/2011/requestanimationframe-for-smart-animating/

 http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

 requestAnimationFrame polyfill by Erik Möller

 fixes from Paul Irish and Tino Zijdel

 *
 */
(function (window) {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];

    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] ||
            window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }
 
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }

}(window));
