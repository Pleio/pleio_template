<?php
use GraphQL\GraphQL as GraphQL;

if ($_SERVER['REQUEST_METHOD'] !== "POST") {
    echo "This endpoint only accepts POST requests.";
    exit();
}

if (!$_SERVER['HTTP_X_CSRF_TOKEN'] | $_SERVER['HTTP_X_CSRF_TOKEN'] !== $_COOKIE['CSRF_TOKEN']) {
    echo "CSRF Token is invalid.";
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

header('Content-Type: application/json');
echo json_encode($result);