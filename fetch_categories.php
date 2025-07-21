<?php
header('Content-Type: application/json');
require 'db.php'; // Ensure this file correctly connects to the database

$query = "SELECT id, category_name FROM categories";
$result = $conn->query($query);

$categories = [];
while ($row = $result->fetch_assoc()) {
    $categories[] = ["id" => $row['id'], "name" => $row['category_name']];
}

// Return categories in JSON format
echo json_encode($categories);
$conn->close();
?>
