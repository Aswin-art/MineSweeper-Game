const board = document.querySelector('.board')
const width = 10
const bombs = 20
let flags = 0
const squares = []

let gameover = false

// Create Board
function createBoard(){

    const bombs_array = Array(bombs).fill('bomb')
    const empty_array = Array(width * width - bombs).fill('valid')
    const game_array = empty_array.concat(bombs_array)

    // Randomly generated bomb and number
    const shuffled_array = game_array.sort(() => Math.random() - .5)

    for(let i = 0; i < width * width - 1; ++i){
        const newElement = document.createElement('div')
        newElement.setAttribute('id', i)
        newElement.classList.add(shuffled_array[i])
        board.append(newElement)
        squares.push(newElement)

        // Left Click
        newElement.addEventListener('click', function(e){
            click(newElement)
        })

        // Right Click
        newElement.oncontextmenu = function(e){
            e.preventDefault()
            addFlag(newElement)
        }
    }

    for(let i = 0; i < squares.length; ++i){
        const is_left_edge = i % width == 0
        const is_right_edge = i == width - 1

        if(squares[i].classList.contains('valid')){
            let total = 0
            if(i > 0 && !is_left_edge && squares[i - 1].classList.contains('bomb')) {total++}
            if(i > 9 && !is_right_edge && squares[i + 1 - width].classList.contains('bomb')) {total++}
            if(i > 10 && squares[i - width].classList.contains('bomb')) {total++}
            if(i > 11 && !is_left_edge && squares[i - 1 - width].classList.contains('bomb')) {total++}
            if(i < 98 && !is_right_edge && squares[i + 1].classList.contains('bomb')) {total++}
            if(i < 90 && !is_left_edge && squares[i - 1 + width].classList.contains('bomb')) {total++}
            if(i < 89 && squares[i + width].classList.contains('bomb')) {total++}
            if(i < 88 && !is_right_edge && squares[i + 1 + width].classList.contains('bomb')) {total++}

            squares[i].setAttribute('data', total)
        }
    }

}

createBoard()

// Click action
function addFlag(square){
    if(gameover) return

    if(!square.classList.contains('checked') && flags < bombs){
        if(square.classList.contains('flag')){
            square.classList.add('flag')
            square.innerHTML = '🚩'
            flags++
            checkWin()
        }else{
            square.classList.remove('flag')
            square.innerHTML = ''
            flags--
        }
    }
}

function click(square){

    let current_id = square.id

    if(gameover || square.classList.contains('checked') || square.classList.contains('flag')){
        return
    }

    if(square.classList.contains('bomb')){
        gameOver()
    }else{
        const total = square.getAttribute('data')
        if(total > 0){
            square.classList.add('checked')
            square.innerHTML = total
            return
        }
    
        checkSquare(square, current_id)
    }

    square.classList.add('checked')
}

// Check neighboring square
function checkSquare(square, current_id){
    const is_left_edge = (current_id % width == 0)
    const is_right_edge = (current_id % width == width - 1)

    setTimeout(() => {
        if(current_id > 0 && !is_left_edge){
            const new_id = squares[parseInt(current_id) - 1].id
            const new_square = document.getElementById(new_id)
            click(new_square)
        }
        if(current_id > 9 && !is_right_edge){
            const new_id = squares[parseInt(current_id) + 1 - width].id
            const new_square = document.getElementById(new_id)
            click(new_square)
        }
        if(current_id > 10){
            const new_id = squares[parseInt(current_id) - width].id
            const new_square = document.getElementById(new_id)
            click(new_square)
        }
        if(current_id > 11 && !is_left_edge){
            const new_id = squares[parseInt(current_id) - 1 - width].id
            const new_square = document.getElementById(new_id)
            click(new_square)
        }
        if(current_id < 98 && !is_right_edge){
            const new_id = squares[parseInt(current_id) + 1].id
            const new_square = document.getElementById(new_id)
            click(new_square)
        }
        if(current_id < 90 && !is_left_edge){
            const new_id = squares[parseInt(current_id) - 1 + width].id
            const new_square = document.getElementById(new_id)
            click(new_square)
        }
        if(current_id < 89){
            const new_id = squares[parseInt(current_id) + width].id
            const new_square = document.getElementById(new_id)
            click(new_square)
        }
        if(current_id < 88 && !is_right_edge){
            const new_id = squares[parseInt(current_id) + 1 + width].id
            const new_square = document.getElementById(new_id)
            click(new_square)
        }
    }, 10)
}

// Gameover
function gameOver(){
    gameover = true
    squares.forEach(square => {
        if(square.classList.contains('bomb')){
            square.innerHTML = '💣'
        }
    })

    alert('GAME OVER!')
}

// Check for Win
function checkWin(){
    let matches = 0
    for(let i = 0; i < squares.length; ++i){
        if(squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')){
            matches++
        }

        if(matches == bombs){
            gameOver = true
            alert('You Winnn!!!')
        }
    }
}