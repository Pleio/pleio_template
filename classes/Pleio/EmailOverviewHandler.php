<?php
namespace Pleio;

class EmailOverviewHandler {
    static function sendToAll($use_queue = true) {
        $dbprefix = elgg_get_config("dbprefix");
        $site = elgg_get_site_entity();

        $site_guid = (int) $site->guid;

        $sql = "SELECT r.guid_one FROM {$dbprefix}entity_relationships r
            JOIN
                {$dbprefix}private_settings ps ON r.guid_one = ps.entity_guid
            WHERE r.relationship = 'member_of_site'
                AND r.guid_two = {$site_guid}
                AND ps.name = 'email_overview'
        ";

        $members = get_data($sql);
        foreach ($members as $member) {
            $member = get_entity($member->guid_one);

            if ($use_queue) {
                PleioAsyncTaskhandler::schedule("Pleio\EmailOverviewHandler::sendOverview", [ $member ]);
            } else {
                EmailOverviewHandler::sendOverview($member);
            }
        }
    }

    static function sendOverview(\ElggUser $user) {
        static $site;
        static $subtypes;

        if (!$site) {
            $site = elgg_get_site_entity();
        }

        if (!$subtypes) {
            $subtypes = EmailOverviewHandler::getSubtypes();
        }

        $dbprefix = elgg_get_config("dbprefix");

        $upper_bound = time();
        $lower_bound = $upper_bound - 3600*1500;

        $latest_email_overview = (int) $user->getPrivateSetting("latest_email_overview");
        if ($latest_email_overview > $lower_bound) {
            $lower_bound = $latest_email_overview;
        }

        $access = get_access_sql_suffix("{$dbprefix}entities", $user->guid);

        $new_entities = EmailOverviewHandler::getColumn("
            SELECT guid FROM elgg_entities
            WHERE time_created > {$lower_bound}
            AND time_created <= {$upper_bound}
            AND type = 'object'
            AND subtype IN ({$subtypes})
            AND owner_guid != {$user->guid}
            AND {$access}
            ORDER BY guid DESC",
            "guid"
        );

        $already_viewed = EmailOverviewHandler::getColumn("
            SELECT DISTINCT(entity_guid) FROM {$dbprefix}entity_views_log
            WHERE
            performed_by_guid = {$user->guid}
            AND time_created > {$lower_bound}
            AND time_created <= {$upper_bound}",
            "entity_guid"
        );

        $already_viewed = [];

        $selected_entities = array_diff($new_entities, $already_viewed);

        if (count($selected_entities) === 0) {
            return;
        }

        $result = email_notify_handler(
            $site,
            $user,
            "Periodiek overzicht van {$site->name}",
            elgg_view("emails/overview", [
                "entities" => EmailOverviewHandler::getEntities($selected_entities, 5)
            ])
        );

        if ($result) {
            $user->setPrivateSetting("latest_email_overview", $upper_bound);
        }
    }

    private static function getSubtypes() {
        $subtypes = array_filter(array_map(function($v) { return get_subtype_id("object", $v); }, PLEIO_SUBTYPES));
        $sanitized_subtypes = array_map(function($v) { return sanitize_int($v); }, $subtypes);
        return implode(",", $sanitized_subtypes);
    }

    private static function getColumn($query, $column) {
        $result = get_data($query);
        if (!$result) {
            return [];
        }

        return array_map(function($row) use ($column) { return $row->$column; }, $result);
    }

    private static function getEntities($guids, $limit = 5) {
        $guids = array_slice($guids, 0, $limit);
        return elgg_get_entities(array(
            "guids" => $guids,
            "limit" => false,
            "site_guids" => false
        ));
    }
}