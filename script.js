let allWords = [];

let studyWords = [];

let currentWord = null;

let countdown = null;

let timeLeft = 10;

let showingAnswer = false;


// -------------------------------------
// LOAD CSV
// -------------------------------------

fetch("data/malay_thai_all_words.csv")

    .then(response => response.text())

    .then(csvText => {

        allWords = parseCSV(csvText);

        console.log(
            "Words loaded:",
            allWords.length
        );

    })

    .catch(error => {

        console.error(
            "Error loading CSV:",
            error
        );

        alert(
            "Could not load vocabulary."
        );

    });


// -------------------------------------
// PARSE CSV
// -------------------------------------

function parseCSV(text) {

    const lines = text.trim().split("\n");

    const words = [];


    // Skip header
    for (let i = 1; i < lines.length; i++) {

        const values = parseCSVLine(
            lines[i]
        );


        if (values.length >= 3) {

            words.push({

                Malay:
                    values[0].trim(),

                Thai:
                    values[1].trim(),

                Chapter:
                    Number(
                        values[2].trim()
                    )

            });

        }

    }

    return words;
}


// Handles commas inside quotes
function parseCSVLine(line) {

    const result = [];

    let current = "";

    let insideQuotes = false;


    for (let i = 0; i < line.length; i++) {

        const character = line[i];


        if (character === '"') {

            insideQuotes =
                !insideQuotes;

        }

        else if (
            character === "," &&
            !insideQuotes
        ) {

            result.push(current);

            current = "";

        }

        else {

            current += character;

        }

    }


    result.push(current);

    return result;
}


// -------------------------------------
// CHOOSE CHAPTER
// -------------------------------------

function chooseChapter(chapter) {

    if (allWords.length === 0) {

        alert(
            "Vocabulary is still loading. Please try again."
        );

        return;
    }


    if (chapter === "All") {

        studyWords = [
            ...allWords
        ];

    }

    else {

        studyWords =
            allWords.filter(
                word =>
                    word.Chapter === chapter
            );

    }


    document
        .getElementById(
            "chapter-screen"
        )
        .classList
        .add("hidden");


    document
        .getElementById(
            "flashcard-screen"
        )
        .classList
        .remove("hidden");


    if (chapter === "All") {

        document.getElementById(
            "chapter-title"
        ).textContent =
            "All Chapters";

    }

    else {

        document.getElementById(
            "chapter-title"
        ).textContent =
            `Chapter ${chapter}`;

    }


    nextQuestion();
}


// -------------------------------------
// NEXT QUESTION
// -------------------------------------

function nextQuestion() {

    clearInterval(countdown);


    if (studyWords.length === 0) {

        document.getElementById(
            "word"
        ).textContent =
            "All words completed! 🎉";


        document.getElementById(
            "timer"
        ).textContent = "";


        document.getElementById(
            "language"
        ).textContent = "";


        updateProgress();

        return;
    }


    showingAnswer = false;

    timeLeft = 10;


    const randomIndex =
        Math.floor(
            Math.random() *
            studyWords.length
        );


    currentWord =
        studyWords[randomIndex];


    const card =
        document.getElementById(
            "flashcard"
        );


    card.classList.remove(
        "answer"
    );


    document.getElementById(
        "language"
    ).textContent =
        "Malay";


    document.getElementById(
        "word"
    ).textContent =
        currentWord.Malay;


    document.getElementById(
        "timer"
    ).textContent =
        timeLeft;


    updateProgress();


    countdown = setInterval(
        function () {

            timeLeft--;


            document.getElementById(
                "timer"
            ).textContent =
                timeLeft;


            // Show answer after 5 seconds
            if (
                timeLeft === 5 &&
                !showingAnswer
            ) {

                showAnswer();

            }


            // Next question
            if (timeLeft <= 0) {

                clearInterval(
                    countdown
                );

                nextQuestion();

            }

        },

        1000
    );
}


// -------------------------------------
// SHOW THAI ANSWER
// -------------------------------------

function showAnswer() {

    showingAnswer = true;


    document
        .getElementById(
            "flashcard"
        )
        .classList
        .add("answer");


    document.getElementById(
        "language"
    ).textContent =
        "Thai";


    document.getElementById(
        "word"
    ).textContent =
        currentWord.Thai;
}


// -------------------------------------
// CLICK CARD
// -------------------------------------

function flipCard() {

    if (
        currentWord &&
        !showingAnswer
    ) {

        showAnswer();

    }
}


// -------------------------------------
// KNOWN WORD
// -------------------------------------

function knownWord() {

    if (!currentWord) {
        return;
    }


    clearInterval(
        countdown
    );


    // Remove known word
    studyWords =
        studyWords.filter(
            word =>
                word !== currentWord
        );


    nextQuestion();
}


// -------------------------------------
// UNKNOWN WORD
// -------------------------------------

function unknownWord() {

    if (!currentWord) {
        return;
    }


    clearInterval(
        countdown
    );


    showAnswer();


    document.getElementById(
        "timer"
    ).textContent = "";


    // Give 5 seconds to study answer
    setTimeout(
        nextQuestion,
        5000
    );
}


// -------------------------------------
// PROGRESS
// -------------------------------------

function updateProgress() {

    document.getElementById(
        "progress"
    ).textContent =
        `Words remaining: ${studyWords.length}`;
}


// -------------------------------------
// BACK TO CHAPTERS
// -------------------------------------

function backToChapters() {

    clearInterval(
        countdown
    );


    document
        .getElementById(
            "flashcard-screen"
        )
        .classList
        .add("hidden");


    document
        .getElementById(
            "chapter-screen"
        )
        .classList
        .remove("hidden");
}