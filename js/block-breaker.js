const container = document.querySelector('.container');
let containerDimension = container.getBoundingClientRect();

const player = {
    gameOver: true
};

const gameOver = document.createElement('div');

gameOver.textContent = "Start Game";
gameOver.style.position = 'absolute';
gameOver.style.color = 'azure';
gameOver.style.lineHeight = '60px';
gameOver.style.height = '250px';
gameOver.style.textAlign = 'center';
gameOver.style.fontSize = '3em';
gameOver.style.textTransform = 'uppercase';
gameOver.style.backgroundColor = 'orange';
gameOver.style.width = '100%';

gameOver.addEventListener('click', startGame);
container.appendChild(gameOver);

//cream mingea
const ball = document.createElement('div');
ball.style.position = 'absolute';
ball.style.height = '20px';
ball.style.width = '20px';
ball.style.backgroundColor = 'yellow';
ball.style.borderRadius = '25px';
ball.style.backgroundImage = "url('img/ball.png')";
ball.style.backgroundSize = '20px 20px';
ball.style.top = '75%';
ball.style.left = '50%';
ball.style.display = 'none';
//adaugam minge in joc
container.appendChild(ball);

//desenam paleta
const paddle = document.createElement('div');
paddle.style.position = 'absolute';
paddle.style.backgroundColor = '#c3c3c3';
paddle.style.height = '20px';
paddle.style.width = '100px';
paddle.style.borderRadius = '25px';
paddle.style.bottom = '30px';
paddle.style.left = '50%';

container.appendChild(paddle);

document.addEventListener('keydown', function(e) {
    // console.log(e);
    if (e.key === 'ArrowLeft') paddle.left = true;
    if (e.key === 'ArrowRight') paddle.right = true;
    if (e.key === 'ArrowUp' && !player.isPlay) player.isPlay = true;
});
document.addEventListener('keyup', function(e) {
    // console.log(e);
    if (e.key === 'ArrowLeft') paddle.left = false;
    if (e.key === 'ArrowRight') paddle.right = false;
});


function startGame() {
    if (player.gameOver) {
        player.gameOver = false;
        gameOver.style.display = 'none';
        player.score = 0;
        player.lives = 1;
        player.isPlay = false;
        ball.style.display = 'block';
        ball.style.left = paddle.offsetLeft + 50 + 'px';
        ball.style.top = paddle.offsetTop - 25 + 'px';
        player.ballDirection = [2, -5];
        player.num = 50; //50blocks to brake
        setupBricks(player.num);
        scoreUpdater();
        player.animationFrame = window.requestAnimationFrame(update);
    }
}

function setupBricks(num) {
    let row = {
        x: containerDimension.width % 100 / 2,
        y: 50
    };
    let skip = false;
    for (let x = 0; x < num; x++) {
        // console.log(row);
        if (row.x > (containerDimension.width - 100)) {
            row.y += 50;
            if (row.y > (containerDimension.height / 2)) {
                skip = true;
            }
            row.x = ((containerDimension.width % 100) / 2);
        }
        row.counter = x;
        if (!skip) {
            createBrick(row);
        }
        row.x += 100;
    }
}

function createBrick(pos) {
    const div = document.createElement('div');
    div.setAttribute('class', 'brick');
    div.style.backgroundColor = randomColor();
    div.textContent = pos.counter + 1;
    div.style.left = pos.x + 'px';
    div.style.top = pos.y + 'px';
    container.appendChild(div);
}

function randomColor() {
    return '#' + Math.random().toString(16).substr(-6); //genereaza 6 hexazecimal
}

function scoreUpdater() {
    document.querySelectorAll('.score').textContent = player.score;
    document.querySelectorAll('.live').textContent = player.lives;

}

function update() {
    const getFPS = () =>
        new Promise(resolve =>
            requestAnimationFrame(t1 =>
                requestAnimationFrame(t2 => resolve(1000 / (t2 - t1)))
            )
        )
        // Calling the function to get the FPS
    getFPS().then(fps => console.log(fps));

    if (!player.gameOver) {
        let paddleCurrentPosition = paddle.offsetLeft;
        if (paddleCurrentPosition > 0 && paddle.left) {
            paddleCurrentPosition -= 10;
        }
        if ((paddleCurrentPosition < containerDimension.width - paddle.offsetWidth) && paddle.right) {
            paddleCurrentPosition += 10;
        }
        paddle.style.left = paddleCurrentPosition + 'px';
        if (!player.isPlay) {
            waitingForPaddle();
        } else {
            moveBall();

        }
        player.animationFrame = window.requestAnimationFrame(update);
    }

}

function waitingForPaddle() {
    ball.style.top = (paddle.offsetTop - 20) + 'px';
    ball.style.left = (paddle.offsetLeft + 40) + 'px';
}

function fallOff() {
    player.lives--;
    if (player.lives < 1) {
        endGame();
    }
    scoreUpdater();
    stopper();
}

function stopper() {
    player.isPlay = false;
    player.ballDirection = [0, -5];
    waitingForPaddle();
    window.cancelAnimationFrame(player.animationFrame);
}

function endGame() {
    gameOver.style.display = 'block';
    gameOver.innerHTML = "Game Over<br/><p>Your score <span class=' red'>" + player.score + "</span></p>";
    player.gameOver = true;
    ball.style.display = 'none';
    //remove the bricks 
    let remaingBricks = document.querySelectorAll('.brick');
    for (let brickElem of remaingBricks) {
        brickElem.remove();
    }

    window.cancelAnimationFrame(player.animationFrame);
}

function moveBall() {
    let positionBall = {
        x: ball.offsetLeft,
        y: ball.offsetTop
    };
    if (positionBall.y > (containerDimension.height - 20) || positionBall.y < 0) {

        if (positionBall.y > (containerDimension.height - 20)) {
            fallOff();

        } else {
            player.ballDirection[1] *= -1;
        }
    }
    if (positionBall.x > (containerDimension.width - 20) || positionBall.x < 0) {
        player.ballDirection[0] *= -1;
    }
    if (isCollide(paddle, ball)) {
        let tmpBallPositionX = ((positionBall.x - paddle.offsetLeft) - (paddle.offsetWidth / 2) / 10);
        console.log("hit with paddle");
        player.ballDirection[0] = tmpBallPositionX;
        player.ballDirection[1] *= -1;
    }
    let bricks = document.querySelectorAll('.brick');
    if (bricks.length == 0 && !player.gameOver) {
        stopper;
        setupBricks(player.num);
    }

    for (let brickElem of bricks) {
        if (isCollide(brickElem, ball)) {
            player.ballDirection[1] *= -1;
            // brickElem.parentNode.removeChild(brickElem);
            brickElem.remove();
            player.score++;
            scoreUpdater();
        }
    }
    positionBall.x += player.ballDirection[0];
    positionBall.y += player.ballDirection[1];
    ball.style.top = positionBall.y + 'px';
    ball.style.left = positionBall.x + 'px';
}

function isCollide(a, b) {
    let aRectangle = a.getBoundingClientRect();
    let bRectangle = b.getBoundingClientRect();
    return !((aRectangle.right < bRectangle.left) || (aRectangle.left > bRectangle.right) || (aRectangle.top > bRectangle.bottom) || (aRectangle.bottom < bRectangle.top));
}
const getFPS = () =>
    new Promise(resolve =>
        requestAnimationFrame(t1 =>
            requestAnimationFrame(t2 => resolve(1000 / (t2 - t1)))
        )
    )
    // Calling the function to get the FPS
getFPS().then(fps => console.log(fps));