/*
    Code by: metwas seup
    
    Some spiral galaxy thing :D
*/

var width = window.innerWidth;
var height = window.innerHeight;
var backColor = 'rgb(0,0,0)';

// galaxy core configuration
var galaxyColor = 'rgb(250,210,248)';
var coreSize = 30;

// astroid configuration
var astroidColor = 'rgb(110,100,208)';
var defaultAstroidCount = 500;
var astroidSize = 1.1;
var astroidCount = prompt("Astroid Count: default is 500");
var astroidMaxSpeed = 0.8;
var astroidMinSpeed = 0.1;

// canvas and context for drawing
var canvas, ctx = {};
var gravityForce = 130;
var galaxy = {};

window.onload = function () {
    canvas = document.querySelector("canvas");
    ctx = canvas.getContext('2d');

    if (canvas !== "undefined") {
        canvas.setAttribute("width", width);
        canvas.setAttribute("height", height);
    }

    galaxy = new Core(coreSize, astroidCount,galaxyColor);
}


window.setInterval(function () {
    ctx.fillStyle = backColor;
    ctx.save();
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    galaxy.draw();
    galaxy.update();

}, 1000 / 60);



class Core {
    constructor(radius, astroidCount, color) {
        this.radius = radius;
        this.vx = 0;
        this.vy = 0;
        this.posX = canvas.width/2;
        this.posY = canvas.height/2;
        this.color = color;

        this.clusters = [];
        this.clusterSize = astroidCount || defaultAstroidCount;        
        this.beginClusters(radius);
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.posX, this.posY, coreSize, 0, 2 * Math.PI);
        ctx.shadowBlur=150;
        ctx.shadowColor='white';
        ctx.fill();
        for (var i = 0; i < this.clusters.length; i++) {
            this.clusters[i].attract(this);
            this.clusters[i].update();
            this.clusters[i].draw();
        }
    }

    update() {
        //this.evaluate();
    }

    evaluate() {
        if (this.core.posX >= canvas.width - this.radius || this.posX <= this.radius) {
            this.vx *= -1;
        }
        if (this.core.posY >= canvas.height - this.radius || this.posY <= this.radius) {
            this.vy *= -1;
        }
    }

    beginClusters(radius) {
        for (var i = 0; i < this.clusterSize; i++) {
            this.clusters.push(new Astroid(astroidSize, astroidColor, this));
        }
    }
}


class Astroid {
    constructor(radius, color, core) {
        this.radius = radius;
        this.padding = random(core.radius+20,height/2);
        this.speed = random(astroidMinSpeed,astroidMaxSpeed);
        this.color = color;
        this.posX = core.posX - this.padding;
        this.posY = core.posY + this.padding;
        this.angle = 180;
        
        this.posX += random(-20,50);
        this.posY += random(20,50);
   }

    update() {
        this.evaluate();
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.posX, this.posY, this.radius * this.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
    }

    attract(core) {
        var _dist = dist(this.posX,this.posY, core.posX,core.posY);
        var force = (gravityForce*this.padding)/Math.square(_dist);
        var rad = this.angle * (Math.PI / 180) + force * (this.padding*this.speed);
        if(this.angle > -180){
             this.posX += Math.cos(rad) * force;
             this.posY +=  Math.sin(rad) * force;
        }else{
            this.angle = 180;
        }
        this.angle--;
        
    }

    evaluate() {
        if (this.vx > this.maxSpeed) {
            this.vx = this.maxSpeed / 2;
        }
        if (this.vy > this.maxSpeed) {
            this.vy = this.maxSpeed / 2;
        }
        if (this.posX > width - this.radius || this.posX < this.radius) {
            this.vx *= -1;
        }
        if (this.posY > height - this.radius || this.posY < this.radius) {
            this.vy *= -1;
        }
    }
}


Math.square = function (value) {
    return Math.pow(value, 2);
}

Math.vectorSquare = function (vector) {
    if (vector.posX !== "undefined" && vector.posY !== "undefined") {
        vector.posX = Math.square(vector.posX);
        vector.posY = Math.square(vector.posY);
        return vector;
    }
    console.log("Vector supplied is not valid");
}


function dist(x0, y0, x1, y1) {
    return Math.sqrt(Math.square((x1 - x0)) + Math.square(y1 - y0));
}

function random(min, max) {
    var rand = Math.random();
    if (min == "undefined") {
        return rand;
    }
    else if (max == "undefined") {
        return Math.floor(rand * min);
    }
    else {
        // get the highest value between min and max
        if (min > max) {
            var temp = min;
            min = max;
            max = temp;
        }

        return rand * (max - min) + min;
    }
}

