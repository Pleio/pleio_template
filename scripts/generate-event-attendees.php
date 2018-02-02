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
/*$_SERVER["HTTP_HOST"] = "www.pleio.nl";
$_SERVER["HTTPS"] = true;*/

// Development
//$_SERVER["HTTP_HOST"] = "pleio.localhost.nl";

require_once(dirname(dirname(dirname(__FILE__))) . "/../engine/start.php");

$dbprefix = elgg_get_config("dbprefix");

$rows = get_data("SELECT guid FROM {$dbprefix}users_entity");

foreach ($rows as $row) {
    echo "Creating relationship {$row->guid}" . PHP_EOL;
    insert_data("INSERT INTO {$dbprefix}entity_relationships (guid_one, relationship, guid_two) VALUES (1442, 'event_attending', {$row->guid})");
}
