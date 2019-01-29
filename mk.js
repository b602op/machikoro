'use strict';

var cards = document.querySelectorAll('#cards-arroy .card');

for (var i = 0; i < cards.length; i++) {
	cards[i].setAttribute('data-value' , 5)
}

let cardsArr = document.querySelector('#main');

cardsArr.onclick = function(e) {
	let card = e.target.closest('#cards-arroy .card');
	let rollTheDice = e.target.closest('#roll');
	let playerEndMove = e.target.closest('#endMove');
	if (card) { //купить карту
		clickOnTheGameCard(card);
	} else if (rollTheDice) { //бросить кубики
		startRollTheDice();
	} else if (playerEndMove) { //конец хода
		theNextPlayer(e);
	}

	return;
	
}

function clickOnTheGameCard(currentCard){
	let currentValue = currentCard.dataset.value;
	let whoPlay = document.querySelector("#thisPlayerWalks");
	let imgCardWhichChose = currentCard.cloneNode(true);
	let idCard = imgCardWhichChose.id;

	if (whoPlay.dataset.cards.match(currentCard.querySelector("img").cloneNode(false).id)) {
			document.querySelector('#thisPlayerWalks #'+ idCard).dataset.value = +document.querySelector('#thisPlayerWalks #'+ idCard).dataset.value+1;
			document.querySelector('#thisPlayerWalks #'+ idCard +' .card-info').textContent = document.querySelector('#thisPlayerWalks #'+ idCard).dataset.value;
	} else {
		whoPlay.dataset.cards = currentCard.querySelector("img").cloneNode(false).id + ' ' + whoPlay.dataset.cards;
		// imgCardWhichChose.textContent = 'x' + (6 - currentValue);
		// whoPlay.appendChild(imgCardWhichChose);
		whoPlay.appendChild(imgCardWhichChose);
		console.log(document.querySelector('#thisPlayerWalks #'+ idCard).dataset);
		document.querySelector('#thisPlayerWalks #'+ idCard).dataset.value=1;
		document.querySelector('#thisPlayerWalks #'+ idCard +' .card-info').textContent = 1;
	}
	
	if (currentValue == 1) {
		currentCard.classList.add('hidden');
		// return;
	}
	
	currentValue -= 1
	currentCard.setAttribute('data-value', currentValue);
	currentCard.querySelector('.card-info').textContent = 'x' + currentValue;
}

function startRollTheDice(){
	let diceBox = document.querySelector('.dice');
	let diceBoxHtml = '<div id="two">'+ randomNumberForRoll() + '</div>';
	let buttonEndMove = '<button id="endMove">Завершить ход</button>'; 
	diceBox.insertAdjacentHTML('afterbegin', diceBoxHtml);
	document.getElementById("roll").insertAdjacentHTML('afterend', buttonEndMove);
	document.getElementById("roll").remove();
}

function theNextPlayer(event){
	let buttonHtmlForNextPlayer = event.target.closest('.players').id;
	let test = event.target
	let nextPlayer = document.querySelector('#player1');
	let buttonEndMove = '<button id="roll">Бросить кубики</button>';
	let bordsNextPlayer = document.querySelector('.p1');
	if (buttonHtmlForNextPlayer == "player1") {
		nextPlayer = document.querySelector('#player2');
		bordsNextPlayer = document.querySelector('.p2');
	} else if (buttonHtmlForNextPlayer == "player2") {
		nextPlayer = document.querySelector('#player3');
		bordsNextPlayer = document.querySelector('.p3');
	} else if (buttonHtmlForNextPlayer == "player3") {
		nextPlayer = document.querySelector('#player4');
		bordsNextPlayer = document.querySelector('.p4');
	} else if (buttonHtmlForNextPlayer == "player4") {
	}

	document.querySelector("#thisPlayerWalks").id = "";
	bordsNextPlayer.id = "thisPlayerWalks";


	nextPlayer.appendChild(test);
	document.querySelector("#endMove").insertAdjacentHTML('afterend', buttonEndMove);
	document.querySelector("#endMove").remove();
	document.querySelector("#two").remove();
}


function randomNumberForRoll() {
	return Math.floor( Math.random() * 6 + 1); 
}

const getRandomNumber = (from, to) => from + Math.floor(Math.random() * to);


for (let i = 1; i <= 15; i++) {
	document.querySelector("#cardimg" + i).style.backgroundColor = `rgb(${getRandomNumber(0, 255)}, ${getRandomNumber(0, 255)}, ${getRandomNumber(0, 255)})`;
}