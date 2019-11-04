//Globala variable
var playingField = [];
var cols = 9;
var rows = 9;
var squares = cols * rows;
var tries = 50;
var message = "";

// Ships are objects 

var ships = {
  Jolle: {
    name: "Jolle",
    size: 2,
    location: [],
    float: true,
    color: "red"


      /* createPlay creates the playing field with rows * cols.
      Adds objects to the playingField array for each box with coordinates and ship false or hit false.
      Creates elements on page o simultaneously gives them id and properties and classes*/
// className = "???";
//square.style.background = ??? blah blah blah 

      // function createPlay() {
      //  rows with id 
      //  rows with propeties 
      //  sqaures with propetiers id 


      //Place ships  

      /* This is the main function. Randomly comes first if we are going to put on a row or column. We then run the two help functions createShip and testShip.
      If the tests go through, we place the ship on the playing field as well as in the sidebar, send the correct coordinates to the ship and break the loop.
      Test the ship 100 times, then an error message is printed in the console.=> so the while isn';t infinite */


      /* createShip returns a new propsal (array) on a ship's location. The conditions are that
      there is no ship is on the starting point and that it will fit on the playing field
      

      (starting point + ship size <= row / column size).
      
      If we add horizontally, we add 1 for each coordinate. Vertically we add the number of squares on a row. 
      
      //var startPoint = Math.floor(Math.random() * squares - 1) + 1;
      
       // location +1 extra untill ship.lenght 
      
      // function createShip(axis, dir, thisShip, add) {
      
      
      TEST SHIP 
      //help function testShip checks if any of the ship's coordinates are occupied by a ship and returns isf false to placeShip, otherwise true.
      
      checkks the length of new ship 
      
      
      
      SIDE BAR 
      // createSidebarShips renders every ship we place on the playing field sidebar (right), box by box.
      
      /* showSidebarShips fixes the effects in the sidebar to the right. When we hit a box where there is a ship, the box gets
      dynamic color + opacity (depending on how many parts we lowered o how big the ship is). When we lowered it the whole line gets "glow". */



      /* Printplayingfield created from the beginning to print the ship's location in the console.
           (A row is printed when the string is equal to the number of columns).Now it is also used to add event listeners
     dynamic for each box rendered on the playing field(listens for clicks or mouseover to pleay sounds). */


      /* playerClick is the other "main function" and controls what happens when a player clicks on a box, which text pops up
      on the screen etc. Scenarion:
       1) We have already clicked the box.
        2) There is a ship where -> run the help functions hitShip to check if a)
      we dropped the ship and b) checkWon if we won. 
      3) No matter what, we count down the trials with triesLeft. */


      // If we hit a ship, we remove that coordinate from the ship's location array. When length = 0 it is sunked. so float = false

      // all ships have key / value = float / false all ships are sunked. We've won (endGame). Otherwise, false returns.

      // triesLeft counts down the number of attempts we have left. With 10 attempts left, it warns. At 0 we have lost (endGame).


//ENDGAME.Different messages depending on whether we won or lost.
// the for-loop most recently renders the playing field once more with their "right" colors to show where the ships were low * /

// function to play mouseover sound.


//GameStart calls out features needed at game launch and puts out the ships we want.

// createPlay()
// placeShip(ships.Jolle)
//     Add other ships 
//     printPlayingField()
// triesLeft()
//   }

