var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var spacing = 70;

var xlen = canvas.width / spacing;
var ylen = canvas.height/ spacing;

var mouse = {x: 0, y:0};

var particles = [];

// ctx.fillStyle="#c0bdff";
ctx.fillStyle="#aaa6ff"
// ctx.fillStyle="#bfc9e2";

for(var i=0; i<xlen; i++) {
	for(var j=0; j<ylen; j++) {
		particles.push({
			p: {
				x: i*spacing,
				y: j*spacing,
			},
			v: {
				x:0,
				y:0,
			},
			a: {
				x:0,
				y:0,
			},
			r: 2+Math.random()*7,
		});
	}
}

function myField(origin, position) {
	var delX = origin.x-position.x;
	var delY = origin.y-position.y;

	var delR2 = delX*delX + delY*delY;
	var magF = 0.5/delR2;

	return {
		x: magF*-delX,
		y: magF*-delY,
	};
}
var canMove = false;
function loop() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for(var i=0; i<particles.length; i++) {
		var myP = particles[i];
		// var myForce = {fx:0, fy:0};
		// for(var j=0; j<vectorFields.length; j++) {
		// 	var thisForce = vectorFields[j](myP.p);

		// 	myForce.fx += thisForce.fx;
		// 	myForce.fy += thisForce.fy;
		// }
		var myForce = {x:0, y:0};
		if(canMove) {
			myForce = myField(mouse, myP.p);
		}
		var vel2 = Math.pow(myP.v.x, 2)+Math.pow(myP.v.y, 2);
		// console.log(myForce);

		// myP.v.x+=myForce.x - myP.v.x*vel2*0.1;
		// myP.v.y+=myForce.y - myP.v.y*vel2*0.1;
		var limiter = 100;
		if(!(Math.pow(myForce.x, 2)<limiter*limiter)) {
			myForce.x = limiter;
		}
		if(!(Math.pow(myForce.y, 2)<limiter*limiter)) {
			myForce.y = limiter;
		}


		myP.v.x+=myForce.x;
		myP.v.y+=myForce.y;

		myP.p.x+=myP.v.x;
		myP.p.y+=myP.v.y;

		//check for wrapping
		if(myP.p.x > canvas.width+10) {
			myP.p.x = -10;
		} else if(myP.p.x < -10) {
			myP.p.x = canvas.width+10;
		}

		if(myP.p.y > canvas.height+10) {
			myP.p.y = -10;
		} else if(myP.p.y < -10) {
			myP.p.y = canvas.height+10;
		}

		ctx.beginPath();
		ctx.arc(myP.p.x, myP.p.y, myP.r, 0, 2*Math.PI);
		ctx.fill();
	}


	window.requestAnimationFrame(loop);	
}
loop();

document.addEventListener("mousemove", function(event) {
	canMove = true;
	mouse.x = event.clientX;
	mouse.y = event.clientY;
});