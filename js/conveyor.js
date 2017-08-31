var conveyor = new Image();
var canvas = document.getElementById('canvas'), context = canvas.getContext('2d');

var luggageItems = [];
var luggagePositions = [];
var imageUrls = [
    "images/chopped/20,000.png",
    "images/chopped/azure.png",
    "images/chopped/cloud_backup.png",
    "images/chopped/donkey.png",
    "images/chopped/external_vulnerability.png",
    "images/chopped/fortinet.png",
    "images/chopped/google.png",
    "images/chopped/magnet.png",
    "images/chopped/minecraft.png",
    "images/chopped/prodesk.png",
    "images/chopped/sombrero.png",
    "images/chopped/suitcase.png",
    "images/chopped/thinkpad.png",
    "images/chopped/trolley.png",
    "images/chopped/tts.png",
    "images/chopped/unify.png",
    "images/chopped/windows_server.png"
];

// User Variables - customize these to change the image being scrolled, its
// direction, and the speed.

conveyor.src = 'images/conveyor.png' //'https://mdn.mozillademos.org/files/4553/Capitan_Meadows,_Yosemite_National_Park.jpg';
var CanvasXSize;
var CanvasYSize;
var speed = 2; // lower is faster
var scale = 1.05;
var yOffset = 100; // vertical offset

// Main program

var dx = 0.5;
var imgW;
var imgH;
var xPos = 0;
var IMG_WIDTH = 150;
var IMG_HEIGHT = 150;
var clearX;
var clearY;
var ctx;

(function() {

    function ImagePosition (order, xPos, yPos, width, height) {
        this.order = order;
        this.xPos = xPos; 
        this.yPos = yPos;
        this.width = width;
        this.height = height;
        this.visibility = false;
    }

    function initImages() {
        var xPos = 10;
        for (i = 0; i < imageUrls.length; i++) { 
            var luggageItem = new Image();
            luggageItem.onload = function () {
                /*if (luggageItem.width > 0) {
                    luggagePositions[i].width = luggageItem.width;
                    luggagePositions[i].height = luggageItem.height;
                }
                luggagePositions.push(new ImagePosition(i, xPos, 20, luggageItem.width, luggageItem.height));*/
            }
            luggageItem.src = imageUrls[i];
            var luggagePos = new ImagePosition(i, xPos, 20, IMG_WIDTH, IMG_HEIGHT);
            luggagePositions.push(luggagePos);
            luggageItems.push(luggageItem);
            xPos += luggageItem.width -18; 
        }
    }

    $(document).ready(function() {
        //initImages();
    });

    function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

    // resize the canvas to fill browser window dynamically
    window.addEventListener('resize', resizeCanvas, false);
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight / 3;
        clearX = canvas.width;
        clearY = canvas.height;
        CanvasXSize = canvas.width;
        CanvasYSize = //(window.innerHeight) < 800 ? 300 : canvas.height;
            canvas.height;
        drawStuff(); 
    }
    resizeCanvas();

    var canv = document.getElementById('canvas');
    canv.addEventListener('mousemove',mouseCanvas, false);
    function mouseCanvas(e) {
        var mousepos = getMousePos(canvas,e);
        var founditem = false;
        for (i = 0; i < luggagePositions.length; i++) {
            var lugpos = luggagePositions[i];
            // Detect whether or not the mouse is over an image
            if (mousepos.x >= lugpos.xPos && mousepos.y >= lugpos.yPos) {
                if (mousepos.x <= lugpos.xPos + lugpos.width && mousepos.y <= lugpos.yPos + lugpos.height) {
                    dx = 0;
                    founditem = true;
                }
            }
        }
        // Found conveyor, not image
        if (mousepos.y >= yOffset && mousepos.y <= yOffset + imgH && !founditem) {
            dx = 0.2;
        } else if (!founditem) {
            dx = 0.5;
        }
    }
    canv.addEventListener('mouseout',leaveCanvas, false);
    function leaveCanvas() {
        dx = 0.5;
    }
    canv.addEventListener('mousedown',jumpX,false);
    function jumpX() {
        debugger;
        //xPos += 10;
        //dx = 0.5;
    }

    /**
     * Your drawings need to be inside this function otherwise they will be reset when 
     * you resize the browser window and the canvas goes will be cleared.
     */

    conveyor.onload = function() {
        initImages();

        imgW = conveyor.width * scale;
        imgH = conveyor.height * scale;
        
        if (imgW > CanvasXSize) { xPos = CanvasXSize - imgW; } // image larger than canvas
        if (imgW > CanvasXSize) { clearX = imgW; } // image width larger than canvas
        else { clearX = CanvasXSize; }
        if (imgH > CanvasYSize) { clearY = imgH; } // image height larger than canvas
        else { clearY = CanvasYSize; }
        
        // get canvas context
        ctx = document.getElementById('canvas').getContext('2d');
    }

    function drawStuff() {
        ctx = document.getElementById('canvas').getContext('2d');
        ctx.clearRect(0, 0, clearX, clearY); // clear the canvas

        // Check whether luggage has overlapped screen edge
        for (i = 0; i < luggagePositions.length; i++) {
            var luggagePosition = luggagePositions[i];
            if (luggagePosition.xPos > CanvasXSize + luggagePosition.width) {
                var nextPos = luggagePositions[(i+1)%luggagePositions.length];
                var nextItem = luggageItems[(i+1)%luggagePositions.length];
                //luggagePositions[i].xPos = nextPos.xPos - (IMG_WIDTH - 18);
                luggagePositions[i].xPos = nextPos.xPos - (nextItem.width - 18);
            }
        }

        // if image is <= Canvas Size
        if (imgW <= CanvasXSize) {
            // reset, start from beginning
            if (xPos > CanvasXSize) { xPos = -imgW + xPos; }
            // fill to the right
            var loopXPos = xPos;
            while (loopXPos < CanvasXSize) {
                ctx.drawImage(conveyor, loopXPos, yOffset, imgW, imgH); 
                loopXPos += imgW;
            }
            // fill to the left
            loopXPos = xPos;
            var prev_count = 2;
            while (loopXPos > 0) {
                ctx.drawImage(conveyor, loopXPos - imgW, yOffset, imgW, imgH); 
                loopXPos -= imgW;
            }
        }

        // if image is > Canvas Size
        else {
            // reset, start from beginning
            if (xPos > (CanvasXSize)) { xPos = CanvasXSize - imgW; }
            // draw aditional image
            if (xPos > (CanvasXSize-imgW)) { ctx.drawImage(conveyor, xPos - imgW + 1, yOffset, imgW, imgH); }
        }

        // draw conveyor
        ctx.drawImage(conveyor, xPos, yOffset, imgW, imgH);   

        // draw items
        for (i = 0; i < luggagePositions.length; i++) {
            var luggagePosition = luggagePositions[i];
            ctx.drawImage(luggageItems[i],luggagePosition.xPos, luggagePosition.yPos, luggageItems[i].width, luggageItems[i].height);
            luggagePositions[i].xPos += dx; 
        }
        // amount to move
        xPos += dx;
    }
})();