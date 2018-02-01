<?php
/*
There was a time when we made a mistake migrating from the old Pleio template to the new Pleio template and entity relationships for events where not in the form of

($user->guid, 'event_attending', $event->guid)

but the other way around

($event->guid, 'event_attending', $user->guid)

This script is here to fix these wrong relationships.
*/

set_time_limit(0);

if (php_sapi_name() !== 'cli') {
  throw new Exception('This script must be run from the CLI.');
}

// Production
$_SERVER["HTTP_HOST"] = "www.pleio.nl";
$_SERVER["HTTPS"] = true;

// Development
//$_SERVER["HTTP_HOST"] = "pleio.localhost.nl";

require_once(dirname(dirname(dirname(__FILE__))) . "/../engine/start.php");

$relationships = [
    "event_attending",
    "event_maybe",
    "event_reject"
];

$dbprefix = elgg_get_config("dbprefix");

foreach ($relationships as $relationship) {
    $rows = get_data("SELECT rel.id AS id, rel.guid_one AS guid_one, rel.guid_two AS guid_two FROM {$dbprefix}entity_relationships rel JOIN {$dbprefix}users_entity ue ON rel.guid_one = ue.guid WHERE relationship = '{$relationship}'");

    if (!$rows) {
        continue;
    }

    foreach ($rows as $row) {
        echo "Updating relationship {$row->id}" . PHP_EOL;
        update_data("UPDATE {$dbprefix}entity_relationships SET guid_one = {$row->guid_two}, guid_two = {$row->guid_one} WHERE id = {$row->id}");
    }
}
