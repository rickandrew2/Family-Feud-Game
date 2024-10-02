// script.js

$(document).ready(function () {
    let player1Name = '';
    let player2Name = '';
    let currentPlayer = 1; // Start with Player 1
    let player1Score = 0;
    let player2Score = 0;
    let round = 0;
    const totalRounds = 3;
    const wrongAnswerLimit = 3;

    const questions = [
        {
            question: "Name something you might bring on a picnic.",
            answers: ["Sandwiches", "Drinks", "Fruits", "Blanket", "Games"],
        },
        {
            question: "Name a popular dog breed.",
            answers: ["Labrador", "German Shepherd", "Golden Retriever", "Bulldog", "Poodle"],
        },
        {
            question: "Name a reason people might be late for work.",
            answers: ["Traffic", "Oversleeping", "Bad Weather", "Car Trouble", "Family Emergency"],
        },
    ];

    let currentQuestion = 0;
    let currentAnswers = [];
    let wrongAnswersCount = 0;

    // Start the game when both names are ready
    $('#start-game-btn').click(function () {
        player1Name = $('#player1-name').val();
        player2Name = $('#player2-name').val();

        if (player1Name && player2Name) {
            alert(`Game Started! ${player1Name} vs ${player2Name}`);
            startRound();
        } else {
            alert('Please enter both player names!');
        }
    });

    // Start the round
    function startRound() {
        if (round < totalRounds) {
            $('#results').hide();
            $('#answer-list').empty();
            $('#team1-score').text(player1Score);
            $('#team2-score').text(player2Score);
            currentQuestion = round;
            currentAnswers = questions[currentQuestion].answers;
            wrongAnswersCount = 0; // Reset wrong answer count for the new round

            $('.questions').text(questions[currentQuestion].question);
            $('#answer-input').val('');
            $('#answer-input-form').show();
            $('#pass-btn, #play-btn').prop('disabled', true);
        } else {
            endGame();
        }
    }

    // Handle answer submission
    $('#answer-input-form').submit(function (e) {
        e.preventDefault();
        const userAnswer = $('#answer-input').val().trim();
        $('#answer-input').val('');

        if (currentAnswers.includes(userAnswer)) {
            alert("Correct Answer!");
            if (currentPlayer === 1) {
                player1Score += 10; // Give points
                $('#team1-score').text(player1Score);
            } else {
                player2Score += 10;
                $('#team2-score').text(player2Score);
            }
            nextTurn();
        } else {
            alert("Wrong Answer!");
            wrongAnswersCount++;
            if (wrongAnswersCount >= wrongAnswerLimit) {
                alert(`${currentPlayer === 1 ? player1Name : player2Name} has reached the limit of wrong answers.`);
                nextRound();
            } else {
                $('#pass-btn, #play-btn').prop('disabled', false);
            }
        }
    });

    // Next turn logic
    function nextTurn() {
        currentPlayer = currentPlayer === 1 ? 2 : 1; // Switch player
        if (currentPlayer === 1) {
            alert(`${player1Name}'s turn!`);
        } else {
            alert(`${player2Name}'s turn!`);
        }
    }

    // Pass or Play
    $('#pass-btn').click(function () {
        alert(`${currentPlayer === 1 ? player1Name : player2Name} chose to pass.`);
        nextRound();
    });

    $('#play-btn').click(function () {
        alert(`${currentPlayer === 1 ? player1Name : player2Name} chose to play.`);
        // Continue the round logic
        nextTurn();
    });

    // Next round logic
    function nextRound() {
        round++;
        startRound();
    }

    // End the game
    function endGame() {
        let winner = '';
        if (player1Score > player2Score) {
            winner = player1Name;
        } else if (player2Score > player1Score) {
            winner = player2Name;
        } else {
            winner = 'It\'s a tie!';
        }
        $('#results').show().html(`<h2>${winner} wins!</h2><p>Final Scores:</p><p>${player1Name}: ${player1Score} | ${player2Name}: ${player2Score}</p>`);
        $('#game-over-footer').show();
    }
});
