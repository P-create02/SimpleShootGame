const allPlane = document.querySelectorAll(".plane")
const choosePlaneSection = document.querySelector(".choose-plane")
const gameSection = document.querySelector(".game")

const squares = document.querySelectorAll('.border-game div')
const resultDisplay = document.querySelector('.points')

const sound_02 = document.querySelector('.sound-02')
const sound_01 = document.querySelector('.sound-01')

const winSection = document.querySelector('.win')
const defeatSection = document.querySelector('.defeat')

let height = 10
let width = 20
let currentAirCraftIndex = 194
let currentInvadersIndex = 0
let alienInvaderKilled = []
let result = 0
let direction = 1
let invaderId

const alienInvaders = [
    2, 3, 4, 5, 6, 7, 8, 9,10,11,12,13,14,15,16,17,18,19,
    20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,
    42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59
]



allPlane.forEach(function(plane){
    plane.addEventListener("click", function(e){

        choosePlaneSection.classList.add("start-game");
        gameSection.classList.add("game-play");

        const nameOfPlane = e.currentTarget.dataset.id;
        // console.log(nameOfPlane);


        // draw opponents
        alienInvaders.forEach( invader => squares[currentInvadersIndex + invader].classList.add('invader'))

        // draw plane
        if(nameOfPlane === "fa-fighter-jet") squares[currentAirCraftIndex].classList.add('f16')
        else if(nameOfPlane === "fa-place-of-worship") squares[currentAirCraftIndex].classList.add('long-plane')
        else squares[currentAirCraftIndex].classList.add('basic-plane')
    

        // move our plane
        function moveAirCraft(e){
            if(nameOfPlane === "fa-fighter-jet") squares[currentAirCraftIndex].classList.remove('f16')
            else if(nameOfPlane === "fa-place-of-worship") squares[currentAirCraftIndex].classList.remove('long-plane')
            else squares[currentAirCraftIndex].classList.remove('basic-plane')
            
            switch(e.keyCode){
                case 37:
                    if(currentAirCraftIndex % width !== 0) currentAirCraftIndex -= 1
                    break
                case 39:
                    if(currentAirCraftIndex % width < width - 1) currentAirCraftIndex +=1
                    break
            }
            if(nameOfPlane === "fa-fighter-jet") squares[currentAirCraftIndex].classList.add('f16')
            else if(nameOfPlane === "fa-place-of-worship") squares[currentAirCraftIndex].classList.add('long-plane')
            else squares[currentAirCraftIndex].classList.add('basic-plane')
        }
        document.addEventListener("keydown", moveAirCraft)

        // move out opponents
        function moveInvaders(){
            const leftEdge = alienInvaders[0] % width === 0
            const rightEdge = alienInvaders[alienInvaders.length - 8] % width === width - 1

            if((leftEdge && direction === 1) || (rightEdge && direction === -1)){
                direction = width
            } else if(direction === width){
                if(leftEdge) direction = 1
                else direction = -1
            }
            for(let i=0; i <= alienInvaders.length - 1; i++){
                squares[alienInvaders[i]].classList.remove('invader')
            }
            for(let i=0; i <= alienInvaders.length - 1; i++){
                alienInvaders[i] += direction
            }
            for(let i=0; i <= alienInvaders.length - 1; i++){
                if(!alienInvaderKilled.includes(i)){
                    squares[alienInvaders[i]].classList.add('invader')
                }
            }

            if(squares[currentAirCraftIndex].classList.contains('invader', 'aircaft')){
                resultDisplay.textContent = 'Game Over'
                squares[currentAirCraftIndex].classList.add('boom')
                defeatSection.classList.add('defeat_active')
                gameSection.classList.remove("game-play");
                clearInterval(invaderId)

                defeatSection.addEventListener("click", function(){
                    location.reload();
                })
            }

            for(let i=0; i <= alienInvaders.length - 1; i++){
                if(alienInvaders[i] > squares.length){
                    resultDisplay.textContent = 'Game over'
                    defeatSection.classList.add('defeat_active')
                    gameSection.classList.remove("game-play");
                    clearInterval(invaderId)

                    defeatSection.addEventListener("click", function(){
                        location.reload();
                    })
                }
            }

            if(alienInvaderKilled.length === alienInvaders.length){
                resultDisplay.textContent = "YOU WIN"
                winSection.classList.add('win_active')
                gameSection.classList.remove("game-play");
                clearInterval(invaderId)

                winSection.addEventListener("click", function(){
                    location.reload();
                })
            }
        }
        invaderId = setInterval(moveInvaders, 500)


        function shoots(e){
            let shootId
            let currenShootIndex = currentAirCraftIndex

            function moveShoots(){
                squares[currenShootIndex].classList.remove('shoot')
                currenShootIndex -= width
                squares[currenShootIndex].classList.add('shoot')

                sound_02.play();
                sound_01.play();

                if(squares[currenShootIndex].classList.contains('invader')){
                    squares[currenShootIndex].classList.remove('shoot')
                    squares[currenShootIndex].classList.remove('invader')
                    squares[currenShootIndex].classList.add('boom')

                    

                    setTimeout(() => squares[currenShootIndex].classList.remove('boom'), 200)

                    clearInterval(shootId)

                    const alienTakenDown = alienInvaders.indexOf(currenShootIndex)
                    alienInvaderKilled.push(alienTakenDown)
                    result++
                    resultDisplay.textContent = result
                }

                if(currenShootIndex < height){
                    clearInterval(shootId)
                    setTimeout(() => squares[currenShootIndex].classList.remove('shoot'), 100)
                }
            }

            switch(e.keyCode){
                case 32:
                    shootId = setInterval(moveShoots, 100)
                    break
            }
        }

        document.addEventListener("keyup", shoots)
    })
})

