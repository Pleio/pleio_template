<?php
function pleio_template_create_object_handler($event, $type, $object) {
    if (!$object || !$object instanceof ElggObject) {
        return;
    }

    $dbprefix = elgg_get_config("dbprefix");
    $subtype = $object->getSubtype();

    if (!in_array($subtype, ["comment"])) {
        return;
    }

    $performer = elgg_get_logged_in_user_entity();
    if (!$performer) {
        return;
    }

    $site = elgg_get_site_entity();

    $entity = $object->getContainerEntity();
    if (!$entity) {
        return;
    }

    $container = $entity->getContainerEntity();

    $time = time();

    insert_data("INSERT IGNORE INTO {$dbprefix}entity_relationships (guid_one, relationship, guid_two, time_created)
        VALUES
        ({$performer->guid}, 'content_subscription', {$entity->guid}, $time)");

    $subscribers = elgg_get_entities_from_relationship([
        "type" => "user",
        "relationship_guid" => $entity->guid,
        "relationship" => "content_subscription",
        "inverse_relationship" => true,
        "limit" => false
    ]);

    if (!$subscribers) {
        return;
    }

    foreach ($subscribers as $subscriber) {
        if ($subscriber->guid === $performer->guid) {
            // do not notify user of own actions
            continue;
        }

        insert_data("INSERT INTO {$dbprefix}notifications (user_guid, action, performer_guid, entity_guid, container_guid, site_guid, time_created)
            VALUES
            ({$subscriber->guid}, 'commented', {$performer->guid}, {$entity->guid}, {$container->guid}, {$site->guid}, {$time})");
    }
}