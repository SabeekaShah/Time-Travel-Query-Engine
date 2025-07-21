<?php
header('Content-Type: application/json');
require 'db.php'; // Ensure this correctly connects to your database

// Validate category ID (optional)
$category_id = isset($_GET['category_id']) ? intval($_GET['category_id']) : 0;

$query = "SELECT p.category_id, p.predicted_value, p.predicted_date, p.confidence_score, c.category_name 
          FROM predictions p
          JOIN categories c ON p.category_id = c.id";

if ($category_id > 0) {
    $query .= " WHERE p.category_id = ?";
}

$query .= " ORDER BY p.predicted_date ASC";

$stmt = $conn->prepare($query);

if ($category_id > 0) {
    $stmt->bind_param("i", $category_id);
}

$stmt->execute();
$result = $stmt->get_result();

$predictions = [];

while ($row = $result->fetch_assoc()) {
    $predictions[] = [
        "category_id" => $row["category_id"],
        "category_name" => $row["category_name"],
        "predicted_value" => $row["predicted_value"],
        "predicted_date" => $row["predicted_date"],
        "confidence_score" => $row["confidence_score"] // If applicable
    ];
}

// Return predictions as JSON
echo json_encode($predictions);

$stmt->close();
$conn->close();
?>
