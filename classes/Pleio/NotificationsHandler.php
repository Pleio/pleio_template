<?php
namespace Pleio;

class NotificationsHandler {
    static function sendToAll() {
        $dbprefix = elgg_get_config("dbprefix");

        $site = elgg_get_site_entity();

        $upper_bound = time() - (3600 * 2);

        $sql = "SELECT user_guid, time_created, COUNT(*) AS count FROM {$dbprefix}notifications
            WHERE site_guid = {$site->guid}
            AND unread = 'yes'
            AND action != 'welcome'
            AND time_created < {$upper_bound}
            GROUP BY user_guid
            ORDER BY id DESC
        ";

        $rows = get_data($sql);
        foreach ($rows as $row) {
            $user = get_entity($row->user_guid);
            if (!$user || $user->isBanned()) {
                // do not send a mail to banned users
                continue;
            }

            if ($user->last_action < (time() - 3600*24*30*6)) {
                // do not send a mail to users who did not log in for the last 6 months
                return;
            }

            $latest_notifications = (int) $user->getPrivateSetting("latest_notifications_{$site->guid}");
            if ($latest_notifications && $latest_notifications >= (int) $row->time_created) {
                // do not send a mail when we have nothing new
                continue;
            }

            if ((time() - $latest_notifications) < 3600*4) {
                // do not send a mail when the user received a mail in the last 4 hours
                continue;
            }

            NotificationsHandler::sendOverview($user, $upper_bound);
        }
    }

    static function sendOverview(\ElggUser $user, $upper_bound) {
        $dbprefix = elgg_get_config("dbprefix");
        $site = elgg_get_site_entity();

        $sql = "SELECT * FROM {$dbprefix}notifications
            WHERE site_guid = {$site->guid}
            AND unread = 'yes'
            AND action != 'welcome'
            AND time_created < {$upper_bound}
            AND user_guid = {$user->guid}
            ORDER BY id DESC
            LIMIT 5
        ";

        $results = get_data($sql);

        $notifications = [];
        foreach ($results as $result) {
            switch ($result->action) {
                case "commented":
                    $entity = get_entity($result->entity_guid);
                    $container = null;
                    $performer = get_entity($result->performer_guid);
                    if (!$entity || !$performer) {
                        continue 2;
                    }
                    break;
                case "created":
                    $entity = get_entity($result->entity_guid);
                    $container = get_entity($result->container_guid);
                    $performer = get_entity($result->performer_guid);
                    if (!$entity || !$container || !$performer) {
                        continue 2;
                    }
                    break;
                default:
                    // we do not know how to handle this type of notification
                    continue 2;
            }

            $notifications[] = [
                "id" => $result->id,
                "action" => $result->action,
                "time_created" => $result->time_created,
                "entity" => $entity,
                "container" => $container,
                "performer" => $performer
            ];
        }

        if (count($notifications) === 0) {
            return;
        }

        $subject = "Nieuwe notificaties op {$site->name}";
        $message = elgg_view("emails/notification_overview", [
            "notifications" => $notifications,
            "site" => $site
        ]);

        notify_user($user->guid, $site->guid, $subject, $message, null, "email");
        $user->setPrivateSetting("latest_notifications_{$site->guid}", $upper_bound);
    }
}