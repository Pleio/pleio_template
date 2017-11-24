<?php
echo elgg_view_form("admin/users/search", [
    "method" => "GET",
    "action" => "/admin/users/all",
    "disable_security" => true // not a transactional request
]);

$q = get_input("q");
$offset = (int) get_input("offset", 0);
$limit = (int) get_input("limit", 10);
$site = elgg_get_site_entity();

$options = [
    "type" => "user",
    "offset" => $offset,
    "limit" => $limit,
    "relationship" => "member_of_site",
    "relationship_guid" => $site->guid,
    "inverse_relationship" => true,
    "query" => $q
];

if ($q || class_exists("ESInterface")) {
    // use Elasticsearch also for listing as it is much faster then a member_of_site SQL query
    $results = elgg_trigger_plugin_hook("search", "user", $options, array());
    $users = $results["entities"];
    $count = $results["count"];
} else {
    $users = elgg_get_entities_from_relationship($options);
    $count = elgg_get_entities_from_relationship(array_merge($options, ["count" => true]));
}

echo elgg_view_entity_list($users, [
    "count" => $count,
    "offset" => $offset,
    "limit" => $limit,
    "pagination" => true,
    "full_view" => false,
    "list_type_toggle" => false
]);