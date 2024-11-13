# Family Feud Game

## Overview
This is a web-based implementation of the classic game show **Family Feud**. Two teams compete to guess the most popular answers to survey questions. Players take turns providing answers, and correct responses earn points. The game ends when a team reaches the maximum score or after a predetermined number of rounds.

## Game Flow

### 1. Initialization
- The game initializes by setting up the necessary variables and loading the question data from a JSON file.
- Team names are collected, and the game board is created with score displays and strike counts.

### 2. Displaying Questions
- A question is randomly selected from the available dataset.
- The question is displayed on the game board, along with answer options hidden in card format.
- The initial strike counts for both teams are set to zero.

### 3. Player Turns
- The game indicates whose turn it is to answer (Team 1 or Team 2).
- The active team submits an answer via an input field and a "Submit Answer" button.

### 4. Answer Checking
- The submitted answer is checked against the correct answers.
  - If the answer is correct:
    - The corresponding card is flipped to reveal the answer.
    - A correct answer sound is played.
    - The score for the current board is updated.
  - If the answer is incorrect:
    - A buzzer sound is played.
    - The current team receives a strike.
    - If a team reaches the maximum number of strikes, the other team gets a chance to "steal" the question.

### 5. Updating Scores
- The game maintains and updates scores for each team based on correct answers.
- When a team is awarded points, the updated score is animated on the board.

### 6. Handling Strikes
- The game tracks the number of strikes each team has.
- When a team reaches the maximum number of strikes, they lose their turn, and the other team has an opportunity to answer the question.
- Strike counts are displayed visually on the board.

### 7. New Questions
- After each question, the game resets the strike counts and prepares a new question.
- Teams alternate turns until the game ends.

### 8. Game End
- The game ends when a team reaches a predetermined score or after a set number of rounds.
- The winner is announced based on the final scores.

## Features
- **Sound Effects**: Includes audio feedback for correct and incorrect answers.
- **Dynamic Scoring**: Automatically updates and animates team scores.
- **Visual Indicators**: Clearly shows whose turn it is and the number of strikes each team has.

## Dependencies
- jQuery for DOM manipulation.
- TweenLite and TweenMax for animations.

## Getting Started
1. Clone the repository or download the files.
2. Ensure you have an internet connection to load external resources.
3. Open the `index.html` file in your web browser to start the game.

## Contributions

Feel free to fork the repository and submit pull requests with improvements or additional features.



