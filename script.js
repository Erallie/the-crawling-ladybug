var creditsShown = false;
var aboutShown = false;
var searchShown = false;
var clockShown = false;
var isFullscreen = false;

var config = {
  type: Phaser.WEBGL,
  width: 1920,
  height: 1080,
  loader: {
    baseURL: "http://thecrawlingladybug.great-site.net/",
    crossOrigin: "anonymous"
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
      debugShowBody: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

var game = new Phaser.Game(config);

var SPEED = 100;
var ROTATION_SPEED = 1 * Math.PI; // 0.5 turn per sec, 2 sec per turn
var ROTATION_SPEED_DEGREES = Phaser.Math.RadToDeg(ROTATION_SPEED);
var TOLERANCE = 0.02 * ROTATION_SPEED;

var velocityFromRotation = Phaser.Physics.Arcade.ArcadePhysics.prototype.velocityFromRotation;
var ladybug;
//var debugText;

function preload() {
	switch(Math.floor(Math.random() * 4)) {
		case 0:
		  var bgLink = 'assets/backgrounds/background1.png';
		  break;
		case 1:
			var bgLink = 'assets/backgrounds/background2.png';
		  break;
		case 2:
			var bgLink = 'assets/backgrounds/background3.png';
		  break;
		case 3:
			var bgLink = 'assets/backgrounds/background4.png';
		  break;
		default:
		  // code block
	  }

	this.load.image('background', bgLink);

	this.load.image('ladybug', 'assets/ladybug.png');
	
	this.load.image('grass1', 'assets/grass/Grass1.png');
	this.load.image('grass2', 'assets/grass/Grass2.png');
	this.load.image('grass3', 'assets/grass/Grass3.png');
	this.load.image('grass4', 'assets/grass/Grass4.png');
	this.load.image('grass5', 'assets/grass/Grass5.png');
	this.load.image('grass6', 'assets/grass/Grass6.png');

	this.load.image('flowerA', 'assets/flowers/flowerA.png')
	this.load.image('flowerA_Center', 'assets/flowers/flowerA_Center.png')
	this.load.image('flowerB', 'assets/flowers/flowerB.png')
	this.load.image('flowerB_Center', 'assets/flowers/flowerB_Center.png')
}

function create() {
	this.add.image(960, 540, 'background').setDepth(0);
	
	grass = this.physics.add.staticGroup().setDepth(1);

	flower = this.physics.add.staticGroup().setDepth(2);
	flowerCenter = this.physics.add.staticGroup().setDepth(2);
	
	ladybug = this.physics.add.sprite(200, 150, 'ladybug').setVelocity(SPEED, 0).setDepth(3);

	//debugText = this.add.text(32, 32, 'debug text', { fontSize: '16px', fill: '#fff' });
	
	var delay = (1 - Math.random()) * 1000;
	setTimeout(() => { spawnGrass() }, delay);
}

function update() {
  pointerMove(this.input.activePointer);
  velocityFromRotation(ladybug.rotation, SPEED, ladybug.body.velocity);
  ladybug.body.debugBodyColor = (ladybug.body.angularVelocity === 0) ? 0xff0000 : 0xffff00;
}

function spawnGrass() {
	var delay = (1 - Math.random()) * 1000;
	setTimeout(() => { spawnGrass() }, delay);
	switch(Math.floor(Math.random() * 6)) {
  	case 0:
    	var grassType = 'grass1';
    	break;
  	case 1:
    	var grassType = 'grass2';
    	break;
  	case 2:
    	var grassType = 'grass3';
    	break;
  	case 3:
    	var grassType = 'grass4';
    	break;
  	case 4:
    	var grassType = 'grass5';
    	break;
  	case 5:
    	var grassType = 'grass6';
    	break;
  	default:
    	// code block
	}
	var grassS = Math.floor(Math.random() * 13) + 48;
	var grassL = Math.floor(Math.random() * 7) + 28;
	var grassFinalScale = (Math.random() * 0.75) + 0.25;
	var newGrass = grass.create(ladybug.x, ladybug.y, grassType).setScale(0.01).setRotation(Math.random() * 2).setTint(HSLToHex(124, grassS, grassL)).setDepth(1);
	setTimeout(growGrass, 5, newGrass, grassFinalScale);
}

function growGrass(newGrass, grassFinalScale, growInterval) {
	var grassCurrentScale = newGrass.scale;
	var grassRotation = newGrass.rotation;
	
	if (grassCurrentScale < grassFinalScale) {
		newGrass.setScale(grassCurrentScale + 0.001);
		newGrass.setRotation(grassRotation + 0.001);
		setTimeout(growGrass, 5, newGrass, grassFinalScale);
	}
	else if (grassFinalScale >= 0.75 && Math.random() >= 0.9) {
		switch(Math.floor(Math.random() * 2)) {
		case 0:
		  var flowerType = 'flowerA';
		  break;
		case 1:
		  var flowerType = 'flowerB';
		  break;
		default:
		  // code block
		}
		var flowerHue = Math.floor(Math.random() * 202) + 193;
		if (flowerHue >= 360) {
			flowerHue -= 360;
		}
		var flowerFinalScale = (Math.random() * 0.25) + 0.75;
		var newFlower = flower.create(newGrass.x, newGrass.y, flowerType).setScale(0.01).setRotation(Math.random() * 2).setTint(HSLToHex(flowerHue, 85, 72)).setDepth(2);
		var newFlowerCenter = flowerCenter.create(newGrass.x, newGrass.y, flowerType + '_Center').setScale(0.01).setRotation(newFlower.rotation).setDepth(2);
		setTimeout(growFlower, 5, newFlower, newFlowerCenter, flowerFinalScale);
	}
}


function growFlower(newFlower, newFlowerCenter, flowerFinalScale) {
	var flowerCurrentScale = newFlower.scale;
	var flowerRotation = newFlower.rotation;
	
	if (flowerCurrentScale < flowerFinalScale) {
		newFlower.setScale(flowerCurrentScale + 0.001);
		newFlower.setRotation(flowerRotation + 0.001);
		newFlowerCenter.setScale(flowerCurrentScale + 0.001);
		newFlowerCenter.setRotation(flowerRotation + 0.001);
		setTimeout(growFlower, 5, newFlower, newFlowerCenter, flowerFinalScale);
	}
}


function pointerMove (pointer) {
  // if (!pointer.manager.isOver) return;
  
  // Also see alternative method in
  // <https://codepen.io/samme/pen/gOpPLLx>
  
  var angleToPointer = Phaser.Math.Angle.Between(ladybug.x, ladybug.y, pointer.worldX, pointer.worldY);
  var angleDelta = Phaser.Math.Angle.Wrap(angleToPointer - ladybug.rotation);
    
  if (Phaser.Math.Within(angleDelta, 0, TOLERANCE)) {
    ladybug.rotation = angleToPointer;
    ladybug.setAngularVelocity(0);
  } else {
    ladybug.setAngularVelocity(Math.sign(angleDelta) * ROTATION_SPEED_DEGREES);
  }
}

function HSLToHex(h, s, l) {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
  };
  return `0x${f(0)}${f(8)}${f(4)}`;
}



function toggleAbout() {
	if (!aboutShown) {
		document.getElementById('aboutLink').textContent = 'Hide Info';
		document.getElementById('aboutExpanded').style.display='inline-block';
		aboutShown = true;
		
		document.getElementById('creditLink').textContent = 'Show Credits';
		document.getElementById('creditExpanded').style.display='none';
		creditsShown = false;
		
		document.getElementById('searchLink').textContent = 'Show Search Bar';
		document.getElementById('searchExpanded').style.display='none';
		searchShown = false;
		
		document.getElementById('clockLink').textContent = 'Show Clock';
		document.getElementById('clockExpanded').style.display='none';
		clockShown = false;
	}
	else if (aboutShown) {
		document.getElementById('aboutLink').textContent = 'Show Info';
		document.getElementById('aboutExpanded').style.display='none';
		aboutShown = false;
	}
}


function toggleCredits() {
	if (!creditsShown) {
		document.getElementById('creditLink').textContent = 'Hide Credits';
		document.getElementById('creditExpanded').style.display='inline-block';
		creditsShown = true;
		
		document.getElementById('aboutLink').textContent = 'Show Info';
		document.getElementById('aboutExpanded').style.display='none';
		aboutShown = false;
		
		document.getElementById('searchLink').textContent = 'Show Search Bar';
		document.getElementById('searchExpanded').style.display='none';
		searchShown = false;
		
		document.getElementById('clockLink').textContent = 'Show Clock';
		document.getElementById('clockExpanded').style.display='none';
		clockShown = false;
	}
	else if (creditsShown) {
		document.getElementById('creditLink').textContent = 'Show Credits';
		document.getElementById('creditExpanded').style.display='none';
		creditsShown = false;
	}
}


function toggleSearch() {
	if (!searchShown) {
		document.getElementById('searchLink').textContent = 'Hide Search Bar';
		document.getElementById('searchExpanded').style.display='inline-block';
		document.getElementById("query").focus();
		searchShown = true;
		
		document.getElementById('aboutLink').textContent = 'Show Info';
		document.getElementById('aboutExpanded').style.display='none';
		aboutShown = false;
		
		document.getElementById('creditLink').textContent = 'Show Credits';
		document.getElementById('creditExpanded').style.display='none';
		creditsShown = false;

		document.getElementById('clockLink').textContent = 'Show Clock';
		document.getElementById('clockExpanded').style.display='none';
		clockShown = false;
	}
	else if (searchShown) {
		document.getElementById('searchLink').textContent = 'Show Search Bar';
		document.getElementById('searchExpanded').style.display='none';
		searchShown = false;
	}
}



function toggleClock() {
	if (!clockShown) {
		document.getElementById('clockLink').textContent = 'Hide Clock';
		document.getElementById('clockExpanded').style.display='inline-block';
		clockShown = true;
		updateClock();
		setDate();
		
		document.getElementById('aboutLink').textContent = 'Show Info';
		document.getElementById('aboutExpanded').style.display='none';
		aboutShown = false;
		
		document.getElementById('creditLink').textContent = 'Show Credits';
		document.getElementById('creditExpanded').style.display='none';
		creditsShown = false;
		
		document.getElementById('searchLink').textContent = 'Show Search Bar';
		document.getElementById('searchExpanded').style.display='none';
		searchShown = false;
	}
	else if (clockShown) {
		document.getElementById('clockLink').textContent = 'Show Clock';
		document.getElementById('clockExpanded').style.display='none';
		clockShown = false;
	}
}


function toggleFullscreen() {
	if (!isFullscreen) {
		if (document.documentElement.requestFullscreen) {
			document.documentElement.requestFullscreen();
		} else if (document.documentElement.webkitRequestFullscreen) { /* Safari */
			document.documentElement.webkitRequestFullscreen();
		} else if (document.documentElement.msRequestFullscreen) { /* IE11 */
			document.documentElement.msRequestFullscreen();
		}
		document.getElementById('fullscreenLink').textContent = 'Exit Fullscreen';
		isFullscreen = true;
	}
	else if (isFullscreen) {
		if (document.exitFullscreen) {
		  document.exitFullscreen();
		} else if (document.webkitExitFullscreen) { /* Safari */
		  document.webkitExitFullscreen();
		} else if (document.msExitFullscreen) { /* IE11 */
		  document.msExitFullscreen();
		}
		document.getElementById('fullscreenLink').textContent = 'Enter Fullscreen';
		isFullscreen = false;
	}
}


const f = document.getElementById('searchBar');
const q = document.getElementById('query');
const google = 'https://www.google.com/search?q=';

function submitted(event) {
	event.preventDefault();
	if (q.value !== "") {
		if (validURL(q.value)) {
			if (hasProtocol(q.value)){
				var url = q.value;
			}
			else {
				var url = 'http://' + q.value;
			}
		}
		else {
			var url = google + q.value;
		}
		const win = window.open(url, '_self');
		win.focus();
	}
}

f.addEventListener('submit', submitted);

function validURL(str) {
	var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
	  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
	  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
	  '(\\:\\d+)?(\\/[-a-z\\d%_.~+@,]*)*'+ // port and path
	  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
	  '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
	return pattern.test(str);
}

function hasProtocol(str) {
	var pattern = new RegExp('^(https?:\\/\\/)');
	return pattern.test(str);
}


function refresh() {
	location.reload();
}

function setSearchOnStart() {
	var searchOnStart = document.getElementById("searchOnStart").checked;
	var clockOnStart = document.getElementById("clockOnStart").checked;
	if (searchOnStart) {
		localStorage.setItem("displayOnStart", "search");
		document.getElementById("clockOnStart").checked = false;
	}
	else if (clockOnStart) {
		localStorage.setItem("displayOnStart", "clock");
	}
	else {
		localStorage.removeItem("displayOnStart");
	}
}


function setClockOnStart() {
	var searchOnStart = document.getElementById("searchOnStart").checked;
	var clockOnStart = document.getElementById("clockOnStart").checked;
	if (clockOnStart) {
		localStorage.setItem("displayOnStart", "clock");
		document.getElementById("searchOnStart").checked = false;
	}
	else if (searchOnStart) {
		localStorage.setItem("displayOnStart", "search");
	}
	else {
		localStorage.removeItem("displayOnStart");
	}
}

function setDisplay() {
	let display = localStorage.getItem("displayOnStart");
	if (display == "search") {
		document.getElementById("searchOnStart").checked = true;
		toggleSearch();
	}
	else if (display == "clock") {
		document.getElementById("clockOnStart").checked = true;
		toggleClock();
	}
}

function updateClock() {
	if(clockShown){
		const d = new Date();
		var hour = d.getHours();
		if (hour == 0) {
			var amPm = AM;
			hour = 12;
		}
		else if (hour < 12) {
			var amPm = "AM";
		}
		else if (hour == 12) {
			var amPm = "PM";
		}
		else if (hour > 12) {
			var amPm = "PM";
			hour -= 12
		}
		hour = String(hour);
		var minute = String(d.getMinutes());
		if (minute.length == 1) {
			minute = "0" + minute;
		}
		document.getElementById('time').innerHTML = hour + ":" + minute;

		if(d.getHours() == 0 && d.getMinutes() == 0 && d.getSeconds() == 0) {
			setDate();
		}
		setTimeout(updateClock, 1000);
	}
}

function setDate() {
	const d = new Date();
	switch(d.getDay()) {
		case 0:
			var day = 'Sunday';
			break;
		case 1:
			var day = 'Monday';
			break;
		case 2:
			var day = 'Tuesday';
			break;
		case 3:
			var day = 'Wednesday';
			break;
		case 4:
			var day = 'Thursday';
			break;
		case 5:
			var day = 'Friday';
			break;
		case 6:
			var day = 'Saturday';
			break;
		default:
	}
	switch(d.getMonth()) {
		case 0:
			var month = 'January';
			break;
		case 1:
			var month = 'February';
			break;
		case 2:
			var month = 'March';
			break;
		case 3:
			var month = 'April';
			break;
		case 4:
			var month = 'May';
			break;
		case 5:
			var month = 'June';
			break;
		case 6:
			var month = 'July';
			break;
		case 7:
			var month = 'August';
			break;
		case 8:
			var month = 'September';
			break;
		case 9:
			var month = 'October';
			break;
		case 10:
			var month = 'November';
			break;
		case 11:
			var month = 'December';
			break;
		default:
	}
	
	var date = String(d.getDate());
	var year = String(d.getFullYear());
	document.getElementById('day').innerHTML = day;
	document.getElementById('date').innerHTML = month + " " + date + ", " + year;
}