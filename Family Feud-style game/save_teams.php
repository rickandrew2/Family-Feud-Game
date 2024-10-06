<?php
// Database connection parameters
$host = 'localhost'; // Your database host
$db = 'family_feud'; // Your database name
$user = 'root@localhost'; // Your database username
$pass = ''; // Your database password

// Create connection
$conn = new mysqli($host, $user, $pass, $db);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if data is sent via POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $team1Name = $conn->real_escape_string($_POST['team1Name']);
    $team2Name = $conn->real_escape_string($_POST['team2Name']);

    // Insert query
    $sql = "INSERT INTO teams (team1Name, team2Name) VALUES ('$team1Name', '$team2Name')";

    if ($conn->query($sql) === TRUE) {
        echo "Teams saved successfully.";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

$conn->close();
?>