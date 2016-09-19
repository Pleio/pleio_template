<?php
use GraphQL\GraphQL as GraphQL;

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== "POST") {
    echo json_encode(["error" => "This endpoint only accepts POST requests."]);
    exit();
}

if ($_SERVER['HTTP_X_CSRF_TOKEN'] && $_SERVER['HTTP_X_CSRF_TOKEN'] !== $_COOKIE['CSRF_TOKEN']) {
    echo json_encode(["error" => "CSRF Token is invalid."]);
    exit();
}

if (isset($_SERVER['CONTENT_TYPE']) && $_SERVER['CONTENT_TYPE'] === 'application/json') {
    $rawBody = file_get_contents('php://input');
    $data = json_decode($rawBody ?: '', true);
} else {
    $data = $_POST;
}

$requestString = isset($data['query']) ? $data['query'] : null;
$operationName = isset($data['operation']) ? $data['operation'] : null;
$variableValues = isset($data['variables']) ? $data['variables'] : null;

$schema = Pleio\SchemaBuilder::build();
$result = GraphQL::execute($schema, $requestString, null, $variableValues);
echo json_encode($result);