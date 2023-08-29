
//When the loads... 
document.addEventListener('DOMContentLoaded', () => {
  //selecting items in the htmls and making variables
  const grid = document.querySelector('.grid')
  const flagsLeft = document.querySelector('#flags-left')
  const fire = document.querySelector('#flame');
  const result = document.querySelector('#result')
  let width = 10
  let bombAmount = 20
  let flags = 0
  //recieves the divs pushed by the for loop in createBoard()
  let squares = []
  let isGameOver = false


  function createBoard() {
    flagsLeft.innerHTML = bombAmount

    //randomized array of bombs

    //.fill literally fills an array
    const bombsArray = Array(bombAmount).fill('bomb')
    //emptyArray = 100-20 divs "filled" with the word valid
    const emptyArray = Array(width*width - bombAmount).fill('valid')
    //concat joins the emptyArray with the bombsArray
    const gameArray = emptyArray.concat(bombsArray)
    //randomize the order of contents of games array
    const shuffledArray = gameArray.sort(() => Math.random() -0.5)

    //creates a div, sets it's id=i and repeats it
    //because of the set width of the grid div, the for loop repeats 100x
    for(let i = 0; i < width*width; i++) {
      const square = document.createElement('div')
      square.setAttribute('id', i)
      //adds the contents from the arrays and set them as the id of 100 divs
      square.classList.add(shuffledArray[i])
      grid.appendChild(square)
      squares.push(square)

      //left click
      square.addEventListener('click', function(e) {
        click(square)
        
      })


      square.oncontextmenu = function(e) {
        e.preventDefault()
        addFlag(square)
      }
    }

    //add numbers
    for (let i = 0; i < squares.length; i++) {
      let total = 0
      // if the modulus of i/width is 0 we are on the left hand side of the grid
      const isLeftEdge = (i % width === 0)
      // if the modulus i/width is 9 we are at the right edge
      const isRightEdge = (i % width === width -1)

      if (squares[i].classList.contains('valid')) {
        //i>0; not at the left edge; checks the div to the left then total +1
        if (i > 0 && !isLeftEdge && squares[i -1].classList.contains('bomb')) total ++

        // i>9; not at the right edge; checks the div to the top right then total +1
        if (i > 9 && !isRightEdge && squares[i +1 -width].classList.contains('bomb')) total ++

        // i>10; checks box on top then total +1
        if (i > 10 && squares[i -width].classList.contains('bomb')) total ++

        //i > 11; is not at the left edge; checks top left then total +1
        if (i > 11 && !isLeftEdge && squares[i -1 -width].classList.contains('bomb')) total ++

        // i<98; is not at the right edge; checks right then total +1
        if (i < 98 && !isRightEdge && squares[i +1].classList.contains('bomb')) total ++

        //i< 90; is not at the left edge; checks bottom left then total +1
        if (i < 90 && !isLeftEdge && squares[i -1 +width].classList.contains('bomb')) total ++
        
        //is< 88; is not at the right edge; checks bottom right then total +1
        if (i < 88 && !isRightEdge && squares[i +1 +width].classList.contains('bomb')) total ++

        //i< 89 checks below
        if (i < 89 && squares[i +width].classList.contains('bomb')) total ++

        // sets data of squares[i] to its total value
        squares[i].setAttribute('data', total)
        
      }
    }
  }
  createBoard()

  //add Flag with right click
  function addFlag(square) {
    if (isGameOver) return
    if (!square.classList.contains('checked') && (flags < bombAmount)) {
      if (!square.classList.contains('flag')) {
        square.classList.add('flag')
        square.innerHTML = "<img src='./Assets/checked.png'>";
        flags ++
        flagsLeft.innerHTML = bombAmount- flags
        checkForWin()
      } else {
        square.classList.remove('flag')
        square.innerHTML = ''
        flags --
        flagsLeft.innerHTML = bombAmount- flags
      }
    }
  }

  //click on square actions
  function click(square) {
    let currentId = square.id
    //if the game is over nothing happens when click
    if (isGameOver) return

    // if the div contains checked or flag nothing happens when clicked
    if (square.classList.contains('checked') || square.classList.contains('flag')) return
    if (square.classList.contains('bomb')) {
      gameOver(square)
    } else {
      let total = square.getAttribute('data')
      if (total !=0) {
        square.classList.add('checked')
        if (total == 1) square.classList.add('one')
        if (total == 2) square.classList.add('two')
        if (total == 3) square.classList.add('three')
        if (total == 4) square.classList.add('four')
        square.innerHTML = total
        square.style.backgroundImage  = "url('./Assets/valid.png')"
        
        return
      }
      checkSquare(square, currentId)
    }
    square.classList.add('checked')
  }


  //check neighboring squares once square is clicked
  function checkSquare(square, currentId) {
    const isLeftEdge = (currentId % width === 0)
    const isRightEdge = (currentId % width === width -1)

    //happens after 10 milliseconds
    // the 10 millisecond delay gives the illusion of a sweeping animation
    // current is the squares id (the number of that square on the grid i.e. 0-99)
    setTimeout(() => {

      // if criteria is met, performs click() on the square to the left
      if (currentId > 0 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) -1].id
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }

      // if criteria is met, performs click() on the square to the top right
      if (currentId > 9 && !isRightEdge) {
        const newId = squares[parseInt(currentId) +1 -width].id
         const newSquare = document.getElementById(newId)
        click(newSquare)
      }

      // if criteria is met, performs click() on the square to the top
      if (currentId > 10) {
        const newId = squares[parseInt(currentId -width)].id
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }

      // if criteria is met, performs click() on the square to the top left
      if (currentId > 11 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) -1 -width].id
         const newSquare = document.getElementById(newId)
        click(newSquare)
      }

      // if criteria is met, performs click() on the square to the right
      if (currentId < 98 && !isRightEdge) {
        const newId = squares[parseInt(currentId) +1].id
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }

      // if criteria is met, performs click() on the square to the bottom left
      if (currentId < 90 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) -1 +width].id
               const newSquare = document.getElementById(newId)
        click(newSquare)
      }

      // if criteria is met, performs click() on the square to the bottom right
      if (currentId < 88 && !isRightEdge) {
        const newId = squares[parseInt(currentId) +1 +width].id
             const newSquare = document.getElementById(newId)
        click(newSquare)
      }

      // if criteria is met, performs click() on the square to the bottom
      if (currentId < 89) {
        const newId = squares[parseInt(currentId) +width].id
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      //changes the back ground image
      square.style.backgroundImage  = "url('./Assets/valid.png')"
    }, 10)
  }

  //game over
  function gameOver(square) {
    result.innerHTML = 'BOOM! Game Over!'
    isGameOver = true

    fire.style.display = 'flex';

    //show ALL the bombs
    squares.forEach(square => {
      if (square.classList.contains('bomb')) {
        square.innerHTML = '💣'
        square.classList.remove('bomb')
        square.classList.add('checked')
      }
    })
  }

  //check for win
  function checkForWin() {

  let matches = 0

    for (let i = 0; i < squares.length; i++) {
      if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
        matches ++
      }
      if (matches === bombAmount) {
        result.innerHTML = 'YOU WIN!'
        isGameOver = true

        for (let x = 0; x<900; x++) {
          setInterval(animateWin(x), 1)
          
        }
        


      }
    }
  }

  const tank = document.querySelector('.tankTest');
  const container = document.querySelector('.container');
  const containerWidth = container.clientWidth;
  const tankWidth = tank.clientWidth;
  const distance = containerWidth / 4;
  const duration = 6000; // adjust the duration as desired

  let startTime = null;
  let currentPosition = -30;

  function animate(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsedTime = timestamp - startTime;
    currentPosition = -30 + (elapsedTime / duration) * distance;
    if (currentPosition <= distance) {
      tank.style.left = currentPosition-150 + 'px';
      requestAnimationFrame(animate);
    }
  }

requestAnimationFrame(animate);



function animateWin(x){
  if (isGameOver = true) {
}
tank.style.left =currentPosition - 150 + x + 'px'
 
}

})



