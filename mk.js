//---------начало, ввод данных-------------------------
const arrPlayers =[]; //игроки
const arrCards = []; //карты
const gameStatus = { //игра
					players: arrPlayers, 
					cards: arrCards,
					status: 'selection',
					whoseMove: false,
					whoseTurnWasIt: false,
					round: 0,
					diceValue: false
				}; 
const startingCards = ["Пшеница", "Пекарня"]; //какие карты должны быть изначально у игроков?

start(`Введите количество игроков от 2 до 4`); // Запуск первого вопроса


function start(text) {
	let answer = Number(prompt(text));
	if (answer == 2 || answer == 3 || answer == 4) {
		CreatePlayers(answer);
	} else {
		start(`Была введена некоретная информция. Введите количество игроков от 2 до 4`);
	}

}

function CreatePlayers(countPlayers) {

	for (let i=0; i < countPlayers; i++) {
		let name;
		if (i == 2) {
			name = prompt(`введите имя 3-его игрока`);
			createObjectPlaters(name, i+1);
			continue
		}
		name = prompt(`введите имя `+(i+1)+`-ого игрока`);
		createObjectPlaters(name, i+1);
	}

	createObjectCards();
	createHtmlElementPlayerAndCards(arrPlayers, arrCards);
}



//-----------создаем игроков по введным данным----------------------------


function createObjectPlaters(playerNames, playerId) {

	class Player {
		constructor(name, id, money, cards, bought) {
			this.name=  name;
			this.id = id;
			this.money = money;
			this.cards = cards;
			this.bought = bought;
		}
	}
	

	let player = new Player(playerNames, playerId, 3, [], false);

	arrPlayers.push(player);
}

//объекты игроков: console.log(arrPlayers, 'final');

//-----------создаем игровую калоду----------------------------


function createObjectCards() {

	let arrCardsBaseBox = [

					   //синий - у банка, срабатывает всегда
					   [5, 'Пшеница', 'blue', 1, 1, [1], 'wheat', 'wheat'], 
					   [5, 'Ферма', 'blue', 1, 1, [2], 'cow', 'farm'], 
					   [5, 'Лес', 'blue', 3, 1, [5], 'gear-wheel', 'forest'],
					   [5, 'Шахта','blue', 6, 5, [9], 'gear-wheel', 'mine'],
					   [5, 'Яблоневый Сад', 'blue', 3, 3, [10], 'wheat', 'apple'],

						//зеленый - забрать деньги у банка, срабатывает только в свой ход
					   [5, 'Пекарня', 'green', 1, 1, [2,3], 'score', 'bakery'],
					   [5, 'Магазин', 'green', 2, 3, [4], 'score', 'shop'],
					   [5, 'Сырзавод', 'green', 5, 0 /*incomeСalc(3, 'cow')*/, [7], 'factory', 'cheese-factory'],
					   [5, 'Мебель', 'green', 3, 0/*incomeСalc(3, 'gear-wheel')*/, [8], 'factory', 'furniture'],
					   [5, 'Овощбаза', 'green', 2, 0/*incomeСalc(2, 'wheat')*/, [11, 12], 'apple', 'vegetable-base'],

					   //красный - забрать деньги у игрока
					   [5, 'Кофейня', 'red', 2, 1, [3], 'coffe', 'coffe'], 
					   [5, 'Ресторан', 'red', 2, 2, [9, 10], 'coffe', 'restaurant']
					   
					  ]

	class Cards {
		constructor(count, name, color, cost, income, active, type, img) {
			this.count =  count;
			this.name =  name;
			this.color = color;
			this.cost = cost;
			this.income = income;
			this.active = active;
			this.type = type;
			this.img = img;
		}
	}

	arrCardsBaseBox.forEach(function(item, i){
		//let card = new Cards(item[0],item[1],item[2],item[3],item[4],item[5],item[6],item[7]);
		let card = new Cards(...item);
		arrCards.push(card);
	})

	/*	arrPlayers.cards = arrCards.map(function(item) {
		return {
			count: item.count,
			name: item.name,
			color: item.color,
			cost: item.cost,
			income: item.income,
			active: item.active,
			type: item.type,
			img: item.img,
			count: item.count,
			count: +startingCards.map(function(el) {
				return el.toLowerCase();
			}).includes(item.name.toLowerCase())
		};
	})*/
	arrPlayers.forEach(function(item){
		item.cards = arrCards.map(item => ({
			...item,
			count: +startingCards.map(el => el.toLowerCase()).includes(item.name.toLowerCase())
		}));
	})
}


//объекты игровых карт: console.log(arrCards, 'final');

//----------------Рисуем HTML--------------------------------------

function createHtmlElementPlayerAndCards(players, cards){

	players.forEach(function(item, i){
		let playersField = document.querySelector('#playersField');
		let test = `<div id="player_id-`+(i+1)+`" class="players player_field">
  					<span class="name__player">`+ item.name +`</span>
  					<span class="money__player">Монет: `+ item.money +`</span>
  				</div>`;
  		let boxCards = document.querySelector('#box__cards');
		let boxPlayerCards = `<div id='box__player`+(i+1)+`-cards' class="bord-player-cards p`+(i+1)+` hidden" data-cards=""></div>`;

	playersField.insertAdjacentHTML("beforeEnd", test);
	boxCards.insertAdjacentHTML("beforeEnd", boxPlayerCards);

	});

	cards.forEach(function(item, i){
		let playersField = document.querySelector('#cards__arr');
		let addCardOnField = `<div id="card-`+ item.img +`" class="card `+ item.color +`" data-value='`+ item.count +`' card-type='`+item.img+`'">
			  					<div class="box__card-img"><img src="img/`+ item.img +`.png"></div>
			  					<div class="card-info">x`+ item.count +`</div>
		  					</div>`;
		playersField.insertAdjacentHTML("beforeEnd", addCardOnField);
	});
}

createHtmlBoxCards();

function createHtmlBoxCards(){
	arrPlayers.forEach(function(item, i){
				
		for (var i = 0; i< item.cards.length; i++) {
			let classHidden = ' hidden';
			if(item.cards[i].count) classHidden = '';
			let boxPlayer = document.querySelector('#box__player'+item.id+'-cards');
			let test = `<div id="card-`+ item.cards[i].img +`" class="card `+ item.cards[i].color + classHidden+`" data-value='`+ item.cards[i].count +`'">
			  					<div class="box__card-img"><img src="img/`+ item.cards[i].img +`.png"></div>
			  					<div class="card-info">x`+item.cards[i].count+`</div>
		  					</div>`;
			boxPlayer.insertAdjacentHTML("beforeEnd", test);
		}
	})
}


function htmlChangesAfterPurchase() {
	let playerLeftFields = Array.prototype.slice.call(document.querySelectorAll('#playersField .players'));
	let playerTopCards = Array.prototype.slice.call(document.querySelectorAll('.bord-player-cards'));
	let centerCards = Array.prototype.slice.call(document.querySelectorAll('#cards__arr .card'));

	playerLeftFields.forEach(function(item, i){
		item.querySelector('.money__player').innerText = 'Монет: '+gameStatus.players[i].money;
	});

	
	playerTopCards.forEach(function(item, i){
		Array.prototype.slice.call(item.querySelectorAll('.card')).forEach(function(elem, j){
			elem.querySelector('.card-info').innerText = 'x'+gameStatus.players[i].cards[j].count;
			if (gameStatus.players[i].cards[j].count) elem.classList.remove('hidden');
		});
	});
	console.log(gameStatus);
	centerCards.forEach(function(item, i){
		item.querySelector('.card-info').innerText = 'x'+gameStatus.cards[i].count;
		if (!gameStatus.cards[i].count) {
			item.classList.add('sales');
			item.querySelector('img').src = 'img/sales.png';
		}
	})
}


//----------------------код: события и функции меняющие основной объект------------------------------------------------------------------------------------------------
//тригерная функция

function triggerEffct(){
	

	let movePlayerField = document.querySelector('#player_id-'+gameStatus.whoseMove.id);
	let moveLastPlayerField = document.querySelector('#player_id-'+gameStatus.whoseTurnWasIt.id);
	let alertField = document.querySelector('#alert');
	let boxDice = document.querySelector('#box_dice');
	let boxCards = document.querySelector('#box__player'+gameStatus.whoseMove.id+'-cards');
	let boxLastCards = document.querySelector('#box__player'+gameStatus.whoseTurnWasIt.id+'-cards');

	

	if (gameStatus.status === 'move') {
		alertField.innerText = gameStatus.whoseMove.name +' бросает кубики';
		movePlayerField.classList.toggle('move');
		if (gameStatus.whoseTurnWasIt) {
			moveLastPlayerField.classList.toggle('end');
			boxLastCards.classList.toggle('hidden');
		}
		boxCards.classList.toggle('hidden');

	}

	if (gameStatus.status === 'end') {
		alertField.innerText = gameStatus.whoseMove.name +' завершает и передает ход';
		boxDice.innerText = gameStatus.diceValue;
		movePlayerField.classList.toggle('move');
		movePlayerField.classList.toggle('end');
	}
}
console.log("new")
function moneyProcess(){
	gameStatus.players.forEach(function(player){
		if (gameStatus.whoseMove.id != player.id) {
			player.cards.forEach(function(card){
				if (card.count && card.color ==='red' && card.active.indexOf(gameStatus.diceValue) !=-1) {
					if (gameStatus.whoseMove.money - card.income * card.count < 0) {
						htmlChangesAfterPurchase();
						console.log(gameStatus, "туть");
						alert('выпала 3, но игрок '+gameStatus.whoseMove.name+' не может выплатить долг игроку '+player.name+', у него нет денег');
					} else {
						player.money += card.income * card.count;
						gameStatus.whoseMove.money -= card.income * card.count;
					}
					
				}
			});
		}
		player.cards.forEach(function(card){
			if (card.count && card.color ==='blue' && card.active.indexOf(gameStatus.diceValue) !=-1) {
				player.money += card.income*card.count;
			}
		});
	});

	gameStatus.whoseMove.cards.forEach(function(card){
			if (card.count && card.color ==='green' && card.active.indexOf(gameStatus.diceValue) !=-1) {
				gameStatus.whoseMove.money += card.income * card.count;
			}
		});
	htmlChangesAfterPurchase();
			
			// console.log(gameStatus.diceValue, "сколько выпало");
			// console.log(gameStatus.players, "карты игроков");
			// console.log("-------------------");
}

//события
developments()
function developments() {
	let mainField = document.querySelector('#main'); //всё игкровое поле
	let statusSelection = document.querySelector('#selection'); //выбрать рандомного игрока
	let statusRoll = document.querySelector('#roll'); //бросить кубики
	let statusEnd = document.querySelector('#end'); //завершить ход
	let boxDice = document.querySelector('#box_dice'); //кубики


	mainField.addEventListener("click", function(e) {
		if (e.target.closest('#selection')) {
			statusSelection.classList.toggle('hidden');
			statusRoll.classList.toggle('hidden');
			firstStepPlayerSelection();
			triggerEffct();
		}

		if (e.target.closest('#roll')) {
			statusRoll.classList.toggle('hidden');
			statusEnd.classList.toggle('hidden');
			boxDice.classList.toggle('hidden');
			secondStepPlayerRoll();
			moneyProcess();
			triggerEffct();
		}
		if (e.target.closest('#end')) {
			statusEnd.classList.toggle('hidden');
			statusRoll.classList.toggle('hidden');
			boxDice.classList.toggle('hidden');
			thirdStepPlayerEnd();
			triggerEffct();
			gameStatus.whoseMove.bought = false;
		}
		if (e.target.closest('.field .card') && !e.target.closest('.sales')) {
			if (gameStatus.status !== 'end') {
				alert('Перед покупкой нужно бросить кубики');
			} else {
				playerBuysACard(e.target.closest('.card'));
			}
			
		}
	});
}

//исполняющие функции
function firstStepPlayerSelection() {
	gameStatus.whoseMove = arrPlayers[Math.floor( Math.random() * 3)];
	gameStatus.status = 'move';
}

function secondStepPlayerRoll() {
	gameStatus.diceValue = Math.floor( Math.random() * 6 + 1);
	gameStatus.status = 'end';
}

function thirdStepPlayerEnd() {
	gameStatus.round++;
	gameStatus.status = 'move';
	gameStatus.whoseTurnWasIt = gameStatus.whoseMove;
	gameStatus.whoseMove =  orderOfThePlayers(gameStatus.whoseMove);
}

function orderOfThePlayers(currentPlayer){ //передается текущий игрок, вычисляется следующий
	if (currentPlayer.id === arrPlayers.length) {
		return arrPlayers[0];
	}
	return arrPlayers[currentPlayer.id];
}

function playerBuysACard(htmlCard) {
	gameStatus.cards.forEach(function(item){
		if (item.img === htmlCard.getAttribute('card-type')) {
			if (!gameStatus.whoseMove.bought) { 
				if (gameStatus.whoseMove.money-item.cost >= 0){
					item.count--; //убрали карту из колоды
					gameStatus.whoseMove.cards.forEach(function(elem){ //добавили карту игроку
						if (elem.name === item.name) ++elem.count;
					});
					gameStatus.whoseMove.money = gameStatus.whoseMove.money-item.cost; //забрали деньги за карту у игрока
					htmlChangesAfterPurchase();//меняем информацию на странице
					gameStatus.whoseMove.bought = true;
				} else {
					alert('нужно больше золота');
				}
			} else {
				alert('за ход можно купить только 1 карту');
			}
		}
	})
}
