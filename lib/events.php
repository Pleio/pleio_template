<?php
function pleio_template_create_object_handler($event, $type, $object) {
    if (!$object || !$object instanceof ElggObject) {
        return;
    }

    $container = $object->getContainerEntity();
    $subtype = $object->getSubtype();

    switch ($subtype) {
        case "comment":
            pleio_template_create_comment_handler($object);
            break;
        case "event":
        case "thewire":
        case "blog":
        case "question":
        case "discussion":
        case "wiki":
            if ($container instanceof ElggGroup) {
                pleio_template_create_group_object_handler($object);
            }
            break;
    }
}

function pleio_template_create_comment_handler($object) {
    $dbprefix = elgg_get_config("dbprefix");

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

function pleio_template_create_group_object_handler($object) {
    $dbprefix = elgg_get_config("dbprefix");

    $performer = elgg_get_logged_in_user_entity();
    if (!$performer) {
        return;
    }

    $site = elgg_get_site_entity();

    $container = $object->getContainerEntity();

    $time = time();

    $subscribers = elgg_get_entities_from_relationship([
        "type" => "user",
        "relationship_guid" => $container->guid,
        "relationship" => "subscribed",
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
            ({$subscriber->guid}, 'created', {$performer->guid}, {$object->guid}, {$container->guid}, {$site->guid}, {$time})");
    }
}

function pleio_template_create_member_of_site_handler($event, $type, $relationship) {
    $dbprefix = elgg_get_config("dbprefix");

    $user = get_entity($relationship->guid_one);
    if (!$user) {
        return;
    }

    $site = get_entity($relationship->guid_two);
    if (!$site) {
        return;
    }

    $time = time();

    insert_data("INSERT INTO {$dbprefix}notifications (user_guid, action, performer_guid, entity_guid, container_guid, site_guid, time_created)
        VALUES
        ({$user->guid}, 'welcome', {$user->guid}, {$user->guid}, 0, {$site->guid}, {$time})");
}