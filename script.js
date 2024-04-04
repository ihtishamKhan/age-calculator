const dobInput = document.getElementById('dob');
const form = document.getElementById('age-calculator-form');
const ageOutput = document.getElementById('age');
const previousBirthdayOutput = document.getElementById('previous-birthday');
const nextBirthdayOutput = document.getElementById('next-birthday');
const dobError = document.getElementById('dob-error');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    // validate date of birth
    if (!dobInput.value) {
        dobError.textContent = 'Please enter a valid date of birth';
        return;
    }

    const dob = new Date(dobInput.value);
    const age = calculateAge(dob);
    const calculatedPreviousBirthday = previousBirthday(dob);
    const calculatedNextBirthday = nextBirthday(dob);
    const isBirthdayToday = birthdayToday(dob);


    isBirthdayToday ? birthdayAnimation() : null;
    isBirthdayToday ? playMusic() : null;

    ageOutput.textContent = `${age.years} years, ${age.months} months and ${age.days} days old`
    previousBirthdayOutput.textContent = `${calculatedPreviousBirthday.months} months and ${calculatedPreviousBirthday.days} days ago`;
    nextBirthdayOutput.textContent = `${calculatedNextBirthday.months} months and ${calculatedNextBirthday.days} days away`;
});

function calculateAge(dob) {
    const diff = Date.now() - dob.getTime();
    const ageDate = new Date(diff);
    const years = ageDate.getFullYear() - 1970;
    const months = ageDate.getMonth();
    const days = ageDate.getDate() - 1;
    return { years, months, days };
}

function previousBirthday(dob) {
    const today = new Date();
    const previousBirthday = new Date(dob.getFullYear(), dob.getMonth(), dob.getDate());
    // if (today < previousBirthday) {
    //     previousBirthday.setFullYear(today.getFullYear() - 1);
    // }
    const diff = today - previousBirthday;
    const ageDate = new Date(diff);
    const months = ageDate.getMonth();
    const days = ageDate.getDate() - 1;
    return { months, days };
}

function nextBirthday(dob) {
    const today = new Date();
    const nextBirthday = new Date(dob.getFullYear() + 1, dob.getMonth(), dob.getDate());
    // if (today > nextBirthday) {
    //     nextBirthday.setFullYear(today.getFullYear() + 1);
    // }
    console.log(nextBirthday);
    const diff = nextBirthday - today;
    const ageDate = new Date(diff);
    const months = ageDate.getMonth();
    const days = ageDate.getDate();
    return { months, days };
}

function birthdayToday(dob) {
    const today = new Date();
    return dob.getDate() === today.getDate() && dob.getMonth() === today.getMonth();
}

function birthdayAnimation() {
    // helper functions
    const PI2 = Math.PI * 2
    const random = (min, max) => Math.random() * (max - min + 1) + min | 0
    const timestamp = _ => new Date().getTime()

    // container
    class Birthday {
        constructor() {
            this.resize()

            // create a lovely place to store the firework
            this.fireworks = []
            this.counter = 0

        }

        resize() {
            this.width = canvas.width = window.innerWidth
            let center = this.width / 2 | 0
            this.spawnA = center - center / 4 | 0
            this.spawnB = center + center / 4 | 0

            this.height = canvas.height = window.innerHeight
            this.spawnC = this.height * .1
            this.spawnD = this.height * .5

        }

        onClick(evt) {
            let x = evt.clientX || evt.touches && evt.touches[0].pageX
            let y = evt.clientY || evt.touches && evt.touches[0].pageY

            let count = random(3, 5)
            for (let i = 0; i < count; i++) this.fireworks.push(new Firework(
                random(this.spawnA, this.spawnB),
                this.height,
                x,
                y,
                random(0, 260),
                random(30, 110)))

            this.counter = -1

        }

        update(delta) {
            ctx.globalCompositeOperation = 'hard-light'
            ctx.fillStyle = `rgba(20,20,20,${7 * delta})`
            ctx.fillRect(0, 0, this.width, this.height)

            ctx.globalCompositeOperation = 'lighter'
            for (let firework of this.fireworks) firework.update(delta)

            // if enough time passed... create new new firework
            this.counter += delta * 3 // each second
            if (this.counter >= 1) {
                this.fireworks.push(new Firework(
                    random(this.spawnA, this.spawnB),
                    this.height,
                    random(0, this.width),
                    random(this.spawnC, this.spawnD),
                    random(0, 360),
                    random(30, 110)))
                this.counter = 0
            }

            // remove the dead fireworks
            if (this.fireworks.length > 1000) this.fireworks = this.fireworks.filter(firework => !firework.dead)

        }
    }

    class Firework {
        constructor(x, y, targetX, targetY, shade, offsprings) {
            this.dead = false
            this.offsprings = offsprings

            this.x = x
            this.y = y
            this.targetX = targetX
            this.targetY = targetY

            this.shade = shade
            this.history = []
        }
        update(delta) {
            if (this.dead) return

            let xDiff = this.targetX - this.x
            let yDiff = this.targetY - this.y
            if (Math.abs(xDiff) > 3 || Math.abs(yDiff) > 3) { // is still moving
                this.x += xDiff * 2 * delta
                this.y += yDiff * 2 * delta

                this.history.push({
                    x: this.x,
                    y: this.y
                })

                if (this.history.length > 20) this.history.shift()

            } else {
                if (this.offsprings && !this.madeChilds) {

                    let babies = this.offsprings / 2
                    for (let i = 0; i < babies; i++) {
                        let targetX = this.x + this.offsprings * Math.cos(PI2 * i / babies) | 0
                        let targetY = this.y + this.offsprings * Math.sin(PI2 * i / babies) | 0

                        birthday.fireworks.push(new Firework(this.x, this.y, targetX, targetY, this.shade, 0))

                    }

                }
                this.madeChilds = true
                this.history.shift()
            }

            if (this.history.length === 0) this.dead = true
            else if (this.offsprings) {
                for (let i = 0; this.history.length > i; i++) {
                    let point = this.history[i]
                    ctx.beginPath()
                    ctx.fillStyle = 'hsl(' + this.shade + ',100%,' + i + '%)'
                    ctx.arc(point.x, point.y, 1, 0, PI2, false)
                    ctx.fill()
                }
            } else {
                ctx.beginPath()
                ctx.fillStyle = 'hsl(' + this.shade + ',100%,50%)'
                ctx.arc(this.x, this.y, 1, 0, PI2, false)
                ctx.fill()
            }

        }
    }

    let canvas = document.getElementById('birthday')
    let ctx = canvas.getContext('2d')

    let then = timestamp()

    let birthday = new Birthday
    window.onresize = () => birthday.resize()
    document.onclick = evt => birthday.onClick(evt)
    document.ontouchstart = evt => birthday.onClick(evt)

        ; (function loop() {
            requestAnimationFrame(loop)

            let now = timestamp()
            let delta = now - then

            then = now
            birthday.update(delta / 1000)


        })();
}

function playMusic() {
    const audio = new Audio('birthday.mp3');
    audio.play();
}