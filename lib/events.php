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
    if (!$container instanceof ElggGroup) {
        return;
    }

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

        if (!$container->isMember($subscriber)) {
            // do not notify users that are not member any more
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

    $default_overview = elgg_get_plugin_setting("default_email_overview", "pleio_template") ?: "weekly";
    if ($default_overview && !$default_overview !== "never") {
        $user->setPrivateSetting("email_overview_{$site->guid}", $default_overview);
    }
}

function pleio_template_join_group_handler($event, $type, $params) {
    $group = elgg_extract("group", $params);
    $user = elgg_extract("user", $params);

    if ($group->autoNotification) {
        add_entity_relationship($user->guid, "subscribed", $group->guid);
    }
}

function pleio_template_leave_group_handler($event, $type, $params) {
    $group = elgg_extract("group", $params);
    $user = elgg_extract("user", $params);

    remove_entity_relationship($user->guid, "subscribed", $group->guid);
}