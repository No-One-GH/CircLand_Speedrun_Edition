/** My brother wanted me to do this so I did
 * 
 * Changes from the original:
 * Level timer
 * Fireballs are now more fair
 * The dialogue on level 5 is pretty much entirely skipped
 * All boss dialogue is sped up automatically
 * 
 * Yeah, that's literally it :P
 * 
 * I might add IL timers and replays
 * 
 * 
 * Categories and sub-categories:
 * Glitchless/Glitched
 * No Save&Load/Save&Load/Segmented
 * Normal/Easy
 * Normal ending/True ending
 * 
 * With the exclusion of glitchless, the first sub-category is implied (For instance Glitchless Easy is just Glitchless No Save&Load Easy Normal ending but shorter)
 * 
 * 
 * My times:
 * 9:32.233 Glitchless Easy
 * 14:38.949 Glitchless
 * 22:39.566 Glitchless True Ending
 * 7:03.233 Glitched Segmented
 * 
**/

// Place save code here. Press shift+space+S at any time to save.
var saveCode;


var replay = []; // WIP

var level = 1; // Change this for IL runs


















// Enjoy 2000+ lines of barely commented code :)

var randomCharacterSeed = random(99999999);

var newReplay = [];
var gameTime = 0;
var replayLvl = 0;



var minutes = saveCode ? (saveCode.length > 22 ? saveCode[23] : 0) : 0;
var seconds = saveCode ? (saveCode.length > 22 ? saveCode[24] : 0) : 0;
var milliseconds = saveCode ? (saveCode.length > 22 ? saveCode[25] : 0) : 0;
var levelMinutes = 0;
var levelSeconds = 0;
var levelMilliseconds = 0;





var wrongSize;

if (width === 400 && height === 400) {
    wrongSize = true;
}

noStroke(); // No noStroke would mean no Electric Dolphin on KA
size(600, 600, 1); // Fix the infamous "Small screen" bug

textAlign(CENTER, CENTER);


var circles = [];
var rects = [];
var lRects = [];
var fireballs = [];
var particles = [];


var collided = false;


var pX = 200;
var pY = 200;
var spawnX = pX;
var spawnY = pY;
var displayX = pX;
var displayY = pY;
var displayX2 = displayX;
var displayY2 = displayY;
var xVel = 0;
var yVel = 0;
var canJump = 0;
var scene = "menu";
var transitionImg;
var transitionTime = 0;
var getTransitionImg = false;
var click = false;
var startCustom = false;
var introTime = 500;
var delag = false;
var debugg = false;
var noclip = false;
var easy = false;
var bossX = level - 1;
var mobile = mobile || false;

background(255, 0);
for (var i = 280; i > 0; i --) {
	fill(255, 255, 155, 5 - floor(i/200) * 4);
	ellipse(140, 140, i, i);
}
var sunImg = get(0, 0, 280, 280);

background(255, 0);
for (var i = 250; i > 150; i --) {
	fill(255, 255, 255, 1);
	ellipse(125, 125, i, i);
}
fill(200);
ellipse(125, 125, 150, 150);
var moonImg = get(0, 0, 250, 250);

background(255, 0);
for (var i = 155; i > 0; i --) {
	fill(0, (i - 60));
	ellipse(125, 125, i, i);
}
fill(0);
ellipse(125, 125, 150, 150);
fill(150);
ellipse(110, 110, 149, 149);
var moonOverlay = get(0, 0, 250, 250);

background(0);
for (var i = 150; i > 0; i --) {
	fill((i/2 - 54));
	ellipse(125, 125, i, i);
}
fill(0);
ellipse(110, 110, 150, 150);
fill(255);
ellipse(100, 100, 40, 40);
ellipse(150, 130, 30, 30);
ellipse(117, 156, 25, 25);
ellipse(80, 140, 20, 20);
ellipse(159, 96, 20, 20);
var moonMask = get(0, 0, 250, 250);

if (moonOverlay) {
    moonOverlay.mask(moonMask);
}

background(255);

// https://gist.github.com/mjackson/5311256
function hsvToRgb(h, s, v) {
	var r, g, b;
	h /= 255;
	s /= 255;
	v /= 255;
	
	var i = Math.floor(h * 6);
	var f = h * 6 - i;
	var p = v * (1 - s);
	var q = v * (1 - f * s);
	var t = v * (1 - (1 - f) * s);
	
	switch (i % 6) {
		case 0: r = v; g = t; b = p; break;
		case 1: r = q; g = v; b = p; break;
		case 2: r = p; g = v; b = t; break;
		case 3: r = p; g = q; b = v; break;
		case 4: r = t; g = p; b = v; break;
		case 5: r = v; g = p; b = q; break;
	}
	
	return [ r * 255, g * 255, b * 255 ];
}

var character = {
	eye1x: 0,
	eye1y: 0,
	eye2x: 0,
	eye2y: 0,
	eye1s: 0,
	eye2s: 0,
	bothX: 0,
	bothY: 0,
	mouthX: 0,
	mouthY: 0,
	mouthS: 0,
	eyeCol1: color(0),
	eyeCol1Hsb: [0, 0, 0],
	eyeCol2: color(0),
	eyeCol2Hsb: [0, 0, 0],
	bothCol: color(0),
	bothColHsb: [0, 0, 0],
	mouthCol: color(0),
	mouthColHsb: [0, 0, 0],
	bodyCol: color(0, 136, 255),
	bodyColHsb: [147, 255, 255],
};
var classicCharacter = Object.assign({}, character);
for (var i in classicCharacter) {
	if (typeof(classicCharacter[i]) === "object") {
		classicCharacter[i] = Object.assign({}, character[i]);
	}
}


if (saveCode) {
    var a = 1;
    for (var i in character) {
        character[i] = saveCode[a];
        a ++;
    }
}

var currentCustom = 0;
var eyeCustom = 0;

var normalFont = createFont("arial");
var boldFont = createFont("segoe ui Bold");


var creditsCharacter = function(x, y, col, eyeCol, mouthCol, offset, isRect) {
    if (!isRect) {
        fill(col);
        ellipse(x, y + min(sin(frameCount * 5 + offset) * 100, 0), 60, 60);
        fill(mouthCol);
        ellipse(constrain((pX - x)/4 + x, x - 10, x + 10), y + 10 + min(sin(frameCount * 5 + offset) * 100, 0), 20, 20);
        fill(eyeCol);
        ellipse(constrain((pX - x)/4 + x - 10, x - 20, x), y - 10 + min(sin(frameCount * 5 + offset) * 100, 0), 10, 10);
        ellipse(constrain((pX - x)/4 + x + 10, x, x + 20), y - 10 + min(sin(frameCount * 5 + offset) * 100, 0), 10, 10);
    } else {
        fill(col);
        rect(x - 30, y + min(sin(frameCount * 5 + offset) * 100, 0) - 30, 60, 60);
        fill(mouthCol);
        rect(constrain((pX - x)/4 + x, x - 10, x + 10) - 15, y + min(sin(frameCount * 5 + offset) * 100, 0) + 10, 30, 10);
        fill(eyeCol);
        rect(constrain((pX - x)/4 + x - 10, x - 20, x) - 5, y - 15 + min(sin(frameCount * 5 + offset) * 100, 0), 10, 10);
        rect(constrain((pX - x)/4 + x + 10, x, x + 20) - 5, y - 15 + min(sin(frameCount * 5 + offset) * 100, 0), 10, 10);
    }

};


var die = function() {
    if (!noclip || pY >= 5000) {
	    scene = "die";
	    getTransitionImg = true;
        if (bossX === 12) {
            background(0);
        }
    }
};


var circleRectCollide = function(rx, ry, rw, rh, cx, cy, cs) {
	return dist(constrain(cx, rx, rx + rw), constrain(cy, ry, ry + rh), cx, cy) < cs/2;
};


var levelInfo = [
	{
		end: 7160,
		bg: color(255),
		name: "CircLand",
	}, 
	{
		end: 5400,
		bg: color(255, 0, 0),
		name: "The end?",
	},
	{
		end: 5900,
		bg: color(255, 0, 0),
		name: "Getting over it",
	},
	{
		end: 5000,
		bg: color(100, 120, 200),
		name: "Circle forest",
	},
	{
		end: 2000,
		bg: color(80, 100, 180),
		name: "Hidden help"
	},
	{
		bg: color(205, 105, 105),
		end: 6000,
		name: "The Great Plains",
	},
	{
		bg: color(205, 105, 105),
		end: 5700,
		name: "The Corrupted Plains",
	},
	{
		bg: color(0, 0, 55),
		end: 4200,
		name: "RectLand",
	},
	{
		bg: color(0, 0, 55),
		end: 3800,
		name: "Rectangle Village",
	},
	{
		bg: color(0, 0, 55),
		end: 6500,
		name: "Mage's fury",
	},
	{
		bg: color(0, 0, 55),
		end: 3800,
		name: "Last Stand",
	},
    {
		bg: color(0, 0, 0),
		end: 12000,
		name: "The end.",
	},
    {
		bg: color(0, 0, 0),
		end: 12000,
		name: "",
	},
    {
		bg: color(255),
		end: 5100,
		name: "The end.",
	},
    {
		bg: color(255),
		end: 5100,
		name: "The end.",
	}
];


var circle = function(x, y, s, col, str) {
	this.x = x;
	this.y = y;
	this.s = s;
	this.col = col;
	this.str = str;
};
circle.prototype.draw = function() {
	fill(this.col);
	if (this.str) {
		stroke(this.str);
	} else {
		noStroke();
	}
	ellipse(this.x, this.y, this.s, this.s);
	noStroke();
};
circle.prototype.update = function() {
	if (dist(pX, pY, this.x, this.y) < this.s/2 + 30) {
		if (!collided) {
			if (pY > this.y + this.s/10) {
				while (dist(pX, pY, this.x, this.y) < this.s/2 + 30) {
					pY ++;
				} // Definitely not the best thing to do but I'm not smart so I couldn't get sin and cos and stuff to work
				pY = round(pY);
				if (yVel < 0) {
					yVel = -abs(yVel)/4;
				}
			} else if (pY < this.y - this.s/10) {
				while (dist(pX, pY, this.x, this.y) < this.s/2 + 30) {
					pY --;
				}
				pY = round(pY);
				yVel = 0;
				canJump = 10;
			} else if (pX < this.x) {
				pX = this.x - this.s/2 - 30;
				xVel = 0;
			} else {
				pX = this.x + this.s/2 + 30;
				xVel = 0;
			}
			collided = true;
		} else {
			pX = displayX;
			pY = displayY;
			xVel = 0;
			yVel = 0;
		}
	}
};


var rectangle = function(x, y, w, h, col, str) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.col = col;
	this.str = str;
};
rectangle.prototype.draw = function() {
	fill(this.col);
	if (this.str) {
		stroke(this.str);
	} else {
		noStroke();
	}
	if (bossX === 3 && frameCount % 300 < 60) {
		stroke(255);
	}
	rect(this.x, this.y, this.w, this.h);
	noStroke();
	if (circleRectCollide(this.x, this.y, this.w, this.h, pX, pY, 60)) {
		die();
	}
};

var lRect = function(x, y, w, h, col, str, area, speed, seekP) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.col = col;
	this.str = str;
	this.area = area;
	this.seekP = seekP;
	this.speed = speed;
	this.dir = 1;
	this.patrol = this.area/2;
};
lRect.prototype.draw = function() {
	this.x += (this.dir * (sin(this.patrol/this.area * 180) * this.speed) + this.dir)/(easy ? 2 : 1);
	this.patrol += abs(this.dir * (sin(this.patrol/this.area * 180) * this.speed) + this.dir)/(easy ? 2 : 1);
	
	fill(this.col);
	stroke(this.str);
	rect(this.x, this.y, this.w, this.h);
	fill(red(this.col) + 50, green(this.col) + 50, blue(this.col) + 50);
	rect(this.x + this.w/10, this.y + this.h/10, this.w/5, this.h/5);
	rect(this.x + this.w - this.w/10 - this.w/5, this.y + this.h/10, this.w/5, this.h/5);
	rect(this.x + this.w/10, this.y + this.h - this.h/3, this.w - this.w/5, this.h/5);
	
	if (this.patrol >= this.area) {
		this.dir = -this.dir;
		this.patrol = 0;
	}
	
	if (circleRectCollide(this.x, this.y, this.w, this.h, pX, pY, 60)) {
		die();
	}
};

var particle = function(x, y, vert) {
	this.x = x + 10;
	this.y = y + 10;
    this.vert = vert;
	this.col = color(random(200, 255), random(50, 100), 0);
    if (this.vert) {
        this.xVel = random(-2, 2);
        this.yVel = random(-4, 0);
    } else {
        this.xVel = random(-2, 2);
        this.yVel = random(-4, 2);
    }
	this.life = 60;
};
particle.prototype.draw = function() {
	fill(this.col);
	rect(this.x, this.y, 10, 10);
	this.x += this.xVel;
	this.y += this.yVel;
	this.yVel += 0.2;
	this.life --;
};

var fireball = function(x, y) {
	this.x = x;
	this.y = y;
};
fireball.prototype.draw = function() {
	this.x -= 5;
	
	fill(242, 91, 3);
	rect(min(this.x, (bossX === 11 ? 2770 : displayX + 270)), this.y, 30, 30);
	
	if (circleRectCollide(this.x + 10, this.y + 10, 10, 10, pX, pY, 60) && this.x < levelInfo[bossX].end - 200) {
		die();
	}
	if (!floor(random(delag ? 5 : 2))) {
		particles.push(new particle(this.x, this.y));
	}
};

var vertFireball = function(x, y) {
	this.x = x;
	this.y = y;
};
vertFireball.prototype.draw = function() {
	this.y += 5;
	
	fill(242, 91, 3);
	rect(this.x, max(this.y, bossX === 11 ? -250 : displayY - 300), 30, 30);
	
	if (circleRectCollide(this.x + 10, this.y + 10, 10, 10, pX, pY, 60) && this.x < levelInfo[bossX].end - 200) {
		die();
	}
	if (!floor(random(delag ? 5 : 2))) {
		particles.push(new particle(this.x, this.y, true));
	}
};


var circArray = [
	[
		[200, 700, 800, color(255), color(0)], [600, 700, 800, color(255), color(0)], [1200, 600, 800, color(255), color(0)], [1800, 1200, 800, color(255), color(0)], [2250, 900, 100, color(255), color(0)], [2450, 1000, 100, color(255), color(0)], [2650, 850, 100, color(255), color(0)], [3550, 3000, 1000, color(255), color(0)], [4550, 3000, 1000, color(255), color(0)], [4050, 3000, 1000, color(255), color(0)], [5650, 3000, 1000, color(255, 0), color(0)], [6700, 3000, 1000, color(255, 0), color(0)],
	],
	
	[
		[200, 700, 800, color(255, 0, 0), color(0)], [600, 700, 800, color(255, 0, 0), color(0)], [1500, 1300, 2000, color(255, 0, 0), color(0)], [1000, 700, 800, color(255, 0, 0), color(0)], [1800, 300, 100, color(255, 0, 0), color(0)], 
		//{
		[1850, 250, 10, color(255, 0, 0), color(0)], [1850, 240, 10, color(255, 0, 0), color(0)], [1850, 230, 10, color(255, 0, 0), color(0)], [1850, 220, 10, color(255, 0, 0), color(0)], [1850, 210, 10, color(255, 0, 0), color(0)], [1850, 200, 10, color(255, 0, 0), color(0)], [1850, 190, 10, color(255, 0, 0), color(0)], [1850, 180, 10, color(255, 0, 0), color(0)], [1850, 170, 10, color(255, 0, 0), color(0)], [1850, 160, 10, color(255, 0, 0), color(0)], [1850, 150, 10, color(255, 0, 0), color(0)],
		//} // Winston's throne
		[2000, 700, 800, color(255, 0, 0), color(0)],
		[2400, 700, 800, color(255, 0, 0), color(0)],
		[2800, 700, 800, color(255, 0, 0), color(0)],
		[3200, 700, 800, color(255, 0, 0), color(0)],
		[4200, 2000, 800, color(255, 0, 0), color(0)],
		[5200, 2000, 800, color(255, 0, 0), color(0)],
	],
	
	[
		[200, 700, 800, color(255, 0, 0), color(0)],
		[800, 900, 800, color(255, 0, 0), color(0)],
		[1400, 1100, 800, color(255, 0, 0), color(0)],
		[2000, 1100, 800, color(255, 0, 0), color(0)],
		[2400, 650, 200, color(255, 0, 0), color(0)],
		[2800, 450, 200, color(255, 0, 0), color(0)],
		[2400, 250, 200, color(255, 0, 0), color(0)],
		[2000, 50, 200, color(255, 0, 0), color(0)],
		[2400, -50, 200, color(255, 0, 0), color(0)],
		[2600, -50, 200, color(255, 0, 0), color(0)],
		[2800, -50, 200, color(255, 0, 0), color(0)],
		[3000, -50, 200, color(255, 0, 0), color(0)],
		[3500, 200, 800, color(255, 0, 0), color(0)],
		[4500, 2000, 800, color(255, 0, 0), color(0)],
		[4800, 2000, 800, color(255, 0, 0), color(0)],
		[5100, 2000, 800, color(255, 0, 0), color(0)],
		[5400, 2000, 800, color(255, 0, 0), color(0)],
		[5700, 2000, 800, color(255, 0, 0), color(0)],
	],
	
	[
		[-100, 700, 800, color(0, 100, 0), color(255, 0)],
		[200, 700, 800, color(0, 100, 0), color(0, 0)],
		[500, 700, 800, color(0, 100, 0), color(0, 0)],
		[800, 700, 800, color(0, 100, 0), color(0, 0)],
		[1100, 700, 800, color(0, 100, 0), color(0, 0)],
		[1400, 700, 800, color(0, 100, 0), color(0, 0)],
		[1700, 900, 800, color(0, 100, 0), color(0, 0)],
		[2000, 900, 800, color(0, 100, 0), color(0, 0)],
		[2300, 900, 800, color(0, 100, 0), color(0, 0)],
		[2600, 900, 800, color(0, 100, 0), color(0, 0)],
		[2900, 900, 800, color(0, 100, 0), color(0, 0)],
		[3200, 900, 800, color(0, 100, 0), color(0, 0)],
		[3500, 900, 800, color(0, 100, 0), color(0, 0)],
		[3800, 900, 800, color(0, 100, 0), color(0, 0)],
		[4100, 900, 800, color(0, 100, 0), color(0, 0)],
		[4300, 900, 800, color(0, 100, 0), color(0, 0)],
		[4600, 900, 800, color(0, 100, 0), color(0, 0)],
		[4900, 900, 800, color(0, 100, 0), color(0, 0)],
		[5200, 900, 800, color(0, 100, 0), color(0, 0)],
	],
	
	[
		[-100, 700, 800, color(0, 100, 0), color(255, 0)],
		[200, 700, 800, color(0, 100, 0), color(0, 0)],
		[500, 700, 800, color(0, 100, 0), color(0, 0)],
		[800, 700, 800, color(0, 100, 0), color(0, 0)],
		[1100, 700, 800, color(0, 100, 0), color(0, 0)],
		[1400, 700, 800, color(0, 100, 0), color(0, 0)],
		[1700, 900, 800, color(0, 100, 0), color(0, 0)],
		[2000, 900, 800, color(0, 100, 0), color(0, 0)],
		[2300, 900, 800, color(0, 100, 0), color(0, 0)],
		[2600, 900, 800, color(0, 100, 0), color(0, 0)],
		[2900, 900, 800, color(0, 100, 0), color(0, 0)],
		[3200, 900, 800, color(0, 100, 0), color(0, 0)],
		[3500, 900, 800, color(0, 100, 0), color(0, 0)],
		[3800, 900, 800, color(0, 100, 0), color(0, 0)],
		[4100, 900, 800, color(0, 100, 0), color(0, 0)],
		[4300, 900, 800, color(0, 100, 0), color(0, 0)],
		[4600, 900, 800, color(0, 100, 0), color(0, 0)],
		[4900, 900, 800, color(0, 100, 0), color(0, 0)],
		[5200, 900, 800, color(0, 100, 0), color(0, 0)],
		[5500, 900, 800, color(0, 100, 0), color(0, 0)],
		[5800, 900, 800, color(0, 100, 0), color(0, 0)],
		[6100, 900, 800, color(0, 100, 0), color(0, 0)],
		[6300, 900, 800, color(0, 100, 0), color(0, 0)],
		[6600, 900, 800, color(0, 100, 0), color(0, 0)],
		[6900, 900, 800, color(0, 100, 0), color(0, 0)],
		[7200, 900, 800, color(0, 100, 0), color(0, 0)],
		[7500, 900, 800, color(0, 100, 0), color(0, 0)],
		[7800, 900, 800, color(0, 100, 0), color(0, 0)],
		[8100, 900, 800, color(0, 100, 0), color(0, 0)],
		[8300, 900, 800, color(0, 100, 0), color(0, 0)],
		[8600, 900, 800, color(0, 100, 0), color(0, 0)],
		[8900, 900, 800, color(0, 100, 0), color(0, 0)],
		[9200, 900, 800, color(0, 100, 0), color(0, 0)],
		[9500, 900, 800, color(0, 100, 0), color(0, 0)],
		[9800, 900, 800, color(0, 100, 0), color(0, 0)],
		[10100, 900, 800, color(0, 100, 0), color(0, 0)],
		
		[1668, 205, 200, color(0, 100, 0), color(0, 0)],
		[1370, 50, 50, color(27, 96, 4), color(0, 0)],
		[1070, -55, 50, color(27, 96, 4), color(0, 0)],
		
		[870, -225, 50, color(255), color(0, 0)],
		[820, -225, 100, color(255), color(0, 0)],
		[770, -225, 50, color(255), color(0, 0)],
		
		[420, -225, 50, color(255), color(0, 0)],
		[370, -225, 100, color(255), color(0, 0)],
		[320, -225, 50, color(255), color(0, 0)],
		
		[120, -400, 50, color(255), color(0, 0)],
		[70, -400, 100, color(255), color(0, 0)],
		[20, -400, 50, color(255), color(0, 0)],
		
		[420, -575, 50, color(255), color(0, 0)],
		[370, -575, 100, color(255), color(0, 0)],
		[320, -575, 50, color(255), color(0, 0)],
		
		[870, -600, 50, color(255), color(0, 0)],
		[820, -600, 100, color(255), color(0, 0)],
		[770, -600, 50, color(255), color(0, 0)],
		
		[1270, -600, 50, color(255), color(0, 0)],
		[1220, -600, 100, color(255), color(0, 0)],
		[1170, -600, 50, color(255), color(0, 0)],
	],
	
	[
		[-100, 700, 800, color(0, 50, 0), color(255, 0)],
		[200, 700, 800, color(0, 50, 0), color(0, 0)],
		[500, 700, 800, color(0, 50, 0), color(0, 0)],
		[800, 700, 800, color(0, 50, 0), color(0, 0)],
		[1100, 700, 800, color(0, 50, 0), color(0, 0)],
		[1400, 700, 800, color(0, 50, 0), color(0, 0)],
		[1700, 700, 800, color(0, 50, 0), color(0, 0)],
		[2000, 700, 800, color(0, 50, 0), color(0, 0)],
		[2300, 700, 800, color(0, 50, 0), color(0, 0)],
		[2600, 700, 800, color(0, 50, 0), color(0, 0)],
		[2900, 700, 800, color(0, 50, 0), color(0, 0)],
		[3200, 700, 800, color(0, 50, 0), color(0, 0)],
		[3500, 700, 800, color(0, 50, 0), color(0, 0)],
		[3800, 700, 800, color(0, 50, 0), color(0, 0)],
		[4100, 700, 800, color(0, 50, 0), color(0, 0)],
		[4400, 700, 800, color(0, 50, 0), color(0, 0)],
		[4700, 700, 800, color(0, 50, 0), color(0, 0)],
		[5000, 700, 800, color(0, 50, 0), color(0, 0)],
		[5300, 700, 800, color(0, 50, 0), color(0, 0)],
		[5600, 700, 800, color(0, 50, 0), color(0, 0)],
		[5900, 700, 800, color(0, 50, 0), color(0, 0)],
		[6200, 700, 800, color(0, 50, 0), color(0, 0)],
		[6500, 700, 800, color(0, 50, 0), color(0, 0)],
	],
	
	[
		[-100, 700, 800, color(0, 50, 0), color(255, 0)],
		[200, 700, 800, color(0, 50, 0), color(0, 0)],
		[500, 700, 800, color(0, 50, 0), color(0, 0)],
		[800, 700, 800, color(0, 50, 0), color(0, 0)],
		[1100, 700, 800, color(0, 50, 0), color(0, 0)],
		[1400, 700, 800, color(0, 50, 0), color(0, 0)],
		[1700, 700, 800, color(0, 50, 0), color(0, 0)],
		[2100, 300, 20, color(0, 0, 0), color(0, 0)],
		[2400, 400, 20, color(0, 0, 0), color(0, 0)],
		[2700, 300, 20, color(0, 0, 0), color(0, 0)],
		[3000, 400, 20, color(0, 0, 0), color(0, 0)],
		[3300, 300, 20, color(0, 0, 0), color(0, 0)],
		[3600, 400, 20, color(0, 0, 0), color(0, 0)],
		[3800, 300, 20, color(0, 0, 0), color(0, 0)],
		[4000, 200, 20, color(0, 0, 0), color(0, 0)],
		[4200, 50, 20, color(0, 0, 0), color(0, 0)],
		[4200, -100, 20, color(0, 0, 0), color(0, 0)],
		[4500, -100, 20, color(0, 0, 0), color(0, 0)],
		[4800, -100, 20, color(0, 0, 0), color(0, 0)],
		[4900, -200, 20, color(0, 0, 0, 8), color(0, 0)],
		[5100, -350, 20, color(0, 0, 0, 8), color(0, 0)],
		[5400, -300, 20, color(0, 0, 0, 8), color(0, 0)],
	],
	
	[
		[-100, 700, 800, color(0, 20, 0), color(255, 0)],
		[200, 700, 800, color(0, 20, 0), color(0, 0)],
		[500, 300, 20, color(0, 0, 0), color(0, 0)],
		[700, 300, 20, color(0, 0, 0), color(0, 0)],
		[900, 150, 20, color(0, 0, 0), color(0, 0)],
		[1175, 150, 20, color(0, 0, 0), color(0, 0)],
		[1350, 150, 20, color(0, 0, 0), color(0, 0)],
		[1630, 5, 20, color(0, 0, 0), color(0, 0)],
		[1920, -140, 20, color(0, 0, 0), color(0, 0)],
		[2350, 40, 40, color(0, 0, 0), color(0, 0)],
		[2450, -60, 60, color(0, 0, 0), color(0, 0)],
		[2450, -185, 60, color(0, 0, 0), color(0, 0)],
		[2850, -185, 60, color(0, 0, 0), color(0, 0)],
		[3250, -185, 60, color(0, 0, 0), color(0, 0)],
		[3250, -310, 60, color(0, 0, 0), color(0, 0)],
		[3250, -435, 60, color(0, 0, 0), color(0, 0)],
		[3250, -560, 60, color(0, 0, 0), color(0, 0)],
		[3250, -685, 60, color(0, 0, 0), color(0, 0)],
		[3550, -685, 60, color(0, 0, 0), color(0, 0)],
		[3850, -685, 60, color(0, 0, 0), color(0, 0)],
	],
	
	[
		[200, 350, 60, color(0, 0, 0), color(255, 0)],
		[400, 175, 60, color(0, 0, 0), color(255, 0)],
		[600, 0, 60, color(0, 0, 0), color(255, 0)],
		[800, 20, 30, color(50), color(255, 0)],
		[805, -25, 30, color(50), color(255, 0)],
		[805, -75, 50, color(50), color(255, 0)],
		[1100, 0, 60, color(0, 0, 0), color(255, 0)],
		[1350, 0, 60, color(0, 0, 0), color(255, 0)],
		[1550, 0, 60, color(0, 0, 0), color(255, 0)],
		[1750, 0, 60, color(0, 0, 0), color(255, 0)],
		[1950, 0, 60, color(0, 0, 0), color(255, 0)],
		[1950, -150, 60, color(0, 0, 0), color(255, 0)],
		[2150, -150, 60, color(0, 0, 0), color(255, 0)],
		[1950, -300, 60, color(0, 0, 0), color(255, 0)],
		[2150, -300, 60, color(0, 0, 0), color(255, 0)],
		[1950, -450, 60, color(0, 0, 0), color(255, 0)],
		[2150, -450, 60, color(0, 0, 0), color(255, 0)],
		[1950, -600, 60, color(0, 0, 0), color(255, 0)],
		[2150, -600, 60, color(0, 0, 0), color(255, 0)],
		[1950, -750, 60, color(0, 0, 0), color(255, 0)],
		[2150, -750, 60, color(0, 0, 0), color(255, 0)],
		[1950, -900, 60, color(0, 0, 0), color(255, 0)],
		[2150, -900, 60, color(0, 0, 0), color(255, 0)],
		[1950, -1050, 60, color(0, 0, 0), color(255, 0)],
		[2150, -1050, 60, color(0, 0, 0), color(255, 0)],
		[1950, -1200, 60, color(0, 0, 0), color(255, 0)],
		[2150, -1200, 60, color(0, 0, 0), color(255, 0)],
		[1950, -1350, 60, color(0, 0, 0), color(255, 0)],
		[2150, -1350, 60, color(0, 0, 0), color(255, 0)],
		[1950, -1500, 60, color(0, 0, 0), color(255, 0)],
		[2150, -1500, 60, color(0, 0, 0), color(255, 0)],
		[1950, -1650, 60, color(0, 0, 0), color(255, 0)],
		[2150, -1650, 60, color(0, 0, 0), color(255, 0)],
		[1950, -1800, 60, color(0, 0, 0), color(255, 0)],
		[2150, -1800, 60, color(0, 0, 0), color(255, 0)],
		[3100, 500, 300, color(0, 0, 0), color(255, 0)],
		[3300, 500, 300, color(0, 0, 0), color(255, 0)],
		[3500, 500, 300, color(0, 0, 0), color(255, 0)],
	],

	[
		[-100, 700, 800, color(0, 20, 0), color(255, 0)],
		[200, 700, 800, color(0, 20, 0), color(255, 0)],
		[500, 700, 800, color(0, 20, 0), color(255, 0)],
		[800, 700, 800, color(0, 20, 0), color(255, 0)],
		[1100, 700, 800, color(0, 20, 0), color(255, 0)],
		[1400, 700, 800, color(0, 20, 0), color(255, 0)],
		[1700, 700, 800, color(0, 20, 0), color(255, 0)],
		[2000, 700, 800, color(0, 20, 0), color(255, 0)],
		[2300, 700, 800, color(0, 20, 0), color(255, 0)],
		[2600, 700, 800, color(0, 20, 0), color(255, 0)],
		[2900, 700, 800, color(0, 20, 0), color(255, 0)],
		[3200, 700, 800, color(0, 20, 0), color(255, 0)],
		[3500, 700, 800, color(0, 20, 0), color(255, 0)],
		[3800, 700, 800, color(0, 20, 0), color(255, 0)],
		[4100, 700, 800, color(0, 20, 0), color(255, 0)],
		[4400, 700, 800, color(0, 20, 0), color(255, 0)],
		[4700, 700, 800, color(0, 20, 0), color(255, 0)],
		[5000, 700, 800, color(0, 20, 0), color(255, 0)],
		[5300, 700, 800, color(0, 20, 0), color(255, 0)],
		[5600, 700, 800, color(0, 20, 0), color(255, 0)],
		[5900, 700, 800, color(0, 20, 0), color(255, 0)],
		[6200, 700, 800, color(0, 20, 0), color(255, 0)],
		[6500, 700, 800, color(0, 20, 0), color(255, 0)],
	],

	[
		[-100, 700, 800, color(0, 20, 0), color(255, 0)],
		[200, 700, 800, color(0, 20, 0), color(255, 0)],

    [600, 300, 30, color(0)],
    [600, 160, 30, color(0)],
    [900, 300, 30, color(0)],
    [900, 160, 30, color(0)],
    [1200, 300, 30, color(0)],
    [1200, 160, 30, color(0)],
    [1500, 300, 30, color(0)],
    [1500, 160, 30, color(0)],
    [1800, 300, 30, color(0)],
    [1800, 160, 30, color(0)],
    [2100, 300, 30, color(0)],
    [2100, 160, 30, color(0)],
    [2400, 160, 30, color(0)],
    [2800, 160, 30, color(0)],
    [2800, 20, 30, color(0)],
    [3100, 20, 30, color(0)],
    [3200, -80, 30, color(0)],
    [3300, -180, 30, color(0)],
    [3400, -280, 30, color(0)],
    [3500, -380, 30, color(0)],
	],

    [
        [-100, 700, 800, color(0, 0, 0)],
        [300, 700, 800, color(0, 0, 0)],
        [700, 700, 800, color(0, 0, 0)],
        [1100, 700, 800, color(0, 0, 0)],
        [1500, 700, 800, color(0, 0, 0)],
        [1900, 700, 800, color(0, 0, 0)],
        [2300, 700, 800, color(0, 0, 0)],
        [2700, 700, 800, color(0, 0, 0)],
        [3100, 700, 800, color(0, 0, 0)],
        [3500, 700, 800, color(0, 0, 0)],
        [3900, 700, 800, color(0, 0, 0)],
        [4300, 700, 800, color(0, 0, 0)],
        [4700, 700, 800, color(0, 0, 0)],
        [5100, 700, 800, color(0, 0, 0)],
        [5500, 700, 800, color(0, 0, 0)],
        [5900, 700, 800, color(0, 0, 0)],
        [6300, 700, 800, color(0, 0, 0)],
        [6700, 700, 800, color(0, 0, 0)],
        [7100, 700, 800, color(0, 0, 0)],
        [7500, 700, 800, color(0, 0, 0)],
        [7900, 700, 800, color(0, 0, 0)],
        [8300, 700, 800, color(0, 0, 0)],
        [8700, 700, 800, color(0, 0, 0)],
        [9100, 700, 800, color(0, 0, 0)],
        [9500, 700, 800, color(0, 0, 0)],
        [9900, 700, 800, color(0, 0, 0)],
        [10300, 700, 800, color(0, 0, 0)],
        [10700, 700, 800, color(0, 0, 0)],
        [11100, 700, 800, color(0, 0, 0)],
        [11500, 700, 800, color(0, 0, 0)],
        [11900, 700, 800, color(0, 0, 0)],
        [12300, 700, 800, color(0, 0, 0)],
        [12700, 700, 800, color(0, 0, 0)],
    ],

    [
        [1200, 5030, 80, color(18)],
        [1240, 5030, 80, color(18)],
        [1280, 5030, 80, color(18)],
        [1320, 5030, 80, color(18)],
        [1360, 5030, 80, color(18)],
        [1400, 5030, 80, color(18)],
        [1600, 4850, 80, color(18)],
        [1800, 4660, 80, color(18)],
        [2000, 4470, 80, color(18)],
        [2200, 4280, 80, color(18)],
        [2500, 4680, 80, color(18)],
        [2800, 4680, 80, color(18)],
        [2800, 4530, 80, color(18)],
        [2800, 4380, 80, color(18)],
        [2800, 4230, 80, color(18)],
        [2800, 4040, 80, color(18)],
        [2800, 3850, 80, color(18)],
        [4000, 5050, 1600, color(0), color(255)],
    ],

    [
        [-100, 700, 800, color(255), color(0)],
        [300, 700, 800, color(255), color(0)],
        [700, 700, 800, color(255), color(0)],
        [1100, 700, 800, color(255), color(0)],
        [1500, 700, 800, color(255), color(0)],
        [1900, 700, 800, color(255), color(0)],
        [2300, 700, 800, color(255), color(0)],
        [2700, 700, 800, color(255), color(0)],
        [3100, 700, 800, color(255), color(0)],
        [3500, 700, 800, color(255), color(0)],
        [3900, 700, 800, color(255), color(0)],
        [4300, 700, 800, color(255), color(0)],
        [4700, 700, 800, color(255), color(0)],
        [5100, 700, 800, color(255), color(0)],
        [5500, 700, 800, color(255), color(0)],
        [5900, 700, 800, color(255), color(0)],
        [6300, 700, 800, color(255), color(0)],
        [6700, 700, 800, color(255), color(0)],
        [7100, 700, 800, color(255), color(0)],
    ],
    [
        [-100, 700, 800, color(255), color(0)],
        [300, 700, 800, color(255), color(0)],
        [700, 700, 800, color(255), color(0)],
        [1100, 700, 800, color(255), color(0)],
        [1500, 700, 800, color(255), color(0)],
        [1900, 700, 800, color(255), color(0)],
        [2300, 700, 800, color(255), color(0)],
        [2700, 700, 800, color(255), color(0)],
        [3100, 700, 800, color(255), color(0)],
        [3500, 700, 800, color(255), color(0)],
        [3900, 700, 800, color(255), color(0)],
        [4300, 700, 800, color(255), color(0)],
        [4700, 700, 800, color(255), color(0)],
        [5100, 700, 800, color(255), color(0)],
        [5500, 700, 800, color(255), color(0)],
        [5900, 700, 800, color(255), color(0)],
        [6300, 700, 800, color(255), color(0)],
        [6700, 700, 800, color(255), color(0)],
        [7100, 700, 800, color(255), color(0)],
    ],
];


var rectArray = [
	[
		[6125, 2700, 100, 50, color(255, 0), color(0)]
	],
	
	[
		[350, 305, 100, 50, color(255, 0, 0), color(0)], [2150, 305, 100, 50, color(255, 0, 0), color(0)], [2550, 305, 100, 50, color(255, 0, 0), color(0)], [2900, 255, 200, 50, color(255, 0, 0), color(0)], [4600, 2000, 200, 20, color(255, 0, 0), color(0)],
	],
	
	[
		[1160, 725, 100, 50, color(255, 0, 0), color(0)],
		[1560, 725, 300, 50, color(255, 0, 0), color(0)],
		[2260, 600, 50, 300, color(255, 0, 0), color(0)],
		[2400, 140, 10, 10, color(255, 0, 0), color(0)],
	],
	
	[
		[2100, 485, 100, 50, color(0, 100, 0), color(255)],
		[2600, 485, 100, 50, color(0, 100, 0)],
		[3200, 485, 100, 50, color(0, 100, 0)],
		[3400, 485, 100, 50, color(0, 100, 0)],
		[3800, 395, 10, 130, color(0, 100, 0, 0)],
	],
	
	[
		[1600, -200, 50, 500, color(100)],
	],
	
	[],
	
	[
		[1700, 400, 10000, 800, color(255, 50, 0), color(0, 0)],
	],
	
	[
		[500, 500, 500, 800, color(255, 50, 0), color(0, 0)],
		[350, 350, 10000, 100, color(0, 0, 0), color(0, 0)],
		[1000, 50, 75, 1000, color(0, 0, 0), color(0, 0)],
		[1075, 450, 10000, 500, color(0, 0, 0), color(0, 0)],
	],
	
	[
		[-100, 450, 10000, 500, color(0, 0, 0), color(0, 0)],
		[600, 250, 200, 200, color(0, 0, 0), color(0, 0)],
		[550, 220, 300, 30, color(0, 0, 0), color(0, 0)],
		[575, 190, 250, 30, color(0, 0, 0), color(0, 0)],
		[600, 160, 200, 30, color(0, 0, 0), color(0, 0)],
		[625, 130, 150, 30, color(0, 0, 0), color(0, 0)],
		[650, 100, 100, 30, color(0, 0, 0), color(0, 0)],
		[780, 75, 50, 150, color(0, 0, 0), color(0, 0)],

		[1000, 250, 200, 200, color(0, 0, 0), color(0, 0)],
		[950, 220, 300, 30, color(0, 0, 0), color(0, 0)],
		[975, 190, 250, 30, color(0, 0, 0), color(0, 0)],
		[1000, 160, 200, 30, color(0, 0, 0), color(0, 0)],
		[1025, 130, 150, 30, color(0, 0, 0), color(0, 0)],
		[1050, 100, 100, 30, color(0, 0, 0), color(0, 0)],

		[1400, -5030, 50, 4800, color(0, 0, 0), color(0, 0)],
		[1400, -150, 50, 600, color(0, 0, 0), color(0, 0)],

		[1600, -5030, 50, 4800, color(0, 0, 0), color(0, 0)],
		[1600, -150, 50, 600, color(0, 0, 0), color(0, 0)],
	],

	[],

	[
		[-100, 450, 10000, 500, color(0, 0, 0), color(0, 0)],
    [2200, -1000, 50, 940, color(0)],
    [2200, 25, 50, 940, color(0)],
	]
];

var lRectArray = [
	[],
	[],
	[],
	[],
	[],
	[
		[3000, 250, 50, 50, color(0, 0, 100), color(255, 0), 500, 3, false],
		[4000, 250, 50, 50, color(0, 0, 100), color(255, 0), 100, 1, false],
		[4300, 250, 50, 50, color(0, 0, 100), color(255, 0), 100, 1, false],
		[4600, 250, 50, 50, color(0, 0, 100), color(255, 0), 100, 1, false],
		[4800, 250, 50, 50, color(0, 0, 100), color(255, 0), 100, 1, false],
	],
	[
		[4800, -185, 50, 50, color(200, 0, 0), color(255, 0), 400, 3, false],
	],
	[
		[2000, 300, 50, 50, color(0, 50, 0), color(255, 0), 400, 3, false],
		[3000, 300, 50, 50, color(0, 50, 0), color(255, 0), 400, 3, false],
		[4000, 300, 50, 50, color(0, 50, 0), color(255, 0), 400, 3, false],
	],
	[
		[675, 400, 50, 50, color(20), color(255, 0), 200, 3, false],
	],
	[
		[1500, 250, 50, 50, color(20), color(255, 0), 200, 3, false],
		[2500, 250, 50, 50, color(20), color(255, 0), 200, 3, false],
		[2800, 250, 50, 50, color(20), color(255, 0), 200, 3, false],

		[3500, 250, 50, 50, color(20), color(255, 0), 200, 3, false],
		[3800, 250, 50, 50, color(20), color(255, 0), 200, 3, false],
		[4100, 250, 50, 50, color(20), color(255, 0), 200, 3, false],
	],
  [
		[2625, 90, 50, 50, color(20), color(255, 0), 300, 3, false],
    [2925, -50, 50, 50, color(20), color(255, 0), 300, 3, false],
	]
];

var saveCodes = [
    ["JjTp",
    "%'b0rxZ5'd",
    "C;x",
    "#b2",
    "BYN!",
    "Ex",
    ">IOH|Q]c",
    "C,0>$",
    ".`FJ{",
    "@{QN.",
    "vCD1Kvda",
    "Jh<m4}*[o",
    "/1dcM17&g",
    "5F}4;A`/",
    "n-n",],
];

randomSeed(1);
var lvlCodes = [
    "Q+IR&0,kw$;YSD.e7d",
    "^=Sg+OPHHJ)k5~",
    "F$R+Iz_M^XR",
    "RX<yDIs^ProYU@J4",
    "SP]eILxkeNw'j",
    "]60T1>U9~Z!NAC+/o",
    "ry>bVbMF}.)y",
    "ZC$h%W(f++AbzP%",
    "8f_d9@<k7`$_.",
    "y>c];:PP.T2",
    "XuOfv]x'8_t}~bt",
    "|#$L--s_qal_E6",
    ">8y1.ZJTkyf}",
    "Ed^GHtH[>E8_",
    "7M$Sg6YKg]BgV%%>",
];
var chars = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890`-=[];',./~!@#$%^&*()_+{}|:<>?";
for (var i = 0; i < 15; i ++) {
    var tmp = "";
    for (var j = 0; j < random(10, 20); j ++) {
        tmp += chars[floor(random(chars.length))];
    }
    tmp = lvlCodes[i];
    saveCodes[i] = tmp;
    if (saveCode) { // Prevent the program from crashing without a save code
        if (saveCode[0] === tmp) {
            bossX = i;
        }
    }
}


for (var i in circArray[bossX]) {
	var circ = circArray[bossX][i];
	circles.push(new circle(circ[0], circ[1], circ[2], circ[3], circ[4]));
}

for (var i in rectArray[bossX]) {
	var rec = rectArray[bossX][i];
	rects.push(new rectangle(rec[0], rec[1], rec[2], rec[3], rec[4], rec[5]));
}

for (var i in lRectArray[bossX]) {
	var rec = lRectArray[bossX][i];
	lRects.push(new lRect(rec[0], rec[1], rec[2], rec[3], rec[4], rec[5], rec[6], rec[7], rec[8]));
}




var customTab = function(x, y, type) {
	fill(0, 0, 200);
	rect(x, y + (currentCustom === type ? 0 : 50), 150, 150, 50);
	fill(0);
	var typeText = type === 0 ? "Eyes" : (type === 1 ? "Mouth" : "Body");
	textSize(30);
	text(typeText, x + 75, y + 30 + (currentCustom === type ? 0 : 50));
	if (click && dist(((mouseX - 300) * 3/10) + 300, mouseY, 300, 600) > 300 && mouseX > x && mouseX < x + 150 && mouseY > y + 50) {
		currentCustom = type;
	}
};

var button = function(x, y, sz, txt, s, col, txtCol) {
	fill(col);
	ellipse(x, y, sz, sz);
	fill(txtCol);
	text(txt, x, y);
	if (dist(mouseX, mouseY, x, y) < sz/2) {
		fill(0, 155);
		ellipse(x, y, sz, sz);
		if (click) {
			scene = s;
			if (!saveCode) {
                minutes = 0;
                seconds = 0;
                milliseconds = 0;
			}
		}
	}
};

mouseClicked = function() {
	click = true;
};

mouseReleased = function() {
	if (scene === "customize") {
		startCustom = true;
	}
};

var bossDialogue = [
	[
		"You actually made it.",
		"You got past all the traps, all the guards, and all the terrain of the rectangle kingdom.",
		"It's like you could respawn...",
		"Anyway, your journey ends here. You're not getting past me.",
	],
    [
		"You got past all the traps, all the guards, and all the terrain of the rectangle kingdom.",
		"But you're not getting past me.",
	],
    [
		"You're not getting past me.",
	],
	[
		["To be honest, I don't know why I attacked CircLand.",
		"It was weird. I just felt like I had to.",],
		["It was like there was this weird voice in my head...",
		"It wouldn't stop until I finally made my attack.",
		"Then, it was gone.",],
		["You're very good at this, aren't you?",
		"I mean, I'm only one person. All the obstacles you faced were made by multiple people.",
		"So it's no surprise you're beating me alone.",
		"But with allies, you'll have no chance!",],
		["I'm starting to get tired. You might actually beat me.",],
        [],
		["Youre... Stronger than I thought.",],
		["I... Don't think... I can do this much longer...",],
		["Fine, you win.",
		"I'll withdraw all the rectangles from CircLand.",
		"I'll help you rebuild everything.",
		"I'll return everything we stole.",
		"And I'll free King Winston.",
		"I can't fight you much longer.",
		"And you're very strong.",
		"Just don't destroy this kingdom."],
	],
];


var secretDialogue = [
	[
		"Well, look who arrived.",
		"It's our \"hero.\"",
		"Who am I?\nWhat am I doing?",
		"It's me. VGhlIFJ1bGVy.\nThe \"narrator.\"",
		"I am not a circle.",
		"I am not a rectangle.",
		"As I said earlier, I'm from another universe.",
		"I manipulated the rectangle kingdom to attack CircLand.",
		"And I manipulated you to fight back.",
		"I even gathered enough strength to revive you when you died!",
		"And now...",
		"",
		"I will destroy this universe!",
		"Oh? You want to stop me?",
		"After all we've been through?",
		"Well then...",
		"Prepare for pain!",
	],
    [
        "I see you've learned how to respawn on your own.\nImpressive."
    ],
    [
        "Back for more?",
        "Let's settle this then.",
    ],
    [
        "Quite persistent, aren't you?",
        "I hope you realize that I'm unbeatable."
    ],
    [
        "Let's get this over with."
    ],
	[
		["You see, I'm trapped in my own universe.",
		"I have found a way to project myself to other universes, but only for a short amount of time.",
		"The only way to escape my universe is by gathering universe cores.",],
		["Once I have enough, I will escape...",
		"And then I'll take over KA!",],
        ["\"What's KA? Why are you taking it over?\"",
        "The circle must be confused, but I'm sure you aren't.",
        "Yes, you. Person that's controlling the circle."
        ],
        ["With both CircLand and the Rectangle Kingdom gone, it should've been easy to destroy this universe.",
        "But then you decided to get in my way."],
        [],
		["Wow, you're quite persistant, aren't you?",
		"Here's some circles. Have a nice break.",
		"SIKE! They're actually circtangles!",],
		["...Oh. You're still alive.",
		"You've been here before, haven't you?",
		"Well then...",
		"Time to make it harder!",],
        [],
        [],
        [],
		["You're still alive?",
		"Wow. I didn't expect you to be that good.",
		"Bad news is,",
        "",
        "this doesn't have to be a balanced game.",],
        [],
	],
    [
        "So, you beat me.",
        "You actually beat me.",
        "I thought I was unbeatable, but you proved me wrong.",
        "Except...",
        "You used that king to win.",
        "I'm sure you wouldn't be able to beat me alone.",
        "The king, such a nice person.",
        "I almost felt bad making him attack CircLand.",
        "I almost felt bad trying to destroy everything he's done.",
        "But I guess you got your happy ending.",
        "And at least I got a universe core from the first time you died.",
        "So, see ya in the next game!",
        "I'm sure we'll have a very... fun time.",
    ],
    [
        "You beat me but...",
        "You... Haven't died?",
        "Not even once???",
        "HOW AM I SUPPOSED TO GET A UNIVERSE CORE IF YOU'RE STILL IN MY WAY?!?!",
        "Fine. I'll just find some other player to get a universe core from.",
        "Someone who actually does what they're told.",
        "This is just a game after all.",
        "Either way, I'll see you in the next game!",
        "I'm sure we'll have a very... fun time.",
    ]
];

var easyDialogue = [
	[
		"Well, look who arrived.",
		"It's our...",
		"Alright, I can't keep this up.",
		"I see you're in easy mode.",
		"Heh. Cheating your way to victory.",
		"You do realize I'm immune to easy mode, right?",
		"I'll just keep attacking at the normal rate.",
		"So, if I were you, I would just go back to your\nprevious save and just accept the normal ending.",
		"Even if you did defeat me, I'm not giving you\nyour \"Good ending\".",
		"That being said...",
		"I'll just be nice to you and slow down my attacks.",
		"",
		"You won't get your good ending anyway.",
		"Oh? You want to stop me?",
		"After all we've been through?",
		"Well then...",
		"Prepare for pain!",
	],
    [
        "Of course you respawn. It's easy mode."
    ],
    [
        "Wow, imagine dying to me twice in EASY MODE",
    ],
    [
        "I hope you realize you're not getting that ending.",
    ],
    [
        "..."
    ],
	[
		["Nice, you survived a single attack!",],
		["Oh wow, nice!!!!!",],
        ["Alright, ready for the next attack?",],
        ["Way too easy, right?"],
        [],
		["Wait!!!!!",
		"DO NOT GO ONTO THOSE CIRCLES. I'll die instantly.",
		"Oh, your name is \"I\". Maybe.",],
		["You didn't fall for it?",
		"Hmmm.....",
		"Well then...",
		"Time to make it harder!",],
        ["We regret to inform you that easy mode\nwill not get you a good ending."],
        ["Remember: Beat me in normal mode for the real experience."],
        ["Time for my strongest attack in easy mode!\nFun fact: It's easier than my weakest attack in normal mode"],
		["You're still alive?",
		"I mean, of course you are. It's easy mode.",
		"Bad news is,",
        "",
        "this doesn't have to be a balanced game.",],
        [],
	],
    [
        "Good job you're so good!!!!!",
        "Seriously though, try to beat me in normal mode.",
        "You won't win.",
        "You lost to me in easy mode, so I doubt you'd get far in normal mode."
    ],
    [
        "Yay you beat me.",
        "At least you did it in 0 deaths.",
        "Maybe you're not as bad as I thought.",
        "Now go beat me in normal mode.",
    ]
];

var cutscene = 0;
var cutsceneVar = 0;
var cutsceneX = 0;
var cutsceneY = 0;
var bossDeaths = 0;
var bossStage = 0;
var fireballRate = 45;
var secretDead = false;
var ezSecret = false;
if (saveCode) {
    secretDead = saveCode[22];
}



var keys = [];
keyPressed = function() {
    keys[keyCode] = true;
    if (debugg) {
        if (keyCode === 78) {
            noclip = !noclip;
        }
        if (keyCode === 74) {
            pX = 200;
			pY = 200;
			xVel = 0;
			yVel = 0;
			bossX --;
			introTime = 500;
			circles = [];
			rects = [];
			lRects = [];
			for (var i in circArray[bossX]) {
				var circ = circArray[bossX][i];
				circles.push(new circle(circ[0], circ[1], circ[2], circ[3], circ[4]));
			}
			
			for (var i in rectArray[bossX]) {
				var rec = rectArray[bossX][i];
				rects.push(new rectangle(rec[0], rec[1], rec[2], rec[3], rec[4], rec[5]));
			}
			
			for (var i in lRectArray[bossX]) {
				var rec = lRectArray[bossX][i];
				lRects.push(new lRect(rec[0], rec[1], rec[2], rec[3], rec[4], rec[5], rec[6], rec[7], rec[8]));
			}
            fireballs = [];
            particles = [];
            cutsceneVar = 0;
            cutscene = 0;
            cutsceneX = 0;
            cutsceneY = 0;
        }
        if (keyCode === 75) {
            pX = 200;
			pY = 200;
			xVel = 0;
			yVel = 0;
			bossX ++;
			introTime = 500;
			circles = [];
			rects = [];
			lRects = [];
			for (var i in circArray[bossX]) {
				var circ = circArray[bossX][i];
				circles.push(new circle(circ[0], circ[1], circ[2], circ[3], circ[4]));
			}
			
			for (var i in rectArray[bossX]) {
				var rec = rectArray[bossX][i];
				rects.push(new rectangle(rec[0], rec[1], rec[2], rec[3], rec[4], rec[5]));
			}
			
			for (var i in lRectArray[bossX]) {
				var rec = lRectArray[bossX][i];
				lRects.push(new lRect(rec[0], rec[1], rec[2], rec[3], rec[4], rec[5], rec[6], rec[7], rec[8]));
			}
            fireballs = [];
            particles = [];
            cutsceneVar = 0;
            cutscene = 0;
            cutsceneX = 0;
            cutsceneY = 0;
        }
        if (keyCode === 187) {
            bossDeaths ++;
        }
        if (keyCode === 189) {
            bossDeaths --;
        }
        if (keyCode === 67) {
            cutscene ++;
            cutsceneVar = 0;
        }
        if (keyCode === 66) {
            cutsceneVar = 900;
        }
    }
    if (keys[32] && keys[16] && keys[83]) {
        var tmpStr = "";
        for (var i in character) {
            tmpStr += ", ";
            if (typeof character[i] === "object") {
                tmpStr += "[";
                for (var j in character[i]) {
                    tmpStr += character[i][j];
                    tmpStr += ",";
                }
                tmpStr += "]";
            } else {
                tmpStr += character[i];
            }
        }
        println("var saveCode = [\"" + saveCodes[bossX] + "\"" + tmpStr + ", " + secretDead + ", " + minutes + ", " + seconds + ", " + milliseconds + "];");
    }
    if (keyCode === 73) {
        easy = true;
        secretDialogue = easyDialogue;
    }
    mobile = false;
};
keyReleased = function() {keys[keyCode] = false;};



smooth();

draw = function() {
	if (scene === "menu") {
		background(levelInfo[bossX].bg);
		
		startCustom = false;

		if (bossX === 5 || bossX === 6) {
			image(sunImg, 300 - sunImg.width/2, 100);
		}
		if (bossX >= 7 && bossX <= 10) {
			image(moonImg, -20, -20);
			image(moonOverlay, -20, -20);
		}
		
		
		
		fill(circArray[bossX][0][3]);
		stroke(circArray[bossX][0][4]);
		strokeWeight(1);
		ellipse(500, 500, 400, 400);
		ellipse(300, 400, 400, 400);
		ellipse(100, 500, 400, 400);
		
		noStroke();
		
		fill(character.bodyCol);
		pushMatrix();
		translate(70, 272);
		rotate(pX*2 - 40);
		ellipse(0, 0, 60, 60);
		fill(character.eyeCol1);
		ellipse(-10 + character.eye1x, -10 + character.eye1y, 10 + character.eye1s, 10 + character.eye1s);
		fill(character.eyeCol2);
		ellipse(10 + character.eye2x, -10 + character.eye2y, 10 + character.eye2s, 10 + character.eye2s);
		fill(character.mouthCol);
		ellipse(0 + character.mouthX, 10 + character.mouthY, 20 + character.mouthS, 20 + character.mouthS);
		
		if (bossX === 5 || bossX === 6) {
			fill(0, 50);
			ellipse(0, 0, 60, 60);
		}
		
		if (bossX >= 7 && bossX <= 10) {
			fill(0, 150);
			ellipse(0, 0, 60, 60);
		}
		
		popMatrix();
		
		textSize(30);
		button(300, 300, 150, "Play!", "game", color(0, 50, 255), color(0));
		button(300, 500, 150, "Customize\ncharacter", "customize", color(0, 50, 255), color(0));
		
		fill(bossX >= 7 && bossX < 13 ? 255 : 0);
		textFont(boldFont, 100);
		text("CircLand", 300, 100);
		textFont(normalFont);
	}
	
	if (scene === "customize") {
		textSize(30);
		background(255);
		
		
		customTab(30, 200, 0);
		customTab(225, 200, 1);
		customTab(420, 200, 2);
		
		fill(0, 150, 0);
		ellipse(300, 600, 2000, 600);
		
		colorMode(HSB);
		var checkingCol = currentCustom === 0 ? 0 : (currentCustom === 1 ? character.mouthColHsb : character.bodyColHsb);
		if (currentCustom === 0) {
			if (eyeCustom === 0 && character.eyeCol1 !== character.eyeCol2) {
				checkingCol = [character.bothColHsb[0], character.bothColHsb[1], character.bothColHsb[2]];
			} else if (eyeCustom === 0 && character.eyeCol1 === character.eyeCol2) {
				checkingCol = [character.eyeCol1Hsb[0], character.eyeCol1Hsb[1], character.eyeCol1Hsb[2]];
			} else {
				checkingCol = [character["eyeCol" + eyeCustom + "Hsb"][0], character["eyeCol" + eyeCustom + "Hsb"][1], character["eyeCol" + eyeCustom + "Hsb"][2]];
			}
		}
		
		for (var i = 0; i < 255; i ++) {
			fill(i, checkingCol[1], checkingCol[2]);
			rect(i + 172.5, 450, 2, 30);
			fill(checkingCol[0], i, checkingCol[2]);
			rect(i + 172.5, 500, 2, 30);
			fill(checkingCol[0], checkingCol[1], i);
			rect(i + 172.5, 550, 2, 30);
		}

		
		var propertyCol = currentCustom === 0 ? 0 : (currentCustom === 1 ? "mouthCol" : "bodyCol");
		if (propertyCol === 0) {
			if (eyeCustom === 0) {
				propertyCol = "bothCol";
			} else {
				propertyCol = "eyeCol" + eyeCustom;
			}
		}

		var curCol;
		if (mouseIsPressed && mouseX > 172 && mouseX < 427 && startCustom) {
			var changeBoth = false;
			if (mouseY > 450 && mouseY < 480) {
				character[propertyCol + "Hsb"][0] = mouseX - 172;
				changeBoth = true;
			}
			if (mouseY > 500 && mouseY < 530) {
				character[propertyCol + "Hsb"][1] = mouseX - 172;
				changeBoth = true;
			}
			if (mouseY > 550 && mouseY < 580) {
				character[propertyCol + "Hsb"][2] = mouseX - 172;
				changeBoth = true;
			}
			checkingCol = character[propertyCol + "Hsb"];
			curCol = checkingCol;
			colorMode(RGB);
			character[propertyCol] = color(hsvToRgb(checkingCol[0], checkingCol[1], checkingCol[2])[0], hsvToRgb(checkingCol[0], checkingCol[1], checkingCol[2])[1], hsvToRgb(checkingCol[0], checkingCol[1], checkingCol[2])[2]);

			if (propertyCol === "bothCol" && changeBoth) {
				character.eyeCol1Hsb = character.bothColHsb;
				character.eyeCol2Hsb = character.bothColHsb;
				character.eyeCol1 = character.bothCol;
				character.eyeCol2 = character.bothCol;
			}
		}

		var curCol = character[propertyCol + "Hsb"];
		
		colorMode(RGB);
		
		var propertyX = currentCustom === 0 ? 0 : (currentCustom === 1 ? "mouthX" : null);
		if (propertyX === 0) {
			if (eyeCustom === 0) {
				propertyX = "bothX";
			} else {
				propertyX = "eye" + eyeCustom + "x";
			}
		}
		
		var propertyY = currentCustom === 0 ? 0 : (currentCustom === 1 ? "mouthY" : null);
		if (propertyY === 0) {
			if (eyeCustom === 0) {
				propertyY = "bothY";
			} else {
				propertyY = "eye" + eyeCustom + "y";
			}
		}
		
		if (propertyX !== null) {
			fill(155);
			ellipse(300, 400, 50, 50);
			fill(175);
			ellipse(300 + character[propertyX] * 5, 400 + character[propertyY] * 5, 10, 10);
			
			if (mouseIsPressed && dist(mouseX, mouseY, 300, 400) < 25 && startCustom) {
				character[propertyX] = (mouseX - 300)/5;
				character[propertyY] = (mouseY - 400)/5;
				if (propertyX === "bothX") {
					character.eye1x = character.bothX;
					character.eye2x = character.bothX;
					character.eye1y = character.bothY;
					character.eye2y = character.bothY;
				}
			}
		}
		
		
		if (currentCustom === 0) {
			strokeWeight(2);
			for (var i = 0; i < 3; i ++) {
				fill(220);
				stroke(150);
				if (mouseX > 225 + i * 50 && mouseX < 275 + i * 50 && mouseY > 330 && mouseY < 350) {
					fill(250);
					if (click) {
						eyeCustom = i;
					}
				}
				if (eyeCustom === i) {
					fill(150);
				}
				rect(225 + i * 50, 330, 50, 20, 20);
				noStroke();
				fill(i === 2 ? 0 : 255);
				ellipse(240 + i * 50, 340, 10, 10);
				fill(i === 1 ? 0 : 255);
				ellipse(260 + i * 50, 340, 10, 10);
			}
		}
		
		
		noFill();
		stroke(0, 150, 0);
		strokeWeight(12);
		rect(165.5, 445, 268, 40, 30);
		rect(165.5, 495, 268, 40, 30);
		rect(165.5, 545, 268, 40, 30);
		
		stroke(150);
		strokeWeight(3);
		line(172 + curCol[0], 445, 172 + curCol[0], 485);
		line(172 + curCol[1], 495, 172 + curCol[1], 535);
		line(172 + curCol[2], 545, 172 + curCol[2], 585);
		noStroke();
		
		
		
		fill(character.bodyCol);
		pushMatrix();
		translate(100 + pX, 100);
		scale(2);
		rotate(pX*2 - 40);
		ellipse(0, 0, 60, 60);
		fill(character.eyeCol1);
		ellipse(-10 + character.eye1x, -10 + character.eye1y, 10 + character.eye1s, 10 + character.eye1s);
		fill(character.eyeCol2);
		ellipse(10 + character.eye2x, -10 + character.eye2y, 10 + character.eye2s, 10 + character.eye2s);
		fill(character.mouthCol);
		ellipse(0 + character.mouthX, 10 + character.mouthY, 20 + character.mouthS, 20 + character.mouthS);
		popMatrix();
		
		button(60, 540, 100, "Done", "menu", color(0, 100, 200), color(0));
		button(540, 540, 100, "Reset", "reset", color(200, 0, 0), color(0));
		button(540, 440, 100, "Random", "random", color(52, 219, 61), color(0));
		
		if (scene === "reset") {
			character = Object.assign({}, classicCharacter);
			for (var i in character) {
				if (typeof(character[i]) === "object") {
					character[i] = Object.assign({}, classicCharacter[i]);
				}
			}
			scene = "customize";
		}
		
		if (scene === "random") {
		    randomSeed(randomCharacterSeed);
			for (var i in character) {
			    if (i.substr(i.length - 1) === "x" || i.substr(i.length - 1) === "X") {
			        var rot = random(360);
			        character[i] = cos(rot) * random(5);
			        character[i.substr(0, i.length - 1) + (i.substr(i.length - 1) === "x" ? "y" : "Y")] = sin(rot) * random(5);
			    }
			    if (i.includes("Col") && !i.includes("Hsb")) {
			        character[i] = color(random(255), random(255), random(255));
			        character[i + "Hsb"] = [hue(character[i]), saturation(character[i]), brightness(character[i])];
			    }
			}
			scene = "customize";
			randomSeed(1);
			randomCharacterSeed ++;
		}
		
		
		
		if (keys[LEFT]) {
			pX -= 4;
		}
		if (keys[RIGHT]) {
			pX += 4;
		}
		if (keys[32]) {
			pX = 200;
		}
		if (pX > 660) {
			pX = -150;
		}
		if (pX < -160) {
			pX = 650;
		}
		if (pX !== 200) {
			fill(0, 50);
			text("Press space to reset position", 300, 30);
		}
	}
	if (scene === "game") {
        
		if (bossX === 0) {
			background(lerpColor(color(255), color(255, 0, 0), constrain((pX - 5650)/3, 0, 255)/255));
		} else {
			background(levelInfo[bossX].bg);
		}
		pushMatrix();
        if ((cutscene < 10 || cutscene > 17) && bossX === 11 || bossX !== 11 && bossX !== 12 || bossX === 12) {
		    translate(constrain(-displayX + 300, -(levelInfo[bossX].end - 680), (cutscene === 19 && bossX === 11 ? -1500 : 50)) - (cutscene > 0 && cutscene < 11 && bossX === 11 ? cutsceneX : 0), -displayY + 300);
        } else  {
            translate(round(cutsceneX), round(cutsceneY));
        }
		// background(255);
		
		if (bossX === 3 || bossX === 4) {
			randomSeed(bossX - 2);
			for (var i = 0; i < 10000; i += random(50, 150)) {
				fill(100, 50, 0, 200);
				ellipse(i, 180 + (i > 1600 ? 200 : 0), 50, 350);
				fill(0, 100, 0, 230);
				ellipse(i, 5 + (i > 1600 ? 200 : 0), 200, 200);
			}
		}
		
		if (bossX === 5 || bossX === 6) {
			//   fill(255, 255, 155);
			//   ellipse((-constrain(-displayX + 300, -(levelInfo[bossX].end - 680), 50)) * 0.95 + 300, 300, 200, 200);
			image(sunImg, (-constrain(-displayX + 300, -(levelInfo[bossX].end - 680), 50)) * 0.95 + 300, 150);
		}
		
		if (bossX >= 7 && bossX <= 10) {
			image(moonImg, (-constrain(-displayX + 300, -(levelInfo[bossX].end - 680), 50)) * 0.98, -(-displayY + 300) * 0.98);
			image(moonOverlay, (-constrain(-displayX + 300, -(levelInfo[bossX].end - 680), 50)) * 0.98, -(-displayY + 300) * 0.98);
			// fill(15);
			// rect(displayX, displayY, 600, 600);
		}

        if (bossX === 13) {
            fill(255, 255, 0);
            ellipse(800, 200, 150, 150);
            fill(255, 0, 0);
            ellipse(constrain((pX - 800)/4 + 800, 780, 820), 225, 50, 50);
            fill(0);
            ellipse(constrain((pX - 800)/4 + 800 - 20, 760, 800), 175, 25, 25);
            ellipse(constrain((pX - 800)/4 + 800 + 20, 800, 840), 175, 25, 25);

            creditsCharacter(1200, 200, color(0, 155, 0), color(0), color(0), 175);
            creditsCharacter(1300, 200, color(0, 0, 255), color(0), color(255, 0, 0), 175);
            creditsCharacter(1600, 200, color(0, 155, 155), color(0, 0, 255), color(0, 255, 0), 25);
            creditsCharacter(1900, 100, color(50), color(205), color(205), 140);
            creditsCharacter(2300, 330, color(50, 100, 0), color(100, 150, 0), color(100, 150, 0), 310);
            creditsCharacter(2700, 270, color(250, 0, 0), color(250, 250, 0), color(50, 0, 0), 357);
            creditsCharacter(3400, 250, color(255, 0, 0), color(255), color(255), 130);
            creditsCharacter(3900, 270, color(255, 255, 0), color(0, 0, 200), color(0, 0, 200), 29);
            creditsCharacter(4700, 270 - min(sin(frameCount * 5) * 100, 0), color(0), color(255), color(0), 0);

            pushMatrix();
            scale(1, -1);
            creditsCharacter(3000, -100, color(225), color(0), color(0), 131);
            popMatrix();

            creditsCharacter(4300, 270, color(character.bodyCol), color(character.eyeCol1), color(character.mouthCol), 201);

            fill(255);
            stroke(100);
            ellipse(800, 375, 200, 200);
            ellipse(1250, 347, 250, 250);
            ellipse(1600, 355, 250, 250);
            ellipse(1900, 160, 60, 60);
            ellipse(3000, -230, 600, 600);
            ellipse(3400, 330, 100, 100);

            fill(0);
            textSize(30);
            textFont(normalFont, 30);

            textAlign(CENTER, BOTTOM);
            text("Game by:\nElectric Dolphin", 1250, min(sin(frameCount * 5 + 175) * 100, 0) + 160);
            text("Programming by:\nElectric Dolphin", 1600, min(sin(frameCount * 5 + 25) * 100, 0) + 160);
            text("Graphics by:\nElectric Dolphin", 1900, min(sin(frameCount * 5 + 140) * 100, 0) + 60);
            text("Writing by:\nElectric Dolphin", 2300, min(sin(frameCount * 5 + 310) * 100, 0) + 290);
            text("Playtested by:\nElectric Dolphin's brother\n(and Electric Dolphin)", 2700, min(sin(frameCount * 5 + 357) * 100, 0) + 230);
            text("Uh... the play button by:\nElectric Dolphin", 3400, min(sin(frameCount * 5 + 130) * 100, 0) + 210);
            text("Electric Dolphin by:\n[Insert my real name here]", 3900, min(sin(frameCount * 5 + 29) * 100, 0) + 230);
            text("Special thanks:\nYou\nThanks for playing", 4300, min(sin(frameCount * 5 + 201) * 100, 0) + 230);
            text("But something\nseems... off.", 4700, 230);

            textAlign(CENTER, TOP);
            text("debuggging by:\nElectric Dolphin", 3000, -min(sin(frameCount * 5 + 131) * 100, 0) + 140);
            textAlign(CENTER, CENTER);

            noStroke();
        }

        if (bossX === 14) {
            fill(255, 255, 0);
            ellipse(800, 200, 150, 150);
            fill(255, 0, 0);
            ellipse(constrain((pX - 800)/4 + 800, 780, 820), 225, 50, 50);
            fill(0);
            ellipse(constrain((pX - 800)/4 + 800 - 20, 760, 800), 175, 25, 25);
            ellipse(constrain((pX - 800)/4 + 800 + 20, 800, 840), 175, 25, 25);

            creditsCharacter(1200, 200, color(0, 155, 0), color(0), color(0), 175, 1);
            creditsCharacter(1300, 200, color(0, 0, 255), color(0), color(255, 0, 0), 175);
            creditsCharacter(1600, 200, color(0, 155, 155), color(0, 0, 255), color(0, 255, 0), 25);
            creditsCharacter(1900, 100, color(50), color(205), color(205), 140, 1);
            creditsCharacter(2300, 330, color(50, 100, 0), color(100, 150, 0), color(100, 150, 0), 310, 1);
            creditsCharacter(2700, 270, color(250, 0, 0), color(250, 250, 0), color(50, 0, 0), 357, 1);
            creditsCharacter(3400, 250, color(255, 0, 0), color(255), color(255), 130);
            creditsCharacter(3900, 270, color(255, 255, 0), color(0, 0, 200), color(0, 0, 200), 29);

            pushMatrix();
            scale(1, -1);
            creditsCharacter(3000, -100, color(225), color(0), color(0), 131);
            popMatrix();

            creditsCharacter(4300, 270, color(character.bodyCol), color(character.eyeCol1), color(character.mouthCol), 201);

            fill(255);
            stroke(100);
            ellipse(800, 375, 200, 200);
            ellipse(1250, 347, 250, 250);
            ellipse(1600, 355, 250, 250);
            ellipse(1900, 160, 60, 60);
            ellipse(3000, -230, 600, 600);
            ellipse(3400, 330, 100, 100);

            fill(0);
            textSize(30);
            textFont(normalFont, 30);

            textAlign(CENTER, BOTTOM);
            text("Game by:\nElectric Dolphin", 1250, min(sin(frameCount * 5 + 175) * 100, 0) + 160);
            text("Programming by:\nElectric Dolphin", 1600, min(sin(frameCount * 5 + 25) * 100, 0) + 160);
            text("Graphics by:\nElectric Dolphin", 1900, min(sin(frameCount * 5 + 140) * 100, 0) + 60);
            text("Writing by:\nElectric Dolphin", 2300, min(sin(frameCount * 5 + 310) * 100, 0) + 290);
            text("Playtested by:\nElectric Dolphin's brother\n(and Electric Dolphin)", 2700, min(sin(frameCount * 5 + 357) * 100, 0) + 230);
            text("Uh... the play button by:\nElectric Dolphin", 3400, min(sin(frameCount * 5 + 130) * 100, 0) + 210);
            text("Electric Dolphin by:\n[Insert my real name here]", 3900, min(sin(frameCount * 5 + 29) * 100, 0) + 230);
            text("Special thanks:\nYou\nThanks for playing", 4300, min(sin(frameCount * 5 + 201) * 100, 0) + 230);

            textAlign(CENTER, TOP);
            text("debuggging by:\nElectric Dolphin", 3000, -min(sin(frameCount * 5 + 131) * 100, 0) + 140);
            textAlign(CENTER, CENTER);

            noStroke();
        }
		
		strokeWeight(1);
		for (var i = 0; i < circles.length; i ++) {
			circles[i].draw();
			circles[i].update();
		}
		for (var i = 0; i < rects.length; i ++) {
			rects[i].draw();
		}

		if (bossX === 7 || bossX === 10) {
			fill(0, 20, 0);
			ellipse(200, 700, 800, 800);
		}

		for (var i = 0; i < lRects.length; i ++) {
			lRects[i].draw();
		}
		for (var i = 0; i < particles.length; i ++) {
			particles[i].draw();
			if (particles[i].life <= 0) {
				particles.splice(i, 1);
				i --;
			}
		}
		for (var i = 0; i < fireballs.length; i ++) {
			fireballs[i].draw();
			if (fireballs[i].x < pX - 400 && bossX !== 11 || bossX === 11 && (fireballs[i].x < 1900 || fireballs[i].y > 400 && bossX === 11) || fireballs[i].y > 5300) {
				fireballs.splice(i, 1);
				i --;
			}
		}
		
		if (bossX === 6) {
			fill(0, 50, 0);
			ellipse(1700, 700, 800, 800);
		}
		displayY2 = displayY;
		displayX = pX;
		displayY = pY;
		
        if (!(bossX === 11 && pX >= 2700) && cutscene !== 15 && bossX !== 12 || cutscene === 14 || cutscene > 17 || bossX === 12 && pX < 4000) {
            if (keys[LEFT] || keys[65]  || dist((mouseX - 120)*80/200 + 120, mouseY, 120, 550) < 40 && mouseX < 120 && mobile && mouseIsPressed) {
                xVel = constrain(xVel - 0.25, -5, 5);
            }
            if (keys[RIGHT] || keys[68] || dist((mouseX - 120)*80/200 + 120, mouseY, 120, 550) < 40 && mouseX > 120 && mobile && mouseIsPressed) {
                xVel = constrain(xVel + 0.25, -5, 5);
            }
            if ((keys[UP] || keys[87] || dist(mouseX, mouseY, 550, 550) < 40 && mobile && mouseIsPressed) && canJump > 0) {
                yVel = -7.5;
                canJump = 0;
            }
        } else {
            if (bossX === 11) {
                if (cutscene !== 15) {
                    pX = 2700;
                }
                xVel = 0;
                if (cutscene === 0) {
                    cutsceneVar ++;
                    if (cutsceneVar > 60) {
                        cutsceneVar = 0;
                        cutscene = 1;
                    }
                }
                if (cutscene === 1) {
                    cutsceneVar ++;
                    cutsceneX += 2;
                    if (cutsceneVar > 100) {
                        cutscene = 2;
                        cutsceneVar = 0;
                    }
                }
                if (cutscene === 2) {
                    cutsceneVar ++;
                    if (cutsceneVar > 90) {
                        cutscene = 3;
                        cutsceneVar = 0;
                    }
                }
                if (cutscene >= 3 && cutscene < 7) {
                    cutsceneVar ++;
                    if (cutsceneVar > 180) {
                        cutscene ++;
                        cutsceneVar = 0;
                        if (cutscene === bossDialogue[bossDeaths].length + 3) {
                            cutscene = 7;
                        }
                    }
                }
            } else {
                pX = 4000;
                xVel = 0;
                if (cutscene === 0) {
                    cutsceneVar ++;
                    cutsceneX = -pX + 300;
                    cutsceneY = -pY + 300;
                    if (cutsceneVar > 60) {
                        cutscene ++;
                    }
                }
                if (cutscene >= 1 && cutscene < 14) {
                    cutsceneVar ++;
                    fill(255);
                    textSize(20);
                    text(secretDialogue[bossDeaths][cutscene - 1], pX, pY - 100);
                    if (cutsceneVar > 180) {
                        cutscene ++;
                        if (cutscene > secretDialogue[bossDeaths].length) {
                            cutscene = 14;
                        }
                        cutsceneVar = 0;
                    }
                }
                fill(255);
                if (cutscene === 5) {
                    rect(pX + 200, pY  - 20 - min(cutsceneVar, 25 - max(cutsceneVar - 155, 0)), 25, min(cutsceneVar, 25 - max(cutsceneVar - 155, 0)));
                }
                if (cutscene === 6) {
                    ellipseMode(CORNER);
                    ellipse(pX + 200, pY  - 20 - min(cutsceneVar, 25 - max(cutsceneVar - 155, 0)), 25, min(cutsceneVar, 25 - max(cutsceneVar - 155, 0)));
                    ellipseMode(CENTER);
                }
                if (cutscene === 12) {
                    ellipseMode(CORNER);
                    ellipse(pX + 200, pY  - 45, 25, 25);
                    ellipseMode(CENTER);
                    fill(0);
                    triangle(pX + 175, pY - 50 - min(cutsceneVar, 50), pX + 275, pY - 50 - min(cutsceneVar, 50), pX + 175, pY + 40 - min(cutsceneVar, 50));
                    fill(255);
                    if (cutsceneVar > 80) {
                        beginShape();
                        vertex(pX + 180, pY);
                        vertex(pX + 180, pY + 10);
                        bezierVertex(pX + 200, pY + 10, pX + 225, pY, pX + 240, pY - 20);
                        endShape();
                        fill(0);
                        rect(pX + 175, pY - 20, 70, 30 - min(30, cutsceneVar - 80));
                    }
                }
                if (cutscene === 13) {
                    ellipseMode(CORNER);
                    ellipse(pX + 200, pY  - 45, 25, 25);
                    ellipseMode(CENTER);
                    fill(255);
                    beginShape();
                    vertex(pX + 180, pY);
                    vertex(pX + 180, pY + 10);
                    bezierVertex(pX + 200, pY + 10, pX + 225, pY, pX + 240, pY - 20);
                    endShape();
                    fill(0);
                    triangle(pX + 175, pY - 100, pX + 275, pY - 100, pX + 175, pY - 10);
                }
                if (true) {
                    cutsceneVar += 4;
                }
            }
        }

        if (bossX === 11) {
            if (cutscene === 7) {
                fill(255);
                rect(2960, 240 - min(cutsceneVar/2 - 10, 25), 25, constrain(cutsceneVar/2 - 10, 0, 25));
                cutsceneVar ++;
                if (cutsceneVar > 90) {
                    cutscene ++;
                    cutsceneVar = 0;
                }
            }
            if (cutscene === 8) {
                fill(lerpColor(color(0), color(0, 155, 0), min(cutsceneVar/60, 1)));
                rect(2950, 200, 100, 100);
                fill(lerpColor(color(0), color(155, 155, 0), min(cutsceneVar/60, 1)));
                rect(2940, 180, 120, 20);
                rect(2940, 140, 20, 40);
                rect(2973, 140, 20, 40);
                rect(3007, 140, 20, 40);
                rect(3040, 140, 20, 40);
                fill(255);
                rect(2960, 215, 25, 25);
                cutsceneVar ++;
                if (cutsceneVar > 120) {
                    cutscene ++;
                    cutsceneVar = 0;
                }
            }
            if (cutscene === 9) {
                fill(0, 155, 0);
                rect(2950, 200, 100, 100);
                fill(155, 155, 0);
                rect(2940, 180, 120, 20);
                rect(2940, 140, 20, 40);
                rect(2973, 140, 20, 40);
                rect(3007, 140, 20, 40);
                rect(3040, 140, 20, 40);
                fill(255);
                rect(2960, 215, 25, 25);
                fill(255, cutsceneVar * 255/60);
                rect(2950, 260, 75, 20);
                // rect(3005, 240, 20, 20);
                cutsceneVar ++;
                if (cutsceneVar > 120) {
                    cutscene ++;
                    cutsceneVar = 0;
                    cutsceneX = constrain(-displayX + 300, -(levelInfo[bossX].end - 680), 50) - (cutscene > 0 && cutscene < 11 ? cutsceneX : 0);
                    cutsceneY = -displayY + 300;
                }
            }
            if (cutscene >= 10) {
                fill(0, 155, 0);
                rect(2950, 200, 100, 100);
                fill(155, 155, 0);
                rect(2940, 180, 120, 20);
                rect(2940, 140, 20, 41);
                rect(2973, 140, 20, 41);
                rect(3007, 140, 20, 41);
                rect(3040, 140, 20, 41);
                fill(255);
                rect(2960, 215, 25, 25);
                fill(255);
                rect(2950, 260, 75, 20);
            }
            if (cutscene === 10) {
                cutsceneX = map(cutsceneVar, 100, 0, -2200, constrain(-displayX + 300, -(levelInfo[bossX].end - 680), 50) - 200);
                cutsceneY = map(cutsceneVar, 100, 0, 250, -displayY + 300);
                cutsceneVar ++;

                if (cutsceneVar >= 100) {
                    cutscene ++;
                    cutsceneVar = 0;
                }
            }
            if (cutscene === 11) {
                cutsceneX = -2200;
                cutsceneY = 250;
                cutsceneVar ++;
                if (cutsceneVar > 60) {
                    cutscene ++;
                    cutsceneVar = 0;
                }

            }
            if (cutscene === 12) {
                rects.push(new rectangle(2150, -1000, 100, 2000, color(50)));
                rects.push(new rectangle(2750, -1000, 100, 2000, color(50)));
                circles.push(new circle(2500, 1000, 1500, color(0, 0, 0), color(255)));
                cutscene ++;
            }
            if (cutscene === 13) {
                cutsceneVar ++;
                if (cutsceneVar >= 60) {
                    cutscene ++;
                    cutsceneVar = 0;
                }
            }
            if (cutscene === 14) {
                cutsceneVar ++;
                if (bossStage === 7 && cutsceneVar === 500) {
                    fireballs.push(new fireball(3000, pY));
                }
                if (cutsceneVar >= 900 || cutsceneVar >= 300 && bossStage === 5) {
                    cutscene = 15;
                    if (bossDialogue[3][bossStage].length !== 0) {
                        fireballs = [];
                        particles = [];
                    }
                    cutsceneVar = 0;
                }
            }
            if (cutscene === 15) {
                cutsceneX = -2500;
                fill(255);
                textFont(boldFont, 20);
                text(bossDialogue[3][bossStage][floor(cutsceneVar/180)], 2900, -150, 200, 600);
                cutsceneVar ++;
                if (bossStage === 2) {
                    if (pX > 2500) {
                        pX = 2700;
                    } else {
                        pX = 2300;
                    }
                }
                if (bossStage === 3) {
                    lRects = [];
                }
                if (cutsceneVar >= bossDialogue[3][bossStage].length * 180) {
                    if (bossStage < 7) {
                        cutscene = 14;
                    } else {
                        cutscene ++;
                        cutsceneX = -2500;
                    }
                    if (bossStage === 0) {
                        fireballRate = 60;
                        rects.push(new rectangle(2450, -1000, 100, 1150, color(50)));
                    }
                    if (bossStage === 1) {
                        fireballRate = 35;
                        rects.splice(rects.length - 1, 1);
                    }
                    if (bossStage === 2) {
                        fireballRate = 60;
                        lRects.push(new lRect(2480, 170, 40, 40, color(50), color(255, 0), 600, 1));
                    }
                    if (bossStage === 5) {
                        fireballRate = 120;
                    }
                    if (bossStage === 6) {
                        fireballRate = 99999;
                    }
                    bossStage ++;
                    cutsceneX = -2200;
                    cutsceneVar = 0;
                }
            }
            if (cutscene === 16) {
                cutsceneX = -2500;
                cutsceneVar ++;
                fill(0, 155, 0);
                rect(2960, 230, 25, 10);
                fill(0);
                stroke(255);
                ellipse(constrain((cutsceneVar - 60) * 24, 10, 100) + 2900, 200, constrain((cutsceneVar - 60) * 48, 10, 200), 300);
                noStroke();
                if (cutsceneVar >= 120) {
                    cutscene ++;
                    cutsceneVar = 0;
                }
            }
            if (cutscene > 16) {
                fill(0);
                stroke(255);
                ellipse(3000, 200, 200, 300);
                noStroke();
            }
            if (cutscene === 17) {
                cutsceneX = map(cutsceneVar, 100, 0, constrain(-displayX + 300, -(levelInfo[bossX].end - 680), 50), -2500);
                cutsceneY = map(cutsceneVar, 100, 0, -displayY + 300, 250);
                cutsceneVar ++;
                if (cutsceneVar > 100) {
                    cutscene ++;
                    cutsceneVar = 0;
                }
            }
            if (cutscene === 18) {
                cutsceneVar ++;
                if (cutsceneVar > 60) {
                    cutscene ++;
                }
            }
            if (cutscene === 19) {
                rects = [];
                fill(255);
                textFont(normalFont, 20);
                text("Exit to your left.\nI'll destroy the rectangle kingdom.", 2500, 100);
                text("Your OTHER left.", 6000, 100);
                text("...", 7200, 100);
                text("You sure you wanna go this way?", 8400, 100);
                text("Because if you continue, you won't like it...", 9600, 100);
                text("Well. Guess it's time for the big reveal.", 10800, 100);
                
            }
            if (cutscene !== 14 && true && cutscene > 1) {
                cutsceneVar += 4;
            }
        }
        if (bossX === 12) {
            if (cutscene === 14) {
                cutsceneVar ++;
                if (bossStage === 0 && bossDeaths === 0 && cutsceneVar < 64) {
                    fireballRate = 40;
                    fill(255, 255 - cutsceneVar * 4);
                    ellipseMode(CORNER);
                    ellipse(4200, 4175, 25, 25);
                    ellipseMode(CENTER);
                    beginShape();
                    vertex(4180, 4220);
                    vertex(4180, 4230);
                    bezierVertex(4200, 4230, 4225, 4220, 4240, 4200);
                    endShape();
                    fill(0);
                    triangle(4175, 4120, 4275, 4120, 4175, 4210);
                }
                if (bossStage === 11 && cutsceneVar > 450) {
                        fill(255, (cutsceneVar - 450) * 4);
                        ellipseMode(CORNER);
                        ellipse(4250, 4175, 25, 25);
                        ellipseMode(CENTER);
                        beginShape();
                        vertex(4230, 4220);
                        vertex(4230, 4230);
                        bezierVertex(4250, 4230, 4275, 4220, 4290, 4200);
                        endShape();
                        fill(0);
                        triangle(4225, 4120, 4325, 4120, 4225, 4210);
                }
                if (bossStage > 0 && cutsceneVar < secretDialogue[5][bossStage - 1].length * 150) {
                    fill(255);
                    textSize(20);
                    text(secretDialogue[5][bossStage - 1][floor(cutsceneVar/150)], pX - 200, pY - 300, 400, 400);
                }
                if (cutsceneVar > 900 && bossStage < 11) {
                    bossStage ++;
                    cutsceneVar = 0;
                    if (bossStage === 1) {
                        fireballRate = 20;
                    }
                    if (bossStage === 2) {
                        fireballRate = 35;
                    }
                    if (bossStage === 3) {
                        fireballRate = 30;
                    }
                    if (bossStage === 4) {
                        fireballRate = 45;
                    }
                    if (bossStage === 6) {
                        fireballRate = 999999;
                    }
                    if (bossStage === 9) {
                        fireballRate = 25;
                    }
                    if (bossStage === 10) {
                        fireballRate = 15;
                    }
                    if (bossStage === 11) {
                        fireballRate = 999999;
                        rects.splice(rects.length - 6, 6);
                    }
                }
                if (bossStage === 6 && cutsceneVar === 150) {
                    circles.push(new circle(3850, 4150, 20, color(0), color(255)));
                    circles.push(new circle(4150, 4150, 20, color(0), color(255)));
                    circles.push(new circle(3850, 4000, 20, color(0), color(255)));
                    circles.push(new circle(4150, 4000, 20, color(0), color(255)));
                    circles.push(new circle(3850, 3850, 20, color(0), color(255)));
                    circles.push(new circle(4150, 3850, 20, color(0), color(255)));
                }
                if (bossStage === 6 && cutsceneVar === 310) {
                    circles.splice(circles.length - 6, 6);
                    rects.push(new rectangle(3840, 4140, 20, 20, color(0), color(255)));
                    rects.push(new rectangle(4140, 4140, 20, 20, color(0), color(255)));
                    rects.push(new rectangle(3840, 3990, 20, 20, color(0), color(255)));
                    rects.push(new rectangle(4140, 3990, 20, 20, color(0), color(255)));
                    rects.push(new rectangle(3840, 3840, 20, 20, color(0), color(255)));
                    rects.push(new rectangle(4140, 3840, 20, 20, color(0), color(255)));
                }
                if (bossStage === 7 && cutsceneVar === 450) {
                    fireballRate = 35;
                }
                if (bossStage === 11 && fireballs.length === 0) {
                    if (pX < 3950) {
                        xVel = 4;
                    }
                    if (pX > 4050) {
                        xVel = -4;
                    }
                    if (pY < 4150) {
                        yVel = 5;
                    }
                    if (cutsceneVar === 750) {
                        rects.push(new rectangle(3800, 3800, 50, 1000, color(100)));
                        rects.push(new rectangle(4150, 3800, 50, 1000, color(100)));
                        rects.push(new rectangle(3800, 4000, 400, 50, color(100)));
                    }
                    if (cutsceneVar > 810 && cutsceneVar < 1100) {
                        rects[0].x += 0.1;
                        rects[1].x -= 0.1;
                        rects[2].y += 0.1;
                    }
                    if (cutsceneVar >= 1100) {
                        stroke(255);
                        if (!easy) {
                            rect(4200, 4125, max(cutsceneVar - 1160, 0.5) * 20, 150);
                        } else {
                            ellipse(4200 + constrain(cutsceneVar - 1160, 0.5, 10) * 10, 4200, constrain(cutsceneVar - 1160, 0.5, 10) * 20, 150);
                        }
                        noStroke();
                    }
                    if (cutsceneVar > 1250 && cutsceneVar < 1430) {
                        if (easy) {
                            scene = "transition";
                            getTransitionImg = true;
                            ezSecret = true;
                        } else {
                            textFont(boldFont, 20);
                            fill(255);
                            text("Circle? You there?", 3800, 4200);
                        }
                    }
                    if (cutsceneVar >= 1430) {
                        pushMatrix();
                        translate(min((cutsceneVar - 1430) * 2 - 100, 50), -50);
                        fill(0, 155, 0);
                        rect(3650, 4200, 100, 100);
                        fill(155, 155, 0);
                        rect(3640, 4180, 120, 20);
                        rect(3640, 4140, 20, 41);
                        rect(3673, 4140, 20, 41);
                        rect(3707, 4140, 20, 41);
                        rect(3740, 4140, 20, 41);
                        fill(255);
                        rect(3715, 4215, 25, 25);
                        fill(255);
                        rect(3675, 4260, 75, 20);
                        if (cutsceneVar >= 1730) {
                            rect(3675, 4235, 20, 25);
                        }
                        popMatrix();
                    }
                    if (cutsceneVar > 1550 && cutsceneVar < 1730) {
                        textFont(boldFont, 20);
                        fill(255);
                        text("Winston and I were\ndiscussing stuff, like peace.", 3820, 4100);
                    }
                    if (cutsceneVar > 1910 && cutsceneVar < 2090) {
                        textFont(boldFont, 20);
                        fill(255);
                        text("Circles and rectangles\nare friends again.", 3800, 4100);
                    }
                    if (cutsceneVar > 2090 && cutsceneVar < 2270) {
                        textFont(boldFont, 20);
                        fill(255);
                        text("Come on.\nLet's get you home.", 3800, 4100);
                    }
                    if (cutsceneVar === 2270) {
                        scene = "transition";
                        getTransitionImg = true;
                    }
                }
            }
        }

		
		yVel += 0.2;
		if (xVel < -0.1) {
			xVel += 0.1;
		}
		if (xVel > 0.1) {
			xVel -= 0.1;
		}
		if (xVel >= -0.1 && xVel <= 0.1) {
			xVel = 0;
		}
		pY += yVel;
		pY = round(pY);
		pX += xVel;
		if (pX < -20) {
			pX = -20;
			xVel = 0;
		}
		canJump = canJump - (canJump > 0 ? 1 : 0);
		
		
		pushMatrix();
		translate(displayX, displayY);
		rotate(displayX*2 - 40);
		
		fill(character.bodyCol);
		ellipse(0, 0, 60, 60);
		fill(character.eyeCol1);
		ellipse(-10 + character.eye1x, -10 + character.eye1y, 10 + character.eye1s, 10 + character.eye1s);
		fill(character.eyeCol2);
		ellipse(10 + character.eye2x, -10 + character.eye2y, 10 + character.eye2s, 10 + character.eye2s);
		fill(character.mouthCol);
		ellipse(0 + character.mouthX, 10 + character.mouthY, 20 + character.mouthS, 20 + character.mouthS);
		
		if (bossX === 5 || bossX === 6) {
			fill(0, 50);
			ellipse(0, 0, 60, 60);
		}
		if (bossX >= 7 && bossX <= 10) {
			fill(0, 150);
			ellipse(0, 0, 60, 60);
			if (frameCount % (easy ? 360 : 180) === 0 && pX > 1150 && bossX === 7 || frameCount % (easy ? 120 : 60) === 0 && pX > 1700 && bossX === 8 || frameCount % (easy ? 180 : 90) === 0 && pX > 300 && bossX === 9 || frameCount % (easy ? 90 : 45) === 0 && pX > 300 && bossX === 10) {
				fireballs.push(new fireball(pX + 600, random(pY - 250, pY + 250) - yVel*25));
			}
		}
        if (bossX === 11 && cutscene === 14 && frameCount % (fireballRate * (easy ? 2 : 1)) === 0) {
            fireballs.push(new fireball(3000, random(50, 250)));
        }
        if (bossX === 12 && cutscene === 14 && frameCount % (fireballRate * (easy ? 2 : 1)) === 0 && bossStage !== 1) {
            fireballs.push(new fireball(pX + 400, random(pY - 150, pY + 150)));
        }
        if (bossX === 11 && (bossStage >= 4 && bossStage <= 6) && frameCount % floor(fireballRate/(easy ? 1 : 2)) === 0 && cutscene === 14) {
            fireballs.push(new vertFireball(random(2200, 2770), -500));
        }
        if (bossX === 12 && (bossStage === 1 || bossStage === 4 || bossStage === 5 || bossStage === 8) && frameCount % (fireballRate * (easy ? 2 : 1)) === 0 && cutscene === 14) {
            fireballs.push(new vertFireball(random(pX - 200, pX + 200), pY - 400));
        }
		popMatrix();
		
		
		
		fill(0);
		textSize(20);
		if (bossX === 0) {
			text("Welcome to circLand!", 200, 200);
			text("In this world, everything is a circle!", 1200, 100);
			text("Don't fall!", 2250, 1000);
			text("A leap of faith...", 2650, 750);
			text("Nice!", 3550, 2350);
			text("CircLand was a peaceful place.", 4550, 2350);
			text("That was until...", 5650, 2350);
			text("The rectangles attacked!", 6175, 2550);
		}
		if (bossX === 1) {
			text("They destroyed everything.", 200, 200);
			text("They stole all the valuables.", 800, 200);
			text("They even kidnapped King Winston.", 1400, 200);
			text("Nobody knows why they did it.", 2400, 200);
			text("But something's telling you...", 3200, 200);
			fill(143, 0, 0);
			textFont(boldFont, 20);
			text("You must end this.", 4200, 1500);
			textFont(normalFont, 20);
		}
		if (bossX === 2) {
			text("You must get to the rectangle kingdom\nand end this once and for all.", 200, 200);
			text("Looks like CircLand's exit is heavily guarded.", 2000, 575);
			text("The secret overpass.\nIntended for situations like this.", 2400, -300);
			text("Jump down. Just trust me.", 3800, -300);
			text("Thanks for trusting me.", 4500, 1500);
			text("We made it out of CircLand.\nNow on to the rectangle kingdom.", 5500, 1500);
			
			textFont(boldFont, 20);
			text("Don't let that stop you.", 2000, 600);
			textFont(normalFont, 20);
		}
		if (bossX === 3) {
			text("We're out. This is the circle forest.", 200, 200);
			text("Careful though, there are still rectangles here.\nJust not as many.", 1000, 200);
			text("There's a rectangle!", 2000, 400);
			text("These rectangles can disguise themselves.\nI will highlight them occasionally.", 2500, 400);
			text("Wait, stop!", 3600, 400);
			text("Yay you did it.\nCongrats, gg, etc", 4500, 400);
		}
		if (bossX === 4) {
			text("We're not out of the woods yet!\n(Pun intended)", 200, 200);
			text("We are getting closer though...", 1000, 200);
			text("So close yet so far...", 1500, 400);
			text("In my universe you can't walk on clouds...", 370, -300);
			text("Oh yeah, I come from another universe.\nCan anyone in your universe telepathically\ncommunicate with you?", 370, -800);
			text("Now's your chance.\nJump, and don't let go of right.", 1220, -800);
			text("Good job!", 2000, 400);
			text("...", 3000, 400);
			text("So, what's your name?", 4000, 400);
			text("...", 5000, 400);
			text("It's fine. I can read your thoughts.", 6000, 400);
			text("I should introduce myself.", 7000, 400);
			text("My name is VGhlIFJ1bGVy.", 8000, 400);
			text("That name means nothing to you, but for me...", 9000, 400);
		}
		if (bossX === 5) {
			text("The great plains. The halfway point.", 300, 200);
			text("By now the rectangles have been alerted about you.\nYou'll start seeing more of them soon...", 1500, 200);
			text("Watch out!", 2500, 200);
			text("You'll have to be careful about those guys.", 3500, 200);
			text("I have a feeling we'll see a lot more of them later...", 5500, 200);
		}
		if (bossX === 6) {
			text("I've got good news and I've got bad news.", 300, 200);
			text("Good news: You're almost there!", 1000, 200);
			text("Bad news: The rectangles realized that\nthis doesn't have to be a balanced game.", 1800, 200);
			text("(Oops, I broke the fourth\nwall again, haven't I?)\n\nAnyway, I spawned in some\ncircles to give you a chance.", 2200, 200);
			text("Are you enjoying this repetitive gameplay?\nBecause I'm not", 3300, 200);
			text("That's more like it!", 4200, -200);
			text("How's your eyesight?", 4800, -200);
			text("I ran out of ideas, and you're\nextremely close to the\nrectangle kingdom anyway.", 5400, -400);
		}
		if (bossX === 7) {
			fill(255);
			text("Here we are. The rectangle kingdom.", 300, 200);
			text("Watch out for fireballs!", 1175, 0);
			text("How are you liking these precise jumps?", 1920, -200);
			text("I know that you can respawn\nso you'll eventually pass the jumps.", 2350, 90);
			text("I just don't want you to get bored\nwhile saving the world and stuff.", 2850, -250);
			text("The power of neo jumps", 3250, -820);
		}
		if (bossX === 8) {
			fill(255);
			text("Looks like we found the village.\nDoesn't seem like the residents are too happy...", 300, 200);
			text("They set up some defenses.\nYou must get past.", 1300, -200);
			text("Remember the fireballs?\nThe rectangle mages aren't\nholding back anymore...", 1800, -200);
			text("Jump, and don't let go of right. (Part 2)", 2150, -2000);
		}
		if (bossX === 9) {
			fill(255);
			text("We made it to the circular clearing!\nWe're close to the castle, where the rectangle king lives.", 300, 200);
		}
		if (bossX === 10) {
			fill(255);
			text("This is it. The rectangles are giving all they've got.\nSurvive this and you'll get to the castle.", 300, 200);
            text("Almost there!", 3200, -140);
		}
        if (bossX === 11) {
            textFont(boldFont, 20);
            fill(255);
            text(bossDialogue[bossDeaths][cutscene - 3], 2800, -150, 400, 600);
        }
        if (bossX === 12) {
            textFont(normalFont, 20);
            fill(255);
            text("RG9uJ3QgZmFsbCE=", 1600, 5000);
            text("SG93IGFyZSB5b3UgbGlraW5nIHRoZXNlIHByZWNpc2UganVtcHM/", 2200, 4200);
            text("VGhlIHBvd2VyIG9mIG5lbyBqdW1wcw==", 2800, 3700);
        }
        if (bossX === 13) {
			fill(0);
            textSize(50);
			text("THE\nEND", 300, 100);
		}
        if (bossX === 14) {
			fill(0);
            textSize(50);
			text("THE TRUE\nENDING", 300, 100);
		}

		stroke(209, 0, 0);
		for (var i = pX - 300 - pX % 50; i < pX + 600 + pX % 50; i += 50) {
			line(i + 20, 5060, i + 50, 5060);
		}
		noStroke();
		popMatrix();
		if (bossX < 7) {
			fill(0, introTime);
		} else {
			fill(255, introTime);
		}
		textFont(boldFont, 30);
		text("Level " + (bossX + 1) + ": " + levelInfo[bossX].name, 300, 50);
		introTime -= 2;
		textFont(normalFont);
		
		if (displayY2 > 5000) {
			die();
		}
		
		if (pX > levelInfo[bossX].end) {
			scene = "transition";
			transitionImg = get();
			pX = 200;
			pY = 200;
			xVel = 0;
			yVel = 0;
            cutscene = 0;
			bossX ++;
			introTime = 500;
		}
        if (pX < 1200 && cutscene === 19 && bossX === 11) {
			scene = "transition";
			transitionImg = get();
			pX = 200;
			pY = 200;
			xVel = 0;
			yVel = 0;
			bossX += 2;
			introTime = 0;
			circles = [];
			rects = [];
			lRects = [];
			for (var i in circArray[bossX]) {
				var circ = circArray[bossX][i];
				circles.push(new circle(circ[0], circ[1], circ[2], circ[3], circ[4]));
			}
			
			for (var i in rectArray[bossX]) {
				var rec = rectArray[bossX][i];
				rects.push(new rectangle(rec[0], rec[1], rec[2], rec[3], rec[4], rec[5]));
			}
			
			for (var i in lRectArray[bossX]) {
				var rec = lRectArray[bossX][i];
				lRects.push(new lRect(rec[0], rec[1], rec[2], rec[3], rec[4], rec[5], rec[6], rec[7], rec[8]));
			}
		}

        if (mobile) {
            fill(155, 100, 0, 100);
            ellipse(120, 550, 200, 80);
            ellipse(550, 550, 80, 80);
            fill(200, 145, 45);
            arc(80, 550, 50, 30, 90, 270);
            arc(160, 550, 50, 30, 270, 450);
            arc(550, 562, 30, 50, 180, 360);
        }
		
		if (getTransitionImg) {
            if (bossX === 12 && scene === "die") {
                background(0);
                secretDead = true;
            }
			transitionImg = get(0, 0, 600, 600);
			pX = spawnX;
			pY = spawnY;
			displayX = pX;
			displayY = pY;
			displayY2 = displayY;
			xVel = 0;
			yVel = 0;
			getTransitionImg = false;
		}
		
		collided = false;
		
	}
	if (scene === "transition") {
		image(transitionImg, 0, 0);
		fill(255, transitionTime * 2 - 120);
		noStroke();
		rect(0, 0, width, height);
		transitionTime ++;
		if (transitionTime > 300) {
            if (bossX === 12 && cutscene === 14) {
                if (!easy) {
                    bossX = 14;
                } else {
                    bossX = 13;
                }
            }
			transitionTime = 0;
            cutsceneVar = 0;
			scene = "game";
			levelMilliseconds = 0;
            levelSeconds = 0;
            levelMinutes = 0;
			fireballs = [];
			particles = [];
            bossDeaths = 0;
            bossStage = 0;
            circles = [];
            rects = [];
            lRects = [];
            for (var i in circArray[bossX]) {
                var circ = circArray[bossX][i];
                circles.push(new circle(circ[0], circ[1], circ[2], circ[3], circ[4]));
            }
            
            for (var i in rectArray[bossX]) {
                var rec = rectArray[bossX][i];
                rects.push(new rectangle(rec[0], rec[1], rec[2], rec[3], rec[4], rec[5]));
            }
            
            for (var i in lRectArray[bossX]) {
                var rec = lRectArray[bossX][i];
                lRects.push(new lRect(rec[0], rec[1], rec[2], rec[3], rec[4], rec[5], rec[6], rec[7], rec[8]));
            }
            if (bossX === 14 && cutscene === 0 || bossX === 15) {
                if (bossX === 14 && !ezSecret) {
                    scene = "menu";
                } else {
                    scene = "end";
                }
                bossX = 0;
                circles = [];
                rects = [];
                lRects = [];
                for (var i in circArray[bossX]) {
                    var circ = circArray[bossX][i];
                    circles.push(new circle(circ[0], circ[1], circ[2], circ[3], circ[4]));
                }
                
                for (var i in rectArray[bossX]) {
                    var rec = rectArray[bossX][i];
                    rects.push(new rectangle(rec[0], rec[1], rec[2], rec[3], rec[4], rec[5]));
                }
                
                for (var i in lRectArray[bossX]) {
                    var rec = lRectArray[bossX][i];
                    lRects.push(new lRect(rec[0], rec[1], rec[2], rec[3], rec[4], rec[5], rec[6], rec[7], rec[8]));
                }
            }
		}
	}
	if (scene === "die") {
		image(transitionImg, 0, 0);
		transitionTime ++;
		fill(200, 0, 0, transitionTime * 2 - 60);
		noStroke();
		rect(0, 0, width, height);
		if (transitionTime > 180) {
			transitionTime = 0;
			scene = "game";
			introTime = 0;
			fireballs = [];
			particles = [];
            if (bossX === 11 || bossX === 12) {
                circles = [];
                rects = [];
                lRects = [];
                for (var i in circArray[bossX]) {
                    var circ = circArray[bossX][i];
                    circles.push(new circle(circ[0], circ[1], circ[2], circ[3], circ[4]));
                }
                
                for (var i in rectArray[bossX]) {
                    var rec = rectArray[bossX][i];
                    rects.push(new rectangle(rec[0], rec[1], rec[2], rec[3], rec[4], rec[5]));
                }
                
                for (var i in lRectArray[bossX]) {
                    var rec = lRectArray[bossX][i];
                    lRects.push(new lRect(rec[0], rec[1], rec[2], rec[3], rec[4], rec[5], rec[6], rec[7], rec[8]));
                }
                if (cutscene === 14) {
                    bossDeaths ++;
                }
                cutscene = 0;
                cutsceneVar = 0;
                cutsceneX = 0;
                cutsceneY = 0;
                fireballRate = 45;
                bossStage = 0;
                if (bossDeaths > bossDialogue.length - 2 && bossX === 11) {
                    bossDeaths = bossDialogue.length - 2;
                }
                if (bossDeaths > secretDialogue.length - 4 && bossX === 12) {
                    bossDeaths = secretDialogue.length - 4;
                }
            }
		}
	}
    if (scene === "end") {
        background(0);
        fill(255);
        textFont(normalFont, 30);
        cutsceneVar ++;
        if (secretDead) {
            text(secretDialogue[6][floor(cutsceneVar/180)], 0, 0, width, height);
            if (cutsceneVar > secretDialogue[6].length * 180 + 120) {
                scene = "menu";
                cutsceneVar = 0;
                secretDead = false;
            }
        } else {
            text(secretDialogue[7][floor(cutsceneVar/180)], 0, 0, width, height);
            if (cutsceneVar > secretDialogue[7].length * 180 + 120) {
                scene = "menu";
                cutsceneVar = 0;
                secretDead = false;
            }
        }
    }

    if (debugg) {
        textAlign(LEFT, CENTER);
        fill(0, 100);
        rect(0, 0, 100, 150);
        fill(255);
        textSize(15);
        text(fireballs.length, 10, 10);
        text(particles.length, 10, 25);
        text(scene, 10, 40);
        text(bossX, 10, 55);
        text(noclip, 10, 70);
        text(pX, 10, 85);
        text(pY, 10, 100);
        text(cutscene, 10, 115);
        text(bossDeaths, 10, 130);
        text(cutsceneVar, 10, 145);
        textAlign(CENTER, CENTER);
    }
	
	click = false;
	
	if (wrongSize) {
	    size(400, 400, 1);
        background(255);
        fill(255);
        stroke(0);
        ellipse(200, 600, 800, 800);
        noStroke();
        fill(0, 136, 255);
        ellipse(200, 200, 200, 200);
        fill(0);
        ellipse(167, 167, 33, 33);
        ellipse(233, 167, 33, 33);
        ellipse(200, 233, 67, 67);
        noFill();
        textFont(createFont("segoe ui Bold"), 100);
        textSize(100);
        text("CircLand", 200, 40);
        println("It seems you've made a spin-off, but the screen size is invalid. Go into settings and change the size to 600x600.");
        noLoop();
    }
    
    
    var timeTxt = floor(minutes) + ":" + (floor(seconds) % 60 < 10 ? 0 : "") + floor(seconds) % 60 + "." + (floor(milliseconds) % 1000 < 100 ? 0 : "") + (floor(milliseconds) % 1000 < 10 ? 0 : "") + (floor(milliseconds) % 1000);
    fill(0, 100);
    ellipse(0, 0, 200, 200);
    fill(255);
	textSize(20);
	textAlign(LEFT, CENTER);
	text(timeTxt, 10, 20);
	textSize(15);
	text(floor(levelMinutes) + ":" + (floor(levelSeconds) % 60 < 10 ? 0 : "") + floor(levelSeconds) % 60 + "." + (floor(levelMilliseconds) % 1000 < 100 ? 0 : "") + (floor(levelMilliseconds) % 1000 < 10 ? 0 : "") + (floor(levelMilliseconds) % 1000), 10, 40);
	textAlign(CENTER, CENTER);
	
	if (scene !== "menu" && scene !== "customize") {
	    milliseconds += 1000/60;
        seconds += 1/60;
        minutes += 1/3600;
        if (scene === "game" || scene === "die") {
            levelMilliseconds += 1000/60;
            levelSeconds += 1/60;
            levelMinutes += 1/3600;
        }
	}
	
	
};

//jshint ignore:start
try {
    if(navigator.userAgentData) {
        mobile = navigator.userAgentData.mobile;
    } else {
        mobile = false;
    }
} catch(e) {
    debug("Your browser doesn't support mobile mode.");
}


































