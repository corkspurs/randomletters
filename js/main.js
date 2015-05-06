window.onload = initPage;
window.numberArray = ['one', 'two', 'three', 'four'];
window.alphabetArray = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
window.numberArrayIndex;
window.numberArrayContent;
window.garbledWordText;
window.hiddenChar;
window.correctWord;
window.timerCount = 3;	//timer count in seconds

function initPage() {
	randomizeImageAndSound();
	generateGarbledWord();
	populateCharOptions();
	var newWordBtn = document.getElementById('new-word-btn');
	if (newWordBtn) {
		addEventHandler(newWordBtn, 'click', function() {
			location.reload();
		});
	}
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomizeImageAndSound() {
	var imgIndex = getRandomInt(0, 3);
	window.numberArrayIndex = imgIndex;
	var numImgText = window.numberArray[imgIndex];
	window.numberArrayContent = numImgText;
	document.getElementById('whole-word').innerHTML = window.numberArrayContent;
	var numImgImage = "img/" + numImgText + ".gif";
	document.getElementById('num-img').src = numImgImage;

	/* Fetching and playing sound*/
	var numAudioSound = "sounds/" + numImgText + ".mp3";
	var numSound = document.getElementById('num-sound');
	playSound(numSound, numAudioSound, 1);
	var missingLetterSound = document.getElementById('missing-letter-sound');
	playNext(numSound, missingLetterSound, "sounds/missingletter.mp3", 1);
	
}

function playSound(audioObject, fileName, delayInSeconds) {
	audioObject.src = fileName;
	setTimeout(function () {
		audioObject.play();
	}, delayInSeconds*1000);
}

function playNext(currentAudioObject, nextAudioObject, nextAudioFileName, delayInSeconds) {
	addEventHandler(currentAudioObject, 'ended', function() {
		playSound(nextAudioObject, nextAudioFileName, delayInSeconds);
	});
}

function generateGarbledWord() {
	var wordContent = window.numberArrayContent;
	var wordContentLength = wordContent.length;
	var charToBeHiddenIndex = getRandomInt(0, wordContentLength-1);
	var charToBeHiddenChar = wordContent[charToBeHiddenIndex];
	window.hiddenChar = charToBeHiddenChar;
	wordContent = wordContent.replaceAt(charToBeHiddenIndex, "_");
	window.garbledWordText = wordContent;
	document.getElementById('garbled-word').innerHTML = wordContent;

	/* Play sound of the missing letter */
	var missingLetterSound = document.getElementById('missing-letter-sound');
	var missingLetter = document.getElementById('missing-letter');
	playNext(missingLetterSound, missingLetter, "sounds/" + window.hiddenChar + ".mp3", 0.5);
}

function pauseAllSoundIfPlaying() {
	var audioElements = document.getElementsByTagName('audio');
	var audioElementsLength = audioElements.length;
	
	for(var i=0; i<audioElementsLength; i++) {
		var audioElementId = audioElements[i].getAttribute("id");
		if(audioElementId == "correct-sound" || audioElementId == "incorrect-sound"){
			continue;
		}
		else {
			audioElements[i].src = "";
		}
		if(isSoundPlaying(audioElements[i])){
			audioElements[i].pause();
		}
	}
}

function isSoundPlaying(audioObject) {
	return !audioObject.paused && !audioObject.ended && 0 < audioObject.currentTime;
}

function populateCharOptions() {	
	var optionsArray = new Array();
	var alphabetArrayLocal = window.alphabetArray.slice(0);
	var indexOfHiddenChar = alphabetArrayLocal.indexOf(window.hiddenChar);
	if (indexOfHiddenChar > -1) {
		alphabetArrayLocal.splice(indexOfHiddenChar, 1);
	}

	optionsArray[0] = window.hiddenChar;
	for (var i = 1; i <= 3; i++) {
		var indexToBeAdded = getRandomInt(0, alphabetArrayLocal.length-1);
		optionsArray[i] = alphabetArrayLocal[indexToBeAdded];
		alphabetArrayLocal.splice(alphabetArrayLocal.indexOf(optionsArray[i]), 1);
	}

	optionsArray = shuffleArray(optionsArray);

	var charOptions = document.getElementById('char-options').getElementsByTagName('span');

	for (var i = 0; i < charOptions.length; i++) {
		charOptions[i].innerHTML = optionsArray[i];
		charOptions[i].setAttribute("id", optionsArray[i]);
		addEventHandler(charOptions[i], "click", checkCorrectness);
	}
}

function checkCorrectness() {
	var characterClicked = this.getAttribute("id");
	if (characterClicked == window.hiddenChar) {
		var correctText = window.garbledWordText.replace("_", "<u>"+ characterClicked + "</u>");
		document.getElementById('garbled-word').innerHTML = correctText;		
		document.getElementById('results').style.visibility = "visible";
		document.getElementById('correct').style.display = "block";
		document.getElementById('incorrect').style.display = "none";
		this.className += " correct-option";
		var charOptions = document.getElementById('char-options').getElementsByTagName('span');
		for (var i = 0; i < charOptions.length; i++) {
			removeEventHandler(charOptions[i], "click", checkCorrectness);
			if (charOptions[i].getAttribute("id") == characterClicked){
				continue;
			}
			else {
				charOptions[i].className += " disabled";
			}
		}
		/* Play correct sound */
		pauseAllSoundIfPlaying();
		var correctSound = document.getElementById('correct-sound');
		playSound(correctSound, "sounds/correct.mp3", 0);

		window.timerCount = 3;
		startCountdown();
		//setTimeout('resetAll()', (window.timerCount + 1)*1000);
		setTimeout(function() {
			location.reload();
		}, (window.timerCount + 1)*1000);

	}
	else {
		document.getElementById('results').style.visibility = "visible";
		document.getElementById('correct').style.display = "none";
		document.getElementById('incorrect').style.display = "block";

		/* Play please try again sound */
		pauseAllSoundIfPlaying();
		var correctSound = document.getElementById('incorrect-sound');
		playSound(correctSound, "sounds/pleasetryagain.mp3", 0);	
	}
}

String.prototype.replaceAt = function(index, character) {
    return this.substr(0, index) + character + this.substr(index+character.length);
}

function addEventHandler(object,eventName,handlerFunction){
  
  if(document.attachEvent){
    object.attachEvent("on" + eventName, handlerFunction);  //for IE 
  }

  else if(document.addEventListener){
    object.addEventListener(eventName,handlerFunction,false); //for Chrome, Firefox, Safari, Opera, etc...

  }
}

function removeEventHandler(object,eventName,handlerFunction){

  if(document.detachEvent){
    object.detachEvent("on" + eventName, handlerFunction);	//for IE 
  }

  else if(document.removeEventListener){
    object.removeEventListener(eventName,handlerFunction,false); //for Chrome, Firefox, Safari, Opera, etc...
  }
}

function shuffleArray(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  while (0 !== currentIndex) {

    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function startCountdown() {
	if (window.timerCount > 0){
		var timerDiv = document.getElementById('timer');
		timerDiv.style.display = "block";
		timerDiv.innerHTML = "00:0" + window.timerCount;
		var replaceCount = setTimeout(function() {timerDiv.innerHTML = "";}, 1000);
		if (window.timerCount > 0){
			countdown = setTimeout('startCountdown()', 1000);
		}
	}
	if (window.timerCount < 0) {
		//var isCountDownOver = true;
		clearTimeout(countdown);
		clearTimeout(replaceCount);
	}

	window.timerCount--;
}


function removeAudioSources() {
	var audioElements = document.getElementsByTagName('audio');
	var audioElementsLength = audioElements.length;
	
	for(var i=0; i<audioElementsLength; i++) {
		audioElements[i].src = "";
	}	
}

function resetAll() {
	pauseAllSoundIfPlaying();
	removeAudioSources();
	window.numberArrayIndex = -1;
	window.numberArrayContent = "";
	window.garbledWordText = "";
	window.hiddenChar = "";	
	document.getElementById('results').style.visibility = "hidden";
	document.getElementById('correct').style.display = "none";
	document.getElementById('incorrect').style.display = "none";
	var charOptions = document.getElementById('char-options').getElementsByTagName('span');
	for (var i = 0; i < charOptions.length; i++) {
		addEventHandler(charOptions[i], "click", checkCorrectness);		
		charOptions[i].className = "char-option";
	}
	initPage();
}

