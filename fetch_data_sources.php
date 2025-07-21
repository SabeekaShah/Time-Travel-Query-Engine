<?php
header('Content-Type: application/json');
require 'db.php'; // Make sure this connects correctly

// Query to fetch data sources
$query = "SELECT id, source_name, source_url, last_fetched FROM data_sources"; 
$result = $conn->query($query);

$data_sources = [];
while ($row = $result->fetch_assoc()) {
    $data_sources[] = [
        "id" => $row['id'],
        "name" => $row['source_name'], // use 'source_name' but send as 'name' for frontend
        "description" => "URL: " . $row['source_url'] . " (Last fetched: " . $row['last_fetched'] . ")" 
        // combining source_url and last_fetched in description field
    ];
}

echo json_encode($data_sources);

$conn->close();
?>
