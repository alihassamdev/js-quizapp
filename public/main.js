
console.log("JS Loaded...............");

// === Constants ===
const APP_URL = "http://localhost:3000";

// === State Variables ===
let currQuestionIndex = 0;
let questionCount = 0;
let score = 0;
let slectedOption = null;
let correctAnswer = null;
let correctAnswerText = "";
let isOptionSelected = false;

// === DOM Elements ===
const quizScoreElement = document.querySelector('#quize-score');
const submitButton = document.querySelector('#submit-btn');
const nextButton = document.querySelector('#next-btn');
const quizQuestion = document.querySelector('.quiz-question');
const optionsWrapper = document.querySelector('.quize-option-wrapper');
const feedbackElement = document.getElementById('feedback');

// Intialize On Load
fetchQuiz();


// === Fetch Quiz Data & Render ===
function fetchQuiz() {
    fetch(APP_URL + "/quiz")
        .then(response => response.json())
        .then(quiz => {
            questionCount = quiz.length;
            renderQuestion(quiz[currQuestionIndex]);
        });
}

// === Render Questions & Options
function renderQuestion(questionData) {
    // Reset UI State
    quizQuestion.innerHTML = `
    <span>${questionData.id}. </span> ${questionData.question}
    `;
    optionsWrapper.innerHTML = "";
    // quizScoreElement.textContent = score;

    selectedOption = null;
    correctAnswer = questionData.answer;
    correctAnswerText = questionData.options[correctAnswer];
    console.log(correctAnswerText);
    isOptionSelected = false;
    submitButton.disabled = true;

    // Render Options  
    questionData.options.forEach((optionItem, index) => {
        const li = document.createElement("li");
        li.classList.add('quize-option');

        li.innerHTML = `
        <label class="option-box">
            <input type="radio" name="quiz-option" value="${index}" class="option-input"/>
                <div class="label">
                    <!-- <div class="option-letter">B</div> -->
                    <div class="option-text">${optionItem}</div>
                </div>
                <!-- <div class="check-icon">✔</div> --> 
        </label>
        `;

        const input = li.querySelector('.option-input');
        input.addEventListener('change', (e) => {
            slectedOption = input.value;
            console.log("click option: ", slectedOption);
            isOptionSelected = true;
            submitButton.disabled = false;
        });

        optionsWrapper.appendChild(li);
    });
}


// === Handle Submit Button ===
submitButton.addEventListener('click', () => {
    if (!isOptionSelected) return;

    // 
    if (slectedOption === correctAnswer) {
        console.log("Correct Answer");
        feedbackElement.textContent = "✅ Correct! Well done!";
        feedbackElement.className = "feedback-text correct-text";
        score++;
    } else {
        console.log("Wrong Answer");
        feedbackElement.textContent = `❌ Wrong! The correct answer is: "${correctAnswerText}"`;
        feedbackElement.className = "feedback-text wrong-text";
    }

    // quizScoreElement.textContent = score;

    // Toggle Buttons
    submitButton.style.display = "none";
    nextButton.style.display = "inline-block";

});

// === Handle Next Button ===
nextButton.addEventListener('click', () => {
    if (currQuestionIndex >= questionCount - 1) {
        alert("🎉 Quiz Complete!\nYour Score: " + score + "/" + questionCount);
        return;
    }

    currQuestionIndex++;
    console.log("currQuestionIndex: " + currQuestionIndex + " questionCount: " + questionCount);
    fetchQuiz();

    // Toggle Buttons
    submitButton.style.display = "inline-block";
    nextButton.style.display = "none";

    feedbackElement.textContent = "";
    feedbackElement.className = "feedback-text";

});

