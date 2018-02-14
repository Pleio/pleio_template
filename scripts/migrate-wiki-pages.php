<?php
/*
Convert all pages to the structure the new Pleio template.
This means objects in groups with subtype page_top and page are converted to wiki.
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

$dbprefix = elgg_get_config("dbprefix");
$ia = elgg_set_ignore_access(true);
$subtype_id = add_subtype("object", "wiki");

$options = [
    "type" => "object",
    "subtypes" => ["page", "page_top"],
    "limit" => false
];

foreach (elgg_get_entities($options) as $page) {
    echo "Updating {$page->getSubtype()} {$page->guid}" . PHP_EOL;

    if ($page->parent_guid) {
        $page->container_guid = $page->parent_guid;
        $page->save();
    }

    update_data("UPDATE {$dbprefix}entities SET subtype = {$subtype_id} WHERE guid = {$page->guid}");
    clear_entity_cache($page->guid);
}

elgg_set_ignore_access($ia);
