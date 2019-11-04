function init() {

  const s = Object.create(null)
  const sounds = Object.create(null)

  sounds.sunkShip = new Audio('Audio/sankShip.mp3')
  sounds.missShip = new Audio('Audio/missShip.mp3')
  sounds.hitShip = new Audio('Audio/hitShip.mp3')
  sounds.wonGame = new Audio('Audio/wonGame.mp3')
  sounds.lostGame = new Audio('Audio/lostGame.mp3')
  sounds.mouseOver = new Audio('Audio/mouseOver.mp3')
  sounds.ticClock = new Audio('Audio/ticClock.mp3')
  sounds.bubbling = new Audio('Audio/bubble.mp3')


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

  const circles = {}
  const circlesKeyList = new Array(circleCount)
  const shipLocations = {}
  /*
  {
    '0.0': ships.Jessi,
    '0.1': ships.Jessi,
    '3.2': ships.Sub,
    '4.2': ships.Sub,
  }
  */

  /* fillBoard creates the playing field with rows * cols.
  Creates elements on page o simultaneously gives them x, y coordinates and properties id loop ++ */


  function fillBoard() {
    const frag = document.createDocumentFragment()
    const { cols } = dimensions
    let col = 0
    let row = 0
    for (let i = 0; i < circleCount; i++) {
      const circle = document.createElement('div')
      const isEndOfRow = i !== 0 && !((i + 1) % cols) // the end is 7
      const coords = `${col}.${row}` // coordintes x.y 

      circle.className = 'circle'
      circle.addEventListener('click', playerClick)
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

    s.boardElm.appendChild(frag)
  }

  function placeShip(ship) {
    let coordList = []
    let invalidPlace = true
    let placementAttemps = 0

    while (invalidPlace) {
      let direction = ''
      let edge = 0
      // let add = 0;

      if (Math.round(Math.random()) === 0) {
        direction = 'vertical'
        edge = dimensions.cols
        // add = 1
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
        createSidebar(ship)
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

  // createSidebar renders every ship we place on the playing field sidebar (right), box by box.

  function createSidebar({
    color,
    coords,
    name
  }) {
    const row = document.createElement('div')

    row.classList.add('circles', `${name}-row`)

    for (let i = 0; i <= coords.length - 1; i++) {
      const circle = document.createElement('div')

      circle.classList.add('circle', name)
      circle.style.background = color

      row.appendChild(circle)
    }

    s.shipsElm.appendChild(row)
  }


  /* showSidebar fixes the effects in the sidebar to the right. When we hit a box where there is a ship, the box gets
  dynamic color + opacity (depending on how many parts we lowered o how big the ship is). */


  function showSidebar(name, full) {
    const shipOpac = document.getElementsByClassName(name)
    const circleHit = ships[name].size - ships[name].coords.length
    const dynamicOpac = 1 / ships[name].size
    let opac = dynamicOpac * circleHit
    if (full) opac = 1
    for (let i = 0; i < circleHit; i++) {
      shipOpac[i].style.opacity = opac
      if (full) {
        shipOpac[i]
      }
    }
  }

  /* playerClick is the other "main function" and controls what happens when a player clicks on a box, which text pops up
  on the screen etc. Scenarion: 1) We have already clicked the box. 2) There is a ship where -> run the help functions hitShip to check if a)
  we dropped the ship and b) checkWon if we won. 3) we bar. No matter what, we count down the trials with triesLeft. */


  function playerClick() {
    this.classList.add('noMove')
    this.removeEventListener('mouseover', mouseoverSound)
    const { messageElm } = s

    if (this.bombed) {
      messageElm.classList.add('black')
      messageElm.textContent = 'You have already bombed that location…'
      return
    }

    this.bombed = true

    const ship = shipLocations[this.id]

    if (ship) { // hit!
      const remainingHits = damageShip(this.id, shipLocations, messageElm)
      const { hitShip } = sounds

      this.style.backgroundColor = ship.color

      hitShip.currentTime = 0
      hitShip.play()

      if (!remainingHits) sinkShip(ship, messageElm)
    } else missShip(this, messageElm)

    setTimeout(triesLeft, 200)
  }

  // If we hit a ship, we remove that coordinate from the ship's location array. When length = 0 it is sunked.

  function damageShip(coord, shipLocations, messageElm) {
    const ship = shipLocations[coord]
    const coordList = ship.coords
    const coordIdx = coordList.indexOf(coord)

    coordList.splice(coordIdx, 1)

    delete shipLocations[coord]

    messageElm.className = 'yellow'
    messageElm.textContent = `You hit ${ship.name}!`
    showSidebar(ship.name, false)

    return coordList.length
  }

  function missShip(circle, messageElm) {
    const { missShip } = sounds

    circle.classList.add('miss')

    messageElm.className = 'red'
    messageElm.textContent = 'You missed…'

    missShip.currentTime = 0
    missShip.play()
  }

  function sinkShip(ship, messageElm) {
    const { name } = ship
    ship.afloat = false

    messageElm.className = 'green'
    messageElm.textContent = `You sank ${name}!`

    showSidebar(name, true)
    sounds.sunkShip.play()
    setTimeout(checkWon, 500)
  }

  // all ships have key / value = float / false all ships are sunked. We've won (endGame). Otherwise, false returns.

  function checkWon() {
    for (const name in ships) {
      const { afloat } = ships[name]

      if (afloat) return false
    }

    setTimeout(endGame(true), 1000)
  }


  function triesLeft() {
    const { triesElm } = s
    let message = ''

    switch (tries--) {
      case 0:
        setTimeout(endGame(false), 1000)
        break
      case 10:
        message = 'You are almost out of attempts!'
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
    sounds.ticClock.pause()
    let message = ''
    let className = ''

    if (won) {
      sounds.wonGame.play()
      className = 'green'
      message = `Congratulations, you sunk all ships with ${tries + 1} attempts left`
    } else {
      sounds.lostGame.play()
      className = 'red'
      message = 'The game is over. You lost!'
    }

    s.messageElm.className = className
    s.messageElm.textContent = message

    for (const circle in circles) {
      circle.classList.add('noMove')
      // reset backgroundColor
      circle.removeEventListener('click', playerClick)
      circle.removeEventListener('mouseover', mouseoverSound)
    }
  }

  // function to play mouseover sound.

  function mouseoverSound() {
    const { mouseOver } = sounds

    mouseOver.currentTime = 0
    mouseOver.play()
  }

  function initSound() {
    s.h1Elm.addEventListener('mouseover', () => {
      const { bubbling } = sounds
      bubbling.currentTime = bubbling.duration - 1
      bubbling.play()
    })
  }


  // function soudOff() {
  //   s.muteControlElm.addEventListener('click', () => {
  //     const { bubbling } = sounds


  //     bubbling.pause()
  //   })
  // }





  function initSelectors() {
    s.h1Elm = document.getElementsByTagName('h1')[0]
    s.boardElm = document.getElementById('board')
    s.messageElm = document.getElementById('message')
    s.muteControlElm = document.getElementById('muteControl')
    s.shipsElm = document.getElementById('ships')
    s.triesElm = document.getElementById('tries')
  }


  //GameStart calls out features needed at game launch and puts out the ships we want.

  function GameStart() {

    initSelectors()

    fillBoard()
    placeShip(ships.Jessi)
    placeShip(ships.Sub)
    placeShip(ships.Destroyer)
    placeShip(ships.Battleship)
    placeShip(ships.Carrier)
    placeShip(ships.Tanker)
    triesLeft()
    initSound()
    // soudOff()
    console.log(shipLocations)
  }

  GameStart()

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