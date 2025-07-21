<?php
header('Content-Type: application/json');
require 'db.php'; // Ensure this file correctly establishes the database connection

if ($conn->connect_error) {
    echo json_encode([]);
    exit;
}

// Input parameters
$start_date = $_GET['start_date'] ?? '';
$end_date = $_GET['end_date'] ?? '';
$category = $_GET['category'] ?? '';
$country = $_GET['country'] ?? '';

// Validate required dates
if (empty($start_date) || empty($end_date)) {
    echo json_encode([]);
    exit;
}

// Build dynamic query
$query = "SELECT id, event_name, category_id, country, value, record_date 
          FROM historical_data 
          WHERE record_date BETWEEN ? AND ?";
$params = [$start_date, $end_date];
$types = "ss";

if (!empty($category)) {
    $query .= " AND category_id = ?";
    $params[] = $category;
    $types .= "s";
}

if (!empty($country)) {
    $query .= " AND country = ?";
    $params[] = $country;
    $types .= "s";
}

$stmt = $conn->prepare($query);
$stmt->bind_param($types, ...$params);
$stmt->execute();
$result = $stmt->get_result();

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data); // Always return array

$stmt->close();
$conn->close();
?>
