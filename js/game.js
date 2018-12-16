"use strict";

const TABLE_CELLS = document.getElementsByClassName('cell'); 
const TABLE_CELLS_TEXT = document.getElementsByClassName('cell-amount'); 


class Game{
    constructor(){
        // Набор игровых клеток
        this.cellSet = [];
        
        // Текущий номинал фишек
        this.countChipValue = 5;

        // Инициализируем игровые клетки
        for(let i=0; i<TABLE_CELLS_TEXT.length; i++){
            this.cellSet.push(parseInt(TABLE_CELLS_TEXT[i].innerText));
        }
    }

    // Получить сумму поставленную на клетку
    getCellBetAmount(number){
        if(number > 0 && number <this.cellSet.length)
        {
            return this.cellSet[number];
        }else{
            console.error("Incorrect cell number!");
        }
    }
    
    // Сделать ставку на указанную клетку
    makeBet(number){
        if(number > 0 && number < this.cellSet.length)
        {
            this.cellSet[number] += this.countChipValue;
        }else{
            console.error("Incorrect cell number!");
        }
    }

    // Очистить все ставки
    clearAll(){
        for(let i=0; i < this.cellSet.length; i++){
            this.cellSet[i] = 0;
        }
    }
}

let table = new Game;

console.log(table.getCellBetAmount(2));



// Обработка нажатия игровых клеток
for(let i=0; i< TABLE_CELLS.length; i++){
    TABLE_CELLS[i].onclick = function(){
        game.addCellBetAmount(i)
    }
}