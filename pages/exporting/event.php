<?php
$event_guid = (int) get_input("event_guid");

$event = get_entity($event_guid);
if (!$event || !$event instanceof ElggObject || !$event->getSubtype() === "event") {
    exit();
}

if (!$event->canEdit()) {
    exit();
}

if (elgg_get_plugin_setting("event_export", "pleio_template") !== "yes") {
    exit();
}

$relationships = [
    "event_attending",
    "event_maybe",
    "event_reject"
];

$is_admin = elgg_is_admin_logged_in();
$slug = pleio_template_slugify($event->title);

header("Content-Type: text/csv");
header("Content-Disposition: attachment; filename=\"{$slug}.csv\"");
$fp = fopen("php://output", "w");

$headers = [
    "guid",
	"name",
	"username",
	"email (only for admins)",
	"status"
];

fputcsv($fp, $headers, ";");

foreach ($relationships as $relationship) {
    $users = elgg_get_entities_from_relationship([
        "type" => "user",
        "relationship" => $relationship,
        "relationship_guid" => $event->guid,
        "limit" => false
    ]);

    if (!$users) {
        continue;
    }

    foreach ($users as $user) {
        fputcsv($fp, [
            $user->guid,
            $user->name,
            $user->username,
            $is_admin ? $user->email : "",
            str_replace("event_", "", $relationship)
        ], ";");
    }
}

fclose($fp);
