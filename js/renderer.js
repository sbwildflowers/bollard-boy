function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Choose random index from 0 to i

        // Swap elements at i and j
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

let COMPLETED
let TOTAL
let CORRECT

const ALL_COUNTRIES = ['Canada','United States','Mexico','Guatemala','Greenland','Costa Rica','Colombia','Ecuador','Peru','Bolivia','Chile','Argentina','Brazil','Puerto Rico','Dominican Republic','Curaçao','Bermuda','British Virgin Islands','U.S. Virgin Islands','Uruguay','South Africa','Eswatini','Lesotho','Botswana','Kenya','Uganda','Senegal','Ghana','Madagascar','Tunisia','Nigeria','United Arab Emirates','Qatar','Jordan','Israel','Malta','Portugal','Spain','France','Andorra','Ireland','England','Belgium','Netherlands','Italy','Croatia','Austria','Germany','Denmark','Norway','Sweden','Finland','Estonia','Latvia','Lithuania','Poland','Czechia','Slovakia','Albania','Northern Macedonia','Romania','Bulgaria','Serbia','Montenegro','Greece','Slovenia','Turkey','India','Mongolia','Russia','Ukraine','Pakistan','Bangladesh','Kyrgyzstan','Bhutan','Thailand','Cambodia','Vietnam','Malaysia','Singapore','Indonesia','Philippines','Christmas Island','Northern Mariana Islands','Guam','Australia','New Zealand','Midway Atoll','South Korea','Japan','Hong Kong']

function setQuestion(dataShuffled) {
    const imgSrc = dataShuffled[COMPLETED].front_img
    const correctAnswers = dataShuffled[COMPLETED].valid_countries
    const possibleAnswers = dataShuffled[COMPLETED].other_countries
    const resultString = document.querySelector('.result-string')
    resultString.innerHTML = ''
    const nextButton = document.querySelector('button.next')
    nextButton.disabled = true
    const imgParent = document.querySelector('#image')
    imgParent.innerHTML = ''
    const answerParent = document.querySelector('#answers')
    answerParent.innerHTML = ''
    const image = new Image()
    image.src = `/${imgSrc}`
    imgParent.appendChild(image)

    const answers = correctAnswers.concat(possibleAnswers)
    let remainingPossibleAnswers = 10 - answers.length
    const shuffledCountries = shuffleArray(ALL_COUNTRIES)
    i = 0
    while (remainingPossibleAnswers != 0) {
        if (answers.includes(shuffledCountries[i]) !== true) {
            answers.push(shuffledCountries[i])
            remainingPossibleAnswers -= 1
        }
        i += 1
    }

    shuffledAnswers = shuffleArray(answers)

    shuffledAnswers.forEach(name => {
        const button = document.createElement('button')
        if (correctAnswers.includes(name)) {
            button.classList.add('correct')
        }
        button.innerHTML = name
        answerParent.appendChild(button)

        button.onclick = (event) => {
            event.srcElement.classList.toggle('guess')
        }
    })

    const submitButton = document.querySelector('button.submit')
    submitButton.onclick = () => {
        const guesses = document.querySelectorAll('button.guess')
        const guessArray = []
        guesses.forEach((guess) => {
            guessArray.push(guess.innerHTML)
            if (correctAnswers.includes(guess.innerHTML) === false) {
                guess.classList.add('wrong')
                roundCorrect = false
            }
        })
        if (JSON.stringify(guessArray.sort()) === JSON.stringify(correctAnswers.sort())) {
            CORRECT += 1
            resultString.innerHTML = 'CORRECT'
            resultString.style.color = '#8bc34a'
        } else {
            resultString.innerHTML = 'INCORRECT'
            resultString.style.color = 'red'
        }

        const percentDiv = document.querySelector('.percent-correct span')
        const percent = `${CORRECT}/${TOTAL}`
        percentDiv.innerHTML = percent

        COMPLETED += 1
        const remainingDiv = document.querySelector('.remaining span')
        const remaining = TOTAL - COMPLETED
        remainingDiv.innerHTML = remaining

        const correct = document.querySelectorAll('button.correct')
        correct.forEach((correct) => {
            correct.classList.add('right')
        })
        if (COMPLETED != TOTAL) {
            submitButton.disabled = true
            nextButton.disabled = false

            nextButton.onclick = () => {
                submitButton.disabled = false
                nextButton.disabled = true
                setQuestion(dataShuffled)
            }
        } else {
            submitButton.disabled = true
            const tryAgain = document.querySelector('.try-again')
            tryAgain.style.display = 'block'

            tryAgain.onclick = () => {
                submitButton.disabled = false
                tryAgain.style.display = 'none'
                beginTraining()
            }
        }
    }
}

function beginTraining() {
    const dataShuffled = shuffleArray(mongoData)
    TOTAL = dataShuffled.length
    COMPLETED = 0
    CORRECT = 0
    const percentDiv = document.querySelector('.percent-correct span')
    const percent = `${CORRECT}/${TOTAL}`
    percentDiv.innerHTML = percent

    const remainingDiv = document.querySelector('.remaining span')
    const remaining = TOTAL - COMPLETED
    remainingDiv.innerHTML = remaining
    setQuestion(dataShuffled)
}

window.onload = () => {
    const beginButon = document.querySelector('button.begin')
    beginButon.onclick = () => {
        const header = document.querySelector('h1')
        const promptWrapper = document.querySelector('#prompt-wrapper')
        const scoreParent = document.querySelector('#score')
        beginButon.style['display'] = 'none'
        header.innerHTML = 'Select all that apply'
        promptWrapper.style['display'] = 'block'
        scoreParent.style['display'] = 'block'
        beginTraining()
    } 
}