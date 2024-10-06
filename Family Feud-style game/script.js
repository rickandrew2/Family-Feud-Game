var app = {
    version: 1,
    currentQ: 0,
    jsonFile: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/40041/FF3.json",
    team1Name: "",
    team2Name: "",
    currentTeam: 1, // Track whose turn it is (1 or 2)
    teamStrikes: {1: 0, 2: 0}, // Strike count for each team
    maxStrikes: 3, // Maximum strikes allowed
    board: $("<div class='gameBoard'>" +
        "<!--- Scores --->" +
        "<div class='score' id='boardScore'>0</div>" +
        "<div class='score' id='team1'>0</div>" +
        "<div class='score' id='team2'>0</div>" +
        "<!--- Team Names --->" +
        "<div class='teamName' id='name1'></div>" +
        "<div class='teamName' id='name2'></div>" +
        "<!--- Strikes Display --->" +
        "<div class='strikesContainer'>" + // New container for strikes
        "<div class='strikes' id='team1Strikes'></div>" +
        "<div class='strikes' id='team2Strikes'></div>" +
        "</div>" + // End of strikesContainer
        "<!--- Turn Indicator --->" +
        "<div class='turnIndicator'>It's <span id='currentTeamName'></span>'s turn!</div>" +
        "<!--- Question --->" +
        "<div class='questionHolder'>" +
        "<span class='question'></span>" +
        "</div>" +
        "<!--- Answers Input and Button --->" +
        "<div class='answerInputHolder'>" +
        "<input type='text' id='userAnswer' placeholder='Enter your answer...' />" +
        "<button id='submitAnswer'>Submit Answer</button>" +
        "</div>" +
        "<!--- Answers --->" +
        "<div class='colHolder'>" +
        "<div class='col1'></div>" +
        "<div class='col2'></div>" +
        "</div>" +
        "<!--- Buttons --->" +
        "<div class='btnHolder'>" +
        "<div id='awardTeam1' data-team='1' class='button'>Award Team 1</div>" +
        "<div id='newQuestion' class='button'>New Question</div>" +
        "<div id='awardTeam2' data-team='2' class='button'>Award Team 2</div>" +
        "</div>" +
        "</div>"),

        correctAudio: new Audio("audio/📺 Family Feud Correct Answer Sound Effect 📺 Game Show Sound Effects ✅ FREE TO USE ✅.mp3"), // Use forward slashes
        wrongAudio: new Audio("audio/The Family Feud Buzzer Sound Effect.mp3"),

        allData: {
            "Magbigay ng salitang pwedeng pang-describe sa saging?": [
                ["Mahaba", 43],
                ["Masarap", 10],
                ["Matamis", 9],
                ["Dilaw", 6],
                ["Malambot", 4]
            ],
            "Mahirap maging (blank).": [
                ["Pogi", 60],
                ["Mahirap", 17],
                ["Mabait", 4],
                ["Pangit", 4],
                ["Single", 3]
            ],
            "Anong mga pambobola ang sinasabi ng lalaki sa babae?": [
                ["Ang ganda mo", 32],
                ["Ikaw lang wala na", 31],
                ["Di kita iiwan", 8],
                ["I miss you", 8],
                ["Ang sexy mo", 3]
            ],
            "Magbigay ng tunog na nalilikha ng katawan?": [
                ["Utot", 24],
                ["Boses", 14],
                ["Sipol", 10],
                ["Hilik", 9],
                ["Palakpak", 8]
            ],
            "Sino kinakausap mo pag may problem ka sa lovelife?": [
                ["Friend", 51],
                ["Parents", 13],
                ["Kapatid", 6],
                ["Sarili", 4],
                ["Lord", 3]
            ]
            // Add more questions as needed
        },
        
        
    // Utility functions
    shuffle: function (array) {
        var currentIndex = array.length, temporaryValue, randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    },

    jsonLoaded: function (data) {
        console.clear();
        app.questions = Object.keys(app.allData); // Updated to use app.allData directly
        app.shuffle(app.questions);
        app.makeQuestion(app.currentQ);
        $('body').append(app.board);

        // Display team names on the board
        $('#name1').text(app.team1Name);
        $('#name2').text(app.team2Name);

        // Initialize displays
        app.updateStrikesDisplay();
        app.updateTurnIndicator();

        // Submit answer button event listener
        $('#submitAnswer').on('click', app.checkAnswer);
    },

    // Update the turn indicator
    updateTurnIndicator: function () {
        var teamName = (app.currentTeam === 1) ? app.team1Name : app.team2Name;
        $('#currentTeamName').text(teamName);
    },

    // Update the strikes display for each team
    updateStrikesDisplay: function () {
        // For Team 1
        var strikes1 = app.teamStrikes[1];
        var strikesDisplay1 = '';
        for (var i = 0; i < strikes1; i++) {
            strikesDisplay1 += 'X ';
        }
        $('#team1Strikes').text(app.team1Name + ' Strikes: ' + strikesDisplay1);

        // For Team 2
        var strikes2 = app.teamStrikes[2];
        var strikesDisplay2 = '';
        for (var i = 0; i < strikes2; i++) {
            strikesDisplay2 += 'X ';
        }
        $('#team2Strikes').text(app.team2Name + ' Strikes: ' + strikesDisplay2);
    },

    // Action functions
    makeQuestion: function (qNum) {
        var qText = app.questions[qNum];
        var qAnswr = app.allData[qText];
    
        // Rename this variable to avoid shadowing
        var numAnswers = qAnswr.length;
        numAnswers = (numAnswers < 8) ? 8 : numAnswers;
        numAnswers = (numAnswers % 2 !== 0) ? numAnswers + 1 : numAnswers;
    
        var boardScore = app.board.find("#boardScore");
        var question = app.board.find(".question");
        var col1 = app.board.find(".col1");
        var col2 = app.board.find(".col2");
    
        boardScore.html(0);
        question.html(qText.replace(/&x22;/gi, '"'));
        col1.empty();
        col2.empty();
    
        for (var i = 0; i < numAnswers; i++) {
            var aLI;
            if (qAnswr[i]) {
                aLI = $("<div class='cardHolder'>" +
                    "<div class='card'>" +
                    "<div class='front'>" +
                    "<span class='DBG'>" + (i + 1) + "</span>" +
                    "</div>" +
                    "<div class='back DBG'>" +
                    "<span>" + qAnswr[i][0] + "</span>" +
                    "<b class='LBG'>" + qAnswr[i][1] + "</b>" +
                    "</div>" +
                    "</div>" +
                    "</div>");
            } else {
                aLI = $("<div class='cardHolder empty'><div></div></div>");
            }
            var parentDiv = (i < (numAnswers / 2)) ? col1 : col2;
            $(aLI).appendTo(parentDiv);
        }
    
        var cardHolders = app.board.find('.cardHolder');
        var cards = app.board.find('.card');
        var backs = app.board.find('.back');
        var cardSides = app.board.find('.card>div');
    
        TweenLite.set(cardHolders, { perspective: 800 });
        TweenLite.set(cards, { transformStyle: "preserve-3d" });
        TweenLite.set(backs, { rotationX: 180 });
        TweenLite.set(cardSides, { backfaceVisibility: "hidden" });
    
        // Initialize flipped state
        cards.data("flipped", false);
    
        // Using arrow function to preserve 'this' context
        cardHolders.on('click', function() {
            var card = $(this).find('.card');
            var flipped = card.data("flipped");
            var cardRotate = flipped ? 0 : 180; // Corrected rotation logic
            TweenLite.to(card, 1, { rotationX: cardRotate, ease: Back.easeOut });
            card.data("flipped", !flipped); // Toggle flipped state
            app.getBoardScore();
        });
    
        // Reset strikes and current team for new question
        app.teamStrikes = {1: 0, 2: 0};
        app.updateStrikesDisplay();
        app.currentTeam = 1;
        app.updateTurnIndicator();
    },
    
    

    checkAnswer: function () {
        var userAnswer = $('#userAnswer').val().toLowerCase().trim();
        var qText = app.questions[app.currentQ];
        var correctAnswers = app.allData[qText].map(function (answer) {
            return answer[0].toLowerCase();
        });

        if (correctAnswers.includes(userAnswer)) {
            app.correctAudio.play(); // Play the correct answer audio
            alert("Correct answer!");
            // Find the correct answer in the card and reveal it
            var cards = app.board.find('.card');
            var found = false;
            
            cards.each(function () {
                var cardText = $(this).find('.back span').text().toLowerCase();
                if (cardText === userAnswer) {
                    TweenLite.to($(this), 1, { rotationX: -180, ease: Back.easeOut });
                    $(this).data("flipped", true);
                    found = true;
                }
            });
            app.getBoardScore();
        } else {
            app.wrongAudio.play(); 
            alert("Incorrect answer! Strike for " + ((app.currentTeam === 1) ? app.team1Name : app.team2Name));
            app.handleWrongAnswer();

        }

        $('#userAnswer').val(""); // Clear the input field
    },

    handleWrongAnswer: function () {
        var team = app.currentTeam;
        app.teamStrikes[team]++;
        app.updateStrikesDisplay();

        if (app.teamStrikes[team] >= app.maxStrikes) {
            alert(((team === 1) ? app.team1Name : app.team2Name) + " has reached maximum strikes! Other team gets a chance to steal!");
            // Switch to the other team
            app.currentTeam = (team === 1) ? 2 : 1;
            app.updateTurnIndicator();
            // Reset the strikes for the new team
            app.teamStrikes[app.currentTeam] = 0;
            app.updateStrikesDisplay();
        }
    },
    
    getBoardScore: function () {
        var cards = app.board.find('.card');
        var boardScore = app.board.find('#boardScore');
        var currentScore = { var: boardScore.html() };
        var score = 0;

        function tallyScore() {
            if ($(this).data("flipped")) {
                var value = $(this).find("b").html();
                score += parseInt(value);
            }
        }
        $.each(cards, tallyScore);

        TweenMax.to(currentScore, 1, {
            var: score,
            onUpdate: function () {
                boardScore.html(Math.round(currentScore.var));
            },
            ease: Power3.easeOut,
        });
    },

    awardPoints: function () {
        var num = $(this).attr("data-team");
        var boardScore = app.board.find('#boardScore');
        var currentScore = { var: parseInt(boardScore.html()) };
        var team = app.board.find("#team" + num);
        var teamScore = { var: parseInt(team.html()) };
        var teamScoreUpdated = (teamScore.var + currentScore.var);

        TweenMax.to(teamScore, 1, {
            var: teamScoreUpdated,
            onUpdate: function () {
                team.html(Math.round(teamScore.var));
            },
            ease: Power3.easeOut,
        });

        TweenMax.to(currentScore, 1, {
            var: 0,
            onUpdate: function () {
                boardScore.html(Math.round(currentScore.var));
            },
            ease: Power3.easeOut,
        });

        // Reset strikes for both teams
        app.teamStrikes = {1: 0, 2: 0};
        app.updateStrikesDisplay();

        // Automatically change to the next question after awarding points
        setTimeout(function () {
        }, 1000);
    },

    changeQuestion: function () {
        app.currentQ++;
        app.makeQuestion(app.currentQ);
    },

    // Initial function
    init: function () {
        // Prompt for team names
        app.team1Name = '';
        while (!app.team1Name) {
            app.team1Name = prompt("Enter the name for Team 1:").trim();
            if (!app.team1Name) {
                alert("Team name cannot be empty. Please enter a valid name.");
            }
        }
        
        app.team2Name = '';
        while (!app.team2Name) {
            app.team2Name = prompt("Enter the name for Team 2:").trim();
            if (!app.team2Name) {
                alert("Team name cannot be empty. Please enter a valid name.");
            }
        }
    
        // Show the Start Game button
        const startGameButton = document.getElementById('startGame');
        startGameButton.style.display = 'none';
    
        // Add click event listener to the Start Game button
        startGameButton.addEventListener('click', function() {
            // Sending team names to the PHP script
            fetch('save_teams.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `team1Name=${encodeURIComponent(app.team1Name)}&team2Name=${encodeURIComponent(app.team2Name)}`
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {
                console.log(data); // Log the response from the server
                // Optionally redirect to the game page or start the game
            })
            .catch(error => {
                console.error('Error:', error); // Handle error
            });
        });
    
        // Load the JSON data
        $.getJSON(app.jsonFile, app.jsonLoaded);
        app.board.find('#newQuestion').on('click', app.changeQuestion);
        app.board.find('#awardTeam1').on('click', app.awardPoints);
        app.board.find('#awardTeam2').on('click', app.awardPoints);
    },

    
};


app.init();