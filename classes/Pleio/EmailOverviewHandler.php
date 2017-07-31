<?php
namespace Pleio;

class EmailOverviewHandler {
    static function sendToAll($use_queue = true, $interval = "daily") {
        $dbprefix = elgg_get_config("dbprefix");
        $site = elgg_get_site_entity();

        $site_guid = (int) $site->guid;

        if (!in_array($interval, ["daily", "weekly", "monthly"])) {
            throw new Exception("Invalid interval specified.");
        }

        $dblink = get_db_link("read");
        $interval = mysqli_real_escape_string($dblink, $interval);

        $sql = "SELECT r.guid_one, ps.value AS period FROM {$dbprefix}entity_relationships r
            JOIN
                {$dbprefix}private_settings ps ON r.guid_one = ps.entity_guid
            WHERE r.relationship = 'member_of_site'
                AND r.guid_two = {$site_guid}
                AND ps.name = 'email_overview'
                AND ps.value = '{$interval}'
        ";

        $rows = get_data($sql);
        foreach ($rows as $row) {
            if ($use_queue) {
                \PleioAsyncTaskhandler::get()->schedule("Pleio\EmailOverviewHandler::sendOverview", [ $row->guid_one, $site->guid ]);
            } else {
                EmailOverviewHandler::sendOverview($row->guid_one, $site->guid);
            }
        }
    }

    static function sendOverview($user_guid, $site_guid) {
        global $CONFIG;
        static $subtypes;

        if (!$subtypes) {
            $subtypes = EmailOverviewHandler::getSubtypes();
        }

        $user = get_entity($user_guid);
        if (!$user) {
            return;
        }

        $site = get_entity($site_guid);
        if (!$site) {
            return;
        }

        $dbprefix = elgg_get_config("dbprefix");

        $upper_bound = time();
        $lower_bound = $upper_bound - 3600*1500;

        $latest_email_overview = (int) $user->getPrivateSetting("latest_email_overview_{$site->guid}");
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
            AND site_guid = {$site->guid}
            AND {$access}
            ORDER BY guid DESC",
            "guid"
        );

        $already_viewed = EmailOverviewHandler::getColumn("
            SELECT DISTINCT(entity_guid) FROM {$dbprefix}entity_views_log
            WHERE
            performed_by_guid = {$user->guid}
            AND time_created > {$lower_bound}",
            "entity_guid"
        );

        $selected_entities = array_diff($new_entities, $already_viewed);

        if (count($selected_entities) === 0) {
            return;
        }

        $result = elgg_send_email(
            $site->email ? $site->email : "noreply@" . get_site_domain($site->guid),
            $user->email,
            "Periodiek overzicht van {$site->name}",
            "",
            [
                "overview" => true,
                "entities" => EmailOverviewHandler::getEntities($selected_entities, 5)
            ]
        );

        if ($result) {
            $user->setPrivateSetting("latest_email_overview_{$site->guid}", $upper_bound);
        }
    }

    private static function getSubtypes() {
        global $CONFIG;

        $subtypes = array_filter(array_map(function($v) { return get_subtype_id("object", $v); }, $CONFIG->pleio_subtypes));
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