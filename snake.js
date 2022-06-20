const GridEnum = { "clear": 0, "wall": 1, "food": 3, "snake": 4 };
Object.freeze(GridEnum);

class SnakeGame {

    constructor(snakeboardHTML,
                snakeboardHTML_ctx,
                scoreHTML,
                board_col = 'white',
                board_border = 'black',
                snake_col = 'lightblue',
                snake_border = 'darkblue',
                apple_col = 'lightgreen',
                apple_border = 'darkgreen',
                wall_col = 'grey',
                wall_border = 'black'
    ) {
        // HTML elements
        this.snakeboardHTML = snakeboardHTML;
        this.snakeboardHTML_ctx = snakeboardHTML_ctx;
        this.scoreHTML = scoreHTML;

        // Colour information
        this.board_col = board_col;
        this.board_border = board_border;
        this.snake_col = snake_col;
        this.snake_border = snake_border;
        this.apple_col = apple_col;
        this.apple_border = apple_border;
        this.wall_col = wall_col;
        this.wall_border = wall_border;

        // console.log(this.snakeboardHTML.width);
        // console.log(this.snakeboardHTML.height);
        if (((this.snakeboardHTML.width % 10) != 0) || ((this.snakeboardHTML.height % 10) != 0)) {
            console.log('ERROR: There has been an error, inspect javascript.');
        }

        this.gridWidth = this.snakeboardHTML.width / 10;
        this.gridHeight = this.snakeboardHTML.height / 10;
        // console.log(this.gridWidth);
        // console.log(this.gridHeight);
        this.grid = Array(this.gridWidth).fill(0).map(x => Array(this.gridHeight).fill(0));

        for (let i = 0; i < this.gridWidth; i++) {
            this.grid[i][0] = 1;
            this.grid[i][this.gridHeight - 1] = 1;
        }

        for (let i = 0; i < this.gridHeight; i++) {
            this.grid[0][i] = 1;
            this.grid[this.gridWidth - 1][i] = 1;
        }

        let snakeCentX = (this.gridWidth / 2);
        let snakeCentY = (this.gridHeight / 2);

        this.snake = [
            { x: snakeCentX + 1, y: snakeCentY },
            { x: snakeCentX, y: snakeCentY },
            { x: snakeCentX - 1, y: snakeCentY }
        ];

        // this.snake.forEach(function storeSnakePart(part) {           // <-|
        //     console.log(this);                                       //   |
        //     this.grid[part.x][part.y] = 3;// GridEnum.snake;         //   |----> Why are these busted? 
        // });                                                          //   |
        //                                                              //   |
        // this.snake.forEach(this.storeSnakePart);                     // <-|

        for (let i = 0; i < this.snake.length; i++) {
            this.storeSnakePart(this.snake[i]);
        }

        this.genNewFood()

        // console.log(this.grid);
        this.draw();

        this.score = 0;
        this.dirChange = false;
        this.dx = 1;
        this.dy = 0;

        this.main()
    }

    draw() {
        // Clear old plot
        this.snakeboardHTML_ctx.fillStyle = this.board_col;
        this.snakeboardHTML_ctx.strokestyle = this.board_border;
        this.snakeboardHTML_ctx.fillRect(0, 0, this.snakeboardHTML.width, this.snakeboardHTML.height);
        this.snakeboardHTML_ctx.strokeRect(0, 0, this.snakeboardHTML.width, this.snakeboardHTML.height);

        // Plot details
        for (let i = 0; i < this.gridWidth; i++) {
            for (let j = 0; j < this.gridHeight; j++) {
                if (this.grid[i][j] == GridEnum.wall) {
                    this.snakeboardHTML_ctx.fillStyle = this.wall_col;
                    this.snakeboardHTML_ctx.strokestyle = this.wall_border;
                    this.snakeboardHTML_ctx.fillRect(10 * i, 10 * j, 10, 10);
                    this.snakeboardHTML_ctx.strokeRect(10 * i, 10 * j, 10, 10);
                } else if (this.grid[i][j] == GridEnum.food) {
                    this.snakeboardHTML_ctx.fillStyle = this.apple_col;
                    this.snakeboardHTML_ctx.strokestyle = this.apple_border;
                    this.snakeboardHTML_ctx.fillRect(10 * i, 10 * j, 10, 10);
                    this.snakeboardHTML_ctx.strokeRect(10 * i, 10 * j, 10, 10);
                } else if (this.grid[i][j] == GridEnum.snake) {
                    this.snakeboardHTML_ctx.fillStyle = this.snake_col;
                    this.snakeboardHTML_ctx.strokestyle = this.snake_border;
                    this.snakeboardHTML_ctx.fillRect(10 * i, 10 * j, 10, 10);
                    this.snakeboardHTML_ctx.strokeRect(10 * i, 10 * j, 10, 10);
                }
            }
        }
    }

    storeSnakePart(part) {
        this.grid[part.x][part.y] = GridEnum.snake;
    }

    genNewFood() {
        let foundEmptySlot = false;
        while (!foundEmptySlot) {
            let x = Math.round(Math.random() * (this.gridWidth - 1));
            let y = Math.round(Math.random() * (this.gridHeight - 1));

            if (this.grid[x][y] == GridEnum.clear) {
                foundEmptySlot = true;
                this.grid[x][y] = GridEnum.food;
            }
        }
    }

    main() {
        if (this.gameOver()) {
            return;
        }

        this.moveSnake();
        this.draw();
        this.dirChange = false;
        
        setTimeout(
            // function onTick() {
            //     // for (var i = 0; i < localStorage.length; i++){
            //     //     console.log(localStorage[i])
            //     // }
            //     // console.log('What???')
            //     // this.moveSnake();
            //     // this.draw();
            //     // Repeat
            //     this.main();
            // }.bind(this)
            this.main.bind(this)
            , 100)
    }

    gameOver() {
        // Head hit tail
        for (let i = 4; i < this.snake.length; i++) {
            if ((this.snake[0].x == this.snake[i].x) && (this.snake[0].y == this.snake[i].y)) {
                return true
            }
        }

        // Head hit wall
        if (this.grid[this.snake[0].x][this.snake[0].y] == GridEnum.wall) {
            return true;
        }
        return false
    }

    //   change_direction(event) {
    //     const LEFT_KEY = 37;
    //     const RIGHT_KEY = 39;
    //     const UP_KEY = 38;
    //     const DOWN_KEY = 40;

    //   // Prevent the snake from reversing

    //     if (this.changing_direction) return;
    //     this.changing_direction = true;
    //     const keyPressed = event.keyCode;
    //     const goingUp = dy === -10;
    //     const goingDown = dy === 10;
    //     const goingRight = dx === 10;
    //     const goingLeft = dx === -10;
    //     if (keyPressed === LEFT_KEY && !goingRight) {
    //         this.dx = -10;
    //         this.dy = 0;
    //     }
    //     if (keyPressed === UP_KEY && !goingDown) {
    //         this.dx = 0;
    //         this.dy = -10;
    //     }
    //     if (keyPressed === RIGHT_KEY && !goingLeft) {
    //         this.dx = 10;
    //         this.dy = 0;
    //     }
    //     if (keyPressed === DOWN_KEY && !goingUp) {
    //         this.dx = 0;
    //         this.dy = 10;
    //     }
    //   }

    moveSnake() {
        const head = { x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy };
        this.snake.unshift(head);
        const hasEaten = (this.grid[this.snake[0].x][this.snake[0].y] == GridEnum.food);
        
        for (let i = 0; i < this.snake.length; i++) {
            this.storeSnakePart(this.snake[i]);
        }

        if (hasEaten) {
            this.score += 10;
            this.scoreHTML.innerHTML = this.score;
            genNewFood();
        } else {
            const part = this.snake[this.snake.length - 1]
            this.grid[part.x][part.y] = GridEnum.clear; 
            this.snake.pop();
        }
    }
}