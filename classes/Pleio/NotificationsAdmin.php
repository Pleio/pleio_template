<?php
namespace Pleio;

class NotificationsAdmin {
    static function getGroupStats() {
        $dbprefix = elgg_get_config("dbprefix");
        $msid = get_metastring_id("autoNotification") ?: 0;

        $results = get_data_row("SELECT COUNT(*) AS total, COUNT(md.name_id) AS active FROM {$dbprefix}groups_entity ge LEFT JOIN {$dbprefix}metadata md ON ge.guid = md.entity_guid AND md.name_id = {$msid}");
        $subscribers = get_data_row("SELECT COUNT(*) AS total FROM {$dbprefix}entity_relationships WHERE relationship='subscribed'");

        return [
            "total_groups" => $results->total,
            "active_groups" => $results->active,
            "total_subscribers" => $subscribers->total
        ];
    }

    static function getUserStats() {
        $dbprefix = elgg_get_config("dbprefix");
        $site = elgg_get_site_entity();

        $msid = get_metastring_id("autoNotification") ?: 0;
        $results = get_data_row("SELECT
            COUNT(*) AS total,
            COUNT(ps.value) AS active
        FROM {$dbprefix}users_entity ue LEFT JOIN {$dbprefix}private_settings ps ON ue.guid = ps.entity_guid AND ps.name = 'email_overview_{$site->guid}' WHERE ue.banned = 'no'");

        return [
            "total" => $results->total,
            "active" => $results->active
        ];
    }

    static function disableEmailOverviews() {
        $dbprefix = elgg_get_config("dbprefix");
        $site = elgg_get_site_entity();

        $results = get_data("SELECT entity_guid AS guid FROM {$dbprefix}private_settings WHERE name='email_overview_{$site->guid}'");

        foreach ($results as $result) {
            $user = get_entity($result->guid);
            if (!$user) {
                continue;
            }

            $user->removePrivateSetting("email_overview_{$site->guid}");
        }
    }

    static function enableEmailOverviews($interval) {
        $dbprefix = elgg_get_config("dbprefix");
        $site = elgg_get_site_entity();

        $results = get_data("SELECT guid_one AS guid FROM {$dbprefix}entity_relationships WHERE relationship='member_of_site' AND guid_two={$site->guid}");
        foreach ($results as $result) {
            $user = get_entity($result->guid);
            if (!$user || $user->isBanned()) {
                continue;
            }

            $user->setPrivateSetting("email_overview_{$site->guid}", $interval);
        }
    }

    static function disableAutoNotifications() {
        $dbprefix = elgg_get_config("dbprefix");
        $site = elgg_get_site_entity();

        $results = get_data("SELECT guid FROM {$dbprefix}entities WHERE type='group' AND site_guid={$site->guid}");
        foreach ($results as $result) {
            $group = get_entity($result->guid);
            if (!$group) {
                continue;
            }

            unset($group->autoNotification);
        }
    }

    static function enableAutoNotifications() {
        $dbprefix = elgg_get_config("dbprefix");
        $site = elgg_get_site_entity();

        $results = get_data("SELECT guid FROM {$dbprefix}entities WHERE type='group' AND site_guid={$site->guid}");
        foreach ($results as $result) {
            $group = get_entity($result->guid);
            if (!$group) {
                continue;
            }

            $group->autoNotification = true;
        }
    }

    static function subscribeUsersToAutoNotification() {
        $dbprefix = elgg_get_config("dbprefix");
        $site = elgg_get_site_entity();

        $groups = get_data("SELECT guid FROM {$dbprefix}entities WHERE type='group' AND site_guid={$site->guid}");

        foreach ($groups as $group) {
            $members = get_data("SELECT guid_one AS guid FROM {$dbprefix}entity_relationships WHERE relationship='member' AND guid_two={$group->guid}");
            foreach ($members as $member) {
                add_entity_relationship($member->guid, "subscribed", $group->guid);
            }
        }
    }

    static function unsubscribeUsersToAutoNotification() {
        $dbprefix = elgg_get_config("dbprefix");
        $site = elgg_get_site_entity();

        $groups = get_data("SELECT guid FROM {$dbprefix}entities WHERE type='group' AND site_guid={$site->guid}");

        foreach ($groups as $group) {
            $members = get_data("SELECT guid_one AS guid FROM {$dbprefix}entity_relationships WHERE relationship='subscribed' AND guid_two={$group->guid}");
            foreach ($members as $member) {
                remove_entity_relationship($member->guid, "subscribed", $group->guid);
            }
        }
    }
}