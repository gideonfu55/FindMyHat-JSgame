// Import all required modules:
const prompt = require('prompt-sync')({sigint: true});
const clear = require('clear-screen');

// Instantiate variable
const hat = '^'; // this is my hat
const hole = 'O'; // this is a hole :X
const fieldCharacter = '░'; // this is a 1m by 1m (1 grid) grass patch - used to fill up the field
const pathCharacter = '*'; // this is me
const row = 10;
const col = 10;
let getRowHat = 0; // random number for placement of hat at row
let getColHat = 0; // random number for placement of hat at column

// Building the Field of the game (10 rows by 10 cols):
class Field {
    field = [];

    constructor() {

        // This is for the current location of the character: *
        // The default starting point for the character is at (0, 0)
        this.locationX = 0;
        this.locationY = 0;

        for (let a = 0; a < col; a++) {
            this.field[a] = [];
        }

        this.generateField();
    }

    generateField() {

        for (let y = 0; y < row; y++) {
            for (let x = 0; x < col; x++) {
                this.field[y][x] = fieldCharacter;
            }
        }

        // Set the character location at default (0 ,0) location:
        this.field[0][0] = pathCharacter;

        // Set the "hat" location in a random position other than character starting point - when game starts:
        getRowHat = Math.floor(Math.random() * row);
        getColHat = Math.floor(Math.random() * col);

        if (this.field[getRowHat][getColHat] !== pathCharacter) {
            this.field[getRowHat][getColHat] = hat;
        }

        // Set random holes ('O') on the field:

        for (let i = 0; i < row; i++) {
            for (let j = 0; j < col; j++) {

                // if random number generated is greater than 0.7, it will generate a hole.
                const prob = Math.random();
                if (prob > 0.7 &&
                    this.field[i][j] != hat &&
                    this.field[i][j] != pathCharacter) 
                    {
                        this.field[i][j] = hole;
                    }
                }
            }
        }

    // Create Methods for game:
    
    // When game is running:  
    runGame() {
        // Game state to keep game running or stop:
        let active = true;

        while (active) {
            // Update the current location on the map:
            this.field[this.locationY][this.locationX] = pathCharacter;
            // Create the field:
            this.print();
            // Prompt user for movement:
            this.askQuestion();

            // Execute conditions for game to reach win or lose state:
            if (this.outOfBounds()) {
                console.log("Out of bounds - Game End!");
                active = false;
            } else if (this.fallInHole()) {
                console.log("Sorry, you fell down a hole!");
                active = false;
            } else if (this.gotTheHat()) {
                console.log("Congrats, you found your hat!");
                active = false;
            }
        }
    }

    // Method for field creation:
    print() {
        clear();
        const displayString = this.field.map(row => {
            return row.join('');
        }) .join('\n');
        console.log(displayString);
    }

    // Prompt question to guide player and provide commands:
    askQuestion() {
        const answer = prompt('Which way to move? (w - up, s - down, a - left, d - right) ').toUpperCase();

        // Implement 'commands' to move the character (and replace grass patch hehe):
        switch (answer) {
            case "W":
                // Grass patch replacement:
                this.field[this.locationY][this.locationX] = fieldCharacter;
                // Character movement:
                this.locationY -= 1;
                break;
            case "S":
                this.field[this.locationY][this.locationX] = fieldCharacter;
                this.locationY += 1;
                break;
            case "A":
                this.field[this.locationY][this.locationX] = fieldCharacter;
                this.locationX -= 1;
                break;
            case "D":
                this.field[this.locationY][this.locationX] = fieldCharacter;
                this.locationX += 1;
                break;          
            default:
                console.log('Enter w(up), s(down), a(left) or d(right) to move.');
                this.askQuestion();
                break;
        }
    }

    // // All conditions of the game for winning and losing (game state ends):

    outOfBounds() {
        return (
            // Anything outside the boundaries of the field (i.e. col/row index < 0 or > 9)
            this.locationX < 0 || this.locationY < 0 ||
            this.locationX >= col || this.locationY >= row);
        }

    fallInHole() {
        return this.field[this.locationY][this.locationX] == hole;
    }

    gotTheHat() {
        return this.field[this.locationY][this.locationX] == hat;
    }

} // End of Field class

// Create an instance object for the Field:
const myField = new Field();

// Run the game!
myField.runGame();