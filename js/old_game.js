"use strict";

/**********
 * Первая попытка реализации скрипта.
 * Не стал продолжать использовать, т.к. придумал лучшее решение
 */

const INTERFACE_BETS_LIST   = document.getElementById('bets-list-text');
const INTERFACE_BALANCE     = document.getElementById('balance-text');
const CELL_SET              = document.getElementsByClassName('cell'); 
const CELL_SET_SUM          = document.getElementsByClassName('cell-amount'); 
const WHEEL                 = document.getElementsByClassName('wheel'); 

class Chip{
    constructor(cell, value){

        // Номер клетки
        this.cell = cell;

        // Поставленная сумма
        this.value = value;
    }
}


class Game{
    constructor(){}

    // Крутить колесо
    static spin(){

    }

    // очистить все ставки
    static clearAll(){

    }

    // Вывести список ставок
    static _showBets(){
        
        // Если на балансе нет денег, выходим из функции
        if(Game.userBalance - Game.countChipValue < 0){
            alert(`You can't bet until you have no money!`);
            return;
        }

        // Вычитаем стоимость ставки из баланса
        Game.userBalance -= Game.countChipValue;

        // Обновляем вывод списка ставок
        INTERFACE_BETS_LIST.innerText = "";
        for(let i=0; i<Game.bets.length; i++){

            // if(Game.bets[i].cell)
            // CELL_SET_SUM[Game.bets[i].cell].innerText += Game.bets[i].value; 

            
            if(Game.bets[i].cell == 0){
                INTERFACE_BETS_LIST.innerText += "$"+Game.countChipValue+" for Zero\n";
            }else if(Game.bets[i].cell >= 1 && Game.bets[i].cell <= 36){
                INTERFACE_BETS_LIST.innerText += "$"+Game.countChipValue+" for number "+Game.bets[i].cell+"\n";
            }
            else if(Game.bets[i].cell == 37){
                INTERFACE_BETS_LIST.innerText += "$"+Game.countChipValue+" for 1st 12\n";
            }
            else if(Game.bets[i].cell == 38){
                INTERFACE_BETS_LIST.innerText += "$"+Game.countChipValue+" for 2nd 12\n";
            }
            else if(Game.bets[i].cell == 39){
                INTERFACE_BETS_LIST.innerText += "$"+Game.countChipValue+" for 3rd 12\n";
            }
            else if(Game.bets[i].cell == 40){
                INTERFACE_BETS_LIST.innerText += "$"+Game.countChipValue+" for 1-80\n";
            }
            else if(Game.bets[i].cell == 41){
                INTERFACE_BETS_LIST.innerText += "$"+Game.countChipValue+" for Even\n";
            }
            else if(Game.bets[i].cell == 42){
                INTERFACE_BETS_LIST.innerText += "$"+Game.countChipValue+" for Black\n";
            }
            else if(Game.bets[i].cell == 43){
                INTERFACE_BETS_LIST.innerText += "$"+Game.countChipValue+" for Red\n";
            }
            else if(Game.bets[i].cell == 44){
                INTERFACE_BETS_LIST.innerText += "$"+Game.countChipValue+" for Odd\n";
            }
            else if(Game.bets[i].cell == 45){
                INTERFACE_BETS_LIST.innerText += "$"+Game.countChipValue+" for 19-36\n";
            }

            console.clear();
            console.log(`Game.bets[${i}].cell = ${Game.bets[i].cell}, --- Game.bets[${i}].value = ${Game.bets[i].value}`);
        }

        // Обновляем сумму ставок на клетках поля
        for(let i=0; i<CELL_SET_SUM.length; i++){
            for(let j=0; j<Game.bets.length; j++)
            {
                if(Game.bets[j].cell == j){
                    console.log("Game.bets[j].value; "+Game.bets[j].value);
                    // CELL_SET_SUM[i].innerText += Game.bets[j].value; 
                }
            }
        }
    }

    // Создать ставку
    static createBet(cell){
        Game.bets.push(new Chip(cell, Game.countChipValue));
        Game._showBets();
    }
}
Game.userBalance = 2000;    // Денежный баланс игрока
Game.countChipValue = 5;    // Текущий номинал фишки в распоряжении игрока
Game.bets = [];             // Список ставок





// Обработка нажатия игровых клеток
for(let i=0; i< CELL_SET.length; i++){
    CELL_SET[i].onclick = function(){
        Game.createBet(i);
    }
}

