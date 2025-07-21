<?php
// Database connection settings
$host = '127.0.0.1'; // Using localhost or 127.0.0.1
$user = 'root'; // MySQL username
$password = ''; // No password set
$database = 'TEngine'; // Change this to your actual database name
$port = 3307; // If MySQL runs on a different port, update this (default is 3306)

// Create a connection
$conn = new mysqli($host, $user, $password, $database, $port);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Set character encoding (optional but recommended)
$conn->set_charset("utf8mb4");

// Uncomment for debugging
// echo "Connected successfully!";
?>
