"use strict";

const TABLE_CELLS           = document.getElementsByClassName('cell'); 
const TABLE_CELLS_TEXT      = document.getElementsByClassName('cell-amount'); 
const INTERFACE_BALANCE     = document.getElementById('balance-text');
const INTERFACE_BET_LOG     = document.getElementById('bets-list-text');
const BUTTON_SPIN           = document.getElementById('spin');
const BUTTON_CLEAR          = document.getElementById('clear');
const BUTTON_CONTINUE       = document.getElementById('continue');
const WHEEL                 = document.getElementById('wheel'); 
const RESULT                = document.getElementById('result'); 

class Game{
    constructor(){
        // Набор игровых клеток
        this.cellSet = [];
        
        // Текущий номинал фишек
        this.countChipValue = 5;

        // Находится ли рулетка в процессе или ожидает пуска игроком
        this.rouletteInProcess = false;

        // Баланс пользователя
        this.userBalance = 2000;
        // Предыдущий баланс. Нужно для отката при отмене ставок
        this.userBalancePrev = this.userBalance;

        // Устанавливаем исходную позицию рулетки
        this._rouletteDegree = this._getRandom(0, 360);
        WHEEL.style.transform = 'rotate(' + this._rouletteDegree + 'deg)';

        // Инициализируем игровые клетки
        for(let i=0; i<TABLE_CELLS_TEXT.length; i++){
            this.cellSet.push(0);
        }
    }

    // Получить сумму ставок поставленных на клетку
    getCellBetAmount(number){
        if(number >= 0 && number <this.cellSet.length)
        {
            return this.cellSet[number];
        }else{
            console.error("Incorrect cell number!");
        }
    }
    
    // Сделать ставку на указанную клетку
    makeBet(number){
        if(number >= 0 && number < this.cellSet.length)
        {
            if(this.userBalance - this.countChipValue > 0){
                this.cellSet[number] += this.countChipValue;
                this.userBalance -= this.countChipValue;
            }
            else{
                alert("You haven't money to make bets!");
            }
        }else{
            console.error("Incorrect cell number!");
        }
        this._updateInterface();
    }

    // Очистить все ставки
    clearAll(){
        for(let i=0; i < this.cellSet.length; i++){
            this.cellSet[i] = 0;
            TABLE_CELLS_TEXT[i].innerText = "";
        };

        // Откат баланса до предыдущего состояния
        this.userBalance = this.userBalancePrev;
        this._updateInterface();
    }

    // Подготовить игру к следующему раунду
    prepareNextSpin(){
        this.rouletteInProcess = false;

        // Убираем предыдущее состояние баланса.
        this.userBalancePrev = this.userBalance;

        // Обновляем сумму ставок на клетках
        this.clearAll();

        // Обновляем вывод результатов
        RESULT.style.background = "#066806";
        RESULT.innerText = "???";

        this._updateInterface();
    }

    // Приватный метод. Обновление интерфейса
    _updateInterface(){
        // Обновляем баланс игрока
        INTERFACE_BALANCE.innerText = this.userBalance;
        
        // Обновляем сумму ставок на клетках
        for(let i=0; i < this.cellSet.length; i++){
            if(this.cellSet[i] > 0){
                TABLE_CELLS_TEXT[i].innerText = this.cellSet[i];
            }
        }

        // Обновляем кнопки
        if(game.rouletteInProcess == true){
            BUTTON_SPIN.className = "button hidden";
            BUTTON_CLEAR.className = "button hidden";
            BUTTON_CONTINUE.className = "button";
        }
        else{
            BUTTON_SPIN.className = "button";
            BUTTON_CLEAR.className = "button";
            BUTTON_CONTINUE.className = "button hidden";
        }
    }

    // Приватный метод. Получение случайного числа
    _getRandom(min, max){
        let rand = min + Math.random() * (max + 1 - min);
        rand = Math.floor(rand);
        return rand;
    }

    // Оплата выигрыша в соответствие с коэффициентом
    _payWinnings(koeff, cell){
        this.userBalance += (this.cellSet[cell] + this.cellSet[cell] * koeff);
    }

    // Запуск рулетки
    startSpin(){
        let logString = `BET: ${this.userBalancePrev - this.userBalance}usd, PREVIOUS: ${this.userBalancePrev}usd, `;
        this.rouletteInProcess = true;

        // Убираем предыдущее состояние баланса.
        
        this.userBalancePrev = this.userBalance;

        this._updateInterface();
        
        let speed = 8;
        let degree = this._getRandom(0.00, 360.00);
        let result = 0;

        let timerId = setTimeout(function animation(){
            WHEEL.style.transform = 'rotate(' + degree + 'deg)';

            degree += speed;
            speed -= 0.02;

            if(speed > 0.02){
                timerId = setTimeout(animation, 10)

                result = game._getRandom(0, 36);

                RESULT.innerText = result;
            }
            else{
                clearTimeout(timerId);

                let blackCells  = [2, 4, 6, 8, 10, 11, 13 ,15, 17, 20, 22, 24, 26, 28, 29,31, 33, 35];
                let redCells    = [1, 3 ,5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

                for(let i=0; i<redCells.length; i++){
                    if(redCells[i] == result){
                        RESULT.style.background = "#b60a0a";
                    }
                }
                for(let i=0; i<blackCells.length; i++){
                    if(blackCells[i] == result){
                        RESULT.style.background = "#000";
                    }
                }
                if(0 == result){
                    RESULT.style.background = "#066806";
                }

                // Check Number
                for(let i=0; i<=36; i++){
                    if(game.cellSet[i] > 0 && i == result){
                        game._payWinnings(35, i);
                    }
                }

                // Check Dozen 1
                for(let i=1; i<=12; i++){
                    if(game.cellSet[37] > 0 && i == result){
                        game._payWinnings(2, 37);
                    }
                }

                // Check Dozen 2
                for(let i=13; i<=24; i++){
                    if(game.cellSet[38] > 0 && i == result){
                        game._payWinnings(2, 38);
                    }
                }

                // Check Dozen 3
                for(let i=25; i<=36; i++){
                    if(game.cellSet[39] > 0 && i == result){
                        game._payWinnings(2, 39);
                    }
                }

                // Check Even
                for(let i=2; i<=36; i=i+2){
                    if(game.cellSet[41] > 0 && i == result){
                        game._payWinnings(1, 41);
                    }
                }

                // Check Odd
                for(let i=1; i<=35; i=i+2){
                    if(game.cellSet[44] > 0 && i == result){
                        game._payWinnings(1, 44);
                    }
                }

                // Check Black
                for(let i=0; i<blackCells.length; i++){
                    if(game.cellSet[42] > 0 && blackCells[i] == result){
                        game._payWinnings(1, 42);
                    }
                }
                
                // Check Red
                for(let i=0; i<redCells.length; i++){
                    if(game.cellSet[43] > 0 && redCells[i] == result){
                        game._payWinnings(1, 43);
                    }
                }

                // Check Less 1-18
                for(let i=1; i<=18; i++){
                    if(game.cellSet[40] > 0 && i == result){
                        game._payWinnings(1, 40);
                    }
                }

                // Check More 19-36
                for(let i=19; i<=36; i++){
                    if(game.cellSet[45] > 0 && i == result){
                        game._payWinnings(1, 45);
                    }
                }

                // Check 2 to 1 TOP   (46, 47, 48)
                for(let i=3; i<=36; i=i+3){
                    if(game.cellSet[46] > 0 && i == result){
                        game._payWinnings(2, 46);
                    }
                }

                // Check 2 to 1 MIDDLE
                for(let i=2; i<=35; i=i+3){
                    if(game.cellSet[47] > 0 && i == result){
                        game._payWinnings(2, 47);
                    }
                }

                // Check 2 to 1 BOTTOM
                for(let i=1; i<=34; i=i+3){
                    if(game.cellSet[48] > 0 && i == result){
                        game._payWinnings(2, 48);
                    }
                }
                

                logString += ` RESULT: ${game.userBalance}usd \n\n`;
                INTERFACE_BET_LOG.innerText = logString + INTERFACE_BET_LOG.innerText;
                game._updateInterface();
            }
        }, 10);
    }
}

let game = new Game;

// Обработка нажатия игровых клеток
for(let i=0; i< TABLE_CELLS.length; i++){
    TABLE_CELLS[i].onclick = function(){
        game.makeBet(i);
    }
}
BUTTON_SPIN.onclick = function(){
    game.startSpin();
}
BUTTON_CLEAR.onclick = function(){
    game.clearAll();
}
BUTTON_CONTINUE.onclick = function(){
    game.prepareNextSpin();
}