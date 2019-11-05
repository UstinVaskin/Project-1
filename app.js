function init() {

  const elms = Object.create(null)
  const sounds = Object.create(null)

  sounds.sunkShip = new Audio('audio/sankShip.mp3')
  sounds.missShip = new Audio('audio/missShip.mp3')
  sounds.hitShip = new Audio('audio/hitShip.mp3')
  sounds.wonGame = new Audio('audio/wonGame.mp3')
  sounds.lostGame = new Audio('audio/lostGame.mp3')
  sounds.mouseOver = new Audio('audio/mouseOver.mp3')
  sounds.ticClock = new Audio('audio/ticClock.mp3')
  sounds.bubbling = new Audio('audio/bubble.mp3')


  //Globala varsiable
  const dimensions = {
    cols: 8,
    rows: 8
  }
  const circleCount = dimensions.cols * dimensions.rows
  let tries = 38 // Difficulty level

  const ships = {
    Jessi: {
      name: 'Jessi',
      size: 2,
      coords: new Array(2),
      afloat: true,
      mark: 'j',
      color: '#95B544'
    },
    Sub: {
      name: 'Sub',
      size: 2,
      coords: new Array(2),
      afloat: true,
      mark: 's',
      color: '#654321'
    },
    Destroyer: {
      name: 'Destroyer',
      size: 3,
      coords: new Array(3),
      afloat: true,
      mark: 'g',
      color: '#D8B400'
    },
    Battleship: {
      name: 'Battleship',
      size: 4,
      coords: new Array(4),
      afloat: true,
      mark: 't',
      color: '#DD8418'
    },
    Carrier: {
      name: 'Carrier',
      size: 5,
      coords: new Array(5),
      afloat: true,
      mark: 'b',
      color: '#CC4D2A'
    },
    Tanker: {
      name: 'Tanker',
      size: 6,
      coords: new Array(6),
      afloat: true,
      mark: 'T',
      color: '#700353'
    }
  }

  const circles = Object.create(null)
  const circlesKeyList = new Array(circleCount)
  const shipLocations = Object.create(null)
  /*
  {
    '0.0': ships.Jessi,
    '0.1': ships.Jessi,
    '3.2': ships.Sub,
    '4.2': ships.Sub,
  }
  */

  /* createBoard creates the playing field with rows * cols.
  Creates elements on page o simultaneously gives them x, y coordinates and properties id loop ++ */


  function createBoard() {
    const frag = document.createDocumentFragment()
    const { cols } = dimensions
    let col = 0
    let row = 0

    for (let i = 0; i < circleCount; i++) {
      const circle = document.createElement('div')
      const isEndOfRow = i !== 0 && !((i + 1) % cols) // the end is 7
      const coords = `${col}.${row}` // coordintes x.y 

      circle.className = 'circle'
      circle.addEventListener('mouseover', mouseoverSound)

      circlesKeyList[i] = circle.id = coords
      circles[coords] = circle

      if (isEndOfRow) {
        row++
        col = 0
      } else {
        col++
      }

      frag.appendChild(circle)
    }

    elms.board.appendChild(frag)
  }

  function placeShip(ship) {
    let coordList = []
    let invalidPlace = true
    let placementAttemps = 0

    while (invalidPlace) {
      let direction = ''
      let edge = 0

      if (Math.round(Math.random()) === 0) {
        direction = 'vertical'
        edge = dimensions.cols
      } else {
        direction = 'horizontal'
        edge = dimensions.rows
      }

      coordList = genCoords(direction, edge, ship)

      if (coordList) {
        for (let c = coordList.length - 1; c > -1; c--) {
          const coord = coordList[c]
          shipLocations[coord] = ship
          ship.coords[c] = coord
        }
        addShipToSidebar(ship)
        invalidPlace = false
      }
      if (++placementAttemps === 99) {
        console.error(`Can't place ${ship.name}!`)
        invalidPlace = false
      }
    }
  }

  const concatPoints = (dir, a, b) => dir === 'vertical'
    ? `${a}.${b}`
    : `${b}.${a}`

  function genCoords(direction, edge, ship) {
    // pick a random circle (coordinate) to start from
    const startPoint = Math.floor(Math.random() * circleCount - 1) + 1
    const startingCoord = circlesKeyList[startPoint]
    const [col, row] = startingCoord.split('.')

    let point = 0 // this will increase
    let staticPoint = 0 // this stays the same
    if (direction === 'vertical') {
      point = +col
      staticPoint = +row
    } else {
      point = +row
      staticPoint = +col
    }

    const endPoint = point + ship.size

    if (
      shipLocations[startingCoord] // ensure start coord doesn't already have a ship
      || endPoint + 1 > edge // ensure ship won't hang over the edge
    ) {
      return
    }

    const coordList = new Array(ship.size)

    for (let c = ship.size - 1; c > -1; c--) {
      const coord = concatPoints(direction, point++, staticPoint)

      if (shipLocations[coord]) return // abort! intersection detected
      coordList[c] = coord
    }

    return coordList
  }

  // addShipToSidebar renders every ship we place on the playing field sidebar (right), box by box.

  function addShipToSidebar({
    color,
    coords,
    name
  }) {
    const row = elms.sidebarShips[name] = document.createElement('div')

    row.classList.add('circles', `${name}-row`)

    for (let i = 0; i <= coords.length - 1; i++) {
      const circle = document.createElement('div')

      circle.classList.add('circle', name)
      circle.style.setProperty('--sidebar-circle-color', color)

      row.appendChild(circle)
    }

    elms.ships.appendChild(row)
  }


  function addHitToSidebarShip(name, full) {
    const shipCircles = elms.sidebarShips[name].children;
    const ship = ships[name]
    const { size, coords } = ship
    const remainingIdx = coords.length - 1

    for (let c = size - 1; c > remainingIdx; c--)
      shipCircles[c].classList.add('hit')
  }

  /* playerClick is the other "main function" and controls what happens when a player clicks on a box, which text pops up
  on the screen etc. Scenarion: 1) We have already clicked the box. 2) There is a ship where -> run the help functions hitShip to check if a)
  we dropped the ship and b) checkWon if we won. 3) we bar. No matter what, we count down the trials with triesLeft. */


  function playerClick({ target }) {
    if (!target.classList.contains('circle')) return

    target.classList.add('noMove')
    target.removeEventListener('mouseover', mouseoverSound)
    const messageElm = elms

    if (target.bombed) {
      messageElm.classList.add('neutral-text')
      messageElm.textContent = 'You have already bombed that location…'
      return
    }

    target.bombed = true

    const { id } = target
    const ship = shipLocations[id]

    if (ship) { // hit!
      const remainingHits = damageShip(id, shipLocations, messageElm)
      const { hitShip } = sounds

      target.style.setProperty('--circle-color', ship.color)

      hitShip.currentTime = 0
      hitShip.play()

      if (!remainingHits) sinkShip(ship, messageElm)
    } else missShip(target, messageElm)

    setTimeout(triesLeft, 200)
  }

  // If we hit a ship, we remove that coordinate from the ship's location array. When length = 0 it is sunked.

  function damageShip(coord, shipLocations, message) {
    const ship = shipLocations[coord]
    const coordList = ship.coords
    const coordIdx = coordList.indexOf(coord)

    coordList.splice(coordIdx, 1)

    delete shipLocations[coord]

    message.className = 'warning-text'
    message.textContent = `You hit ${ship.name}!`
    addHitToSidebarShip(ship.name, false)

    return coordList.length
  }

  function missShip(circle, message) {
    const { missShip } = sounds

    circle.classList.add('miss')

    message.className = 'error-text'
    message.textContent = 'You missed…'

    missShip.currentTime = 0
    missShip.play()
  }

  function sinkShip(ship, message) {
    const { name } = ship
    ship.afloat = false

    message.className = 'success-text'
    message.textContent = `You sank ${name}!`

    addHitToSidebarShip(name, true)
    sounds.sunkShip.play()
    setTimeout(checkWon, 500)
  }

  // all ships have key / value = float / false all ships are sunked. We've won (endGame). Otherwise, false returns.

  function checkWon() {
    for (const name in ships) {
      const { afloat } = ships[name]

      if (afloat) return false
    }

    setTimeout(endGame(true), 1000) // check in a second 
  }


  function triesLeft() {
    const triesElm = elms.tries
    let message = ''

    switch (tries--) {
      case 0:
        setTimeout(endGame(false), 1000)
        break
      case 10:
        message = 'You are almost out of attempts!' // Streches the grid!!! 
        sounds.ticClock.play()
        break
      default:
        message = `Attempts left: ${tries}`
        break
    }

    triesElm.textContent = message

    return tries
  }

  /* Eng Game. Different messages depending on whether we won or lost.
  the for-loop most recently renders the playing field once more with their "right" colors to show where the ships were low */


  function endGame(won) {
    const messageElm = elms.message

    let message = ''
    let className = ''

    sounds.ticClock.pause()

    if (won) {
      sounds.wonGame.play()
      className = 'success-text'
      message = `Congratulations, you sunk all ships with ${tries + 1} attempts left`
    } else {
      sounds.lostGame.play() // need to stop game and reveal all locations 
      className = 'error-text'
      message = 'The game is over. You lost!'
    }

    messageElm.className = className
    messageElm.textContent = message

    for (const coord in circles) {
      const circle = circles[coord]
      circle.classList.add('noMove')
      // reset backgroundColor
      circle.removeEventListener('mouseover', mouseoverSound)
    }

    elms.board.removeEventListener('click', playerClick)
  }

  // function to play mouseover sound.

  function mouseoverSound() {
    const { mouseOver } = sounds

    mouseOver.currentTime = 0
    mouseOver.play()
  }

  function initSound() {
    elms.h1.addEventListener('mouseover', () => {
      const { bubbling } = sounds
      bubbling.currentTime = bubbling.duration - 1
      bubbling.play()
    })

    elms.soundToggle.addEventListener('click', () => {
      for (const key in sounds) {
        const sound = sounds[key]
        sound.muted = !sound.muted
      }
    })
  }

  function initSelectors() {
    elms.h1 = document.getElementsByTagName('h1')[0]
    elms.board = document.getElementById('board')
    elms.message = document.getElementById('message')
    elms.soundToggle = document.getElementById('muteControl')
    elms.ships = document.getElementById('ships')
    elms.tries = document.getElementById('tries')
    elms.sidebarShips = Object.create(null)
  }

  function setupGame() {
    placeShip(ships.Jessi)
    placeShip(ships.Sub)
    placeShip(ships.Destroyer)
    placeShip(ships.Battleship)
    placeShip(ships.Carrier)
    placeShip(ships.Tanker)
    triesLeft()


    elms.board.addEventListener('click', playerClick)

    console.log(shipLocations)
  }

  initSelectors()

  createBoard()

  setupGame()

  initSound()

  // Enhancement  
  // -> 3 levels of diffculty 
  // 3 buttons => firing wich numb of attempts needs to be czhanged and ganme shouls be fired  
  // buttun: 
  // 1- 45 attemts 
  // 2 - 34 
  // 3 - 30 
  // grid is alawyas the same 8 by 
}
window.addEventListener('DOMContentLoaded', init)
