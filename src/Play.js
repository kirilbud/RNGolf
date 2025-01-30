class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    init() {
        // useful variables
        this.SHOT_VELOCITY_X = 200;
        this.SHOT_VELOCITY_X_MIN = 0;
        this.SHOT_VELOCITY_X_MAX = 300;


        this.SHOT_VELOCITY_Y_MIN = 700;
        this.SHOT_VELOCITY_Y_MAX = 1100;

    }

    preload() {
        this.load.path = './assets/img/'
        this.load.image('grass', 'grass.jpg')
        this.load.image('cup', 'cup.jpg')
        this.load.image('ball', 'ball.png')
        this.load.image('wall', 'wall.png')
        this.load.image('oneway', 'one_way_wall.png')
    }

    create() {
        // add background grass
        this.grass = this.add.image(0, 0, 'grass').setOrigin(0)

        // add cup
        this.cup = this.physics.add.sprite(width/2, height/10, 'cup')
        this.cup.body.setCircle(this.cup.width/4)
        this.cup.body.setOffset(this.cup.width/4)
        this.cup.body.setImmovable(true)

        // add ball
        this.ball = this.physics.add.sprite(width/2, height- height/10, 'ball')
        this.ball.body.setCircle(this.ball.width/2)
        this.ball.body.setCollideWorldBounds(true)
        this.ball.body.setBounce(0.5)
        this.ball.body.setDamping(true).setDrag(0.5)

        // add walls
        let wallA = this.physics.add.sprite(0, height/4, 'wall')
        wallA.setX(Phaser.Math.Between(0 + wallA.width/2, width - wallA.width /2))
        wallA.body.setCollideWorldBounds(true)
        wallA.setVelocityX(100)
        wallA.setBounce(1)
        wallA.body.setImmovable(true)
        
        let wallB = this.physics.add.sprite(0, height/2, 'wall')
        wallB.setX(Phaser.Math.Between(0 + wallB.width/2, width - wallB.width /2))
        wallB.body.setImmovable(true)

        this.walls = this.add.group([wallA, wallB])

        // add one-way
        let oneWay = this.physics.add.sprite(0, height/4 * 3, 'oneway')
        oneWay.setX(Phaser.Math.Between(0 + oneWay.width/2, width - oneWay.width /2))
        oneWay.body.setImmovable(true)
        oneWay.body.checkCollision.down = false

        //add score and ratio
        this.score = 0
        this.shots = 0
        this.ratio = 100
        let textConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#59db66',
            color: '#000000',
            alighn: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth:100
        }
        this.scoreText = this.add.text(width/5, height/20, this.score, textConfig).setOrigin(.5)
        this.shotsText = this.add.text(width/2, height/20, this.shots, textConfig).setOrigin(.5)
        this.ratioText = this.add.text(width/5*4, height/20, String(this.ratio) + "%", textConfig).setOrigin(.5)



        // add pointer input
        this.input.on('pointerdown', (pointer) => {
            this.shots += 1
            this.shotsText.text = this.shots
            this.ratioText.text = String(Math.floor((this.score / this.shots)*100)) + "%"

            let shotDirection = pointer.y <= this.ball.y ? 1:-1
            let shotDirection_X = pointer.x <= this.ball.x ? 1:-1

            this.ball.body.setVelocityX(Phaser.Math.Between(this.SHOT_VELOCITY_X_MIN, this.SHOT_VELOCITY_X_MAX)* shotDirection_X)
            this.ball.body.setVelocityY(Phaser.Math.Between(this.SHOT_VELOCITY_Y_MIN, this.SHOT_VELOCITY_Y_MAX)* shotDirection)
        })

        // cup/ball collision
        this.physics.add.collider(this.ball, this.cup, (ball, cup) => {
            this.score += 1
            this.scoreText.text = this.score
            this.ratioText.text = String(Math.floor((this.score / this.shots)*100)) + "%"

            ball.setVelocity(0)
            ball.setX(width/2)
            ball.setY(height- height/10)
        })

        // ball/wall collision
        this.physics.add.collider(this.ball, this.walls)

        // ball/one-way collision
        this.physics.add.collider(this.ball, oneWay)
    }

    update() {
        
    }
}
/*
CODE CHALLENGE
Try to implement at least 3/4 of the following features during the remainder of class (hint: each takes roughly 15 or fewer lines of code to implement):
[X] Add ball reset logic on successful shot
[X] Improve shot logic by making pointer’s relative x-position shoot the ball in correct x-direction
[X] Make one obstacle move left/right and bounce against screen edges
[X] Create and display shot counter, score, and successful shot percentage
*/