<?php
namespace Pleio;

class NotificationsHandler {
    static function sendToAll() {
        $dbprefix = elgg_get_config("dbprefix");

        $site = elgg_get_site_entity();
        $site_guid = (int) $site->guid;

        $upper_bound = time() - (3600 * 2);

        $sql = "SELECT user_guid, time_created, COUNT(*) AS count FROM {$dbprefix}notifications
            WHERE site_guid = {$site_guid}
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

            $latest_notifications = (int) $user->getPrivateSetting("latest_notifications_{$site->guid}");
            if ($latest_notifications && $latest_notifications >= (int) $row->time_created) {
                // do not send a mail when we have nothing new
                continue;
            }

            if ((time() - $latest_notifications) < 3600*4) {
                // do not send a mail when the user received a mail in the last 4 hours
                continue;
            }

            $subject = "Nieuwe notificaties op {$site->name}";

            if ($row->count == 1) {
                $message = "Er staat {$row->count} nieuwe notificatie voor je klaar op {$site->name}. Ga naar de volgende link en log in om de notificatie te bekijken:";
            } else {
                $message = "Er staan {$row->count} nieuwe notificaties voor je klaar op {$site->name}. Ga naar de volgende link en log in om de notificaties te bekijken:";
            }

            $message .= "

            {$site->url}";

            notify_user($user->guid, $site->guid, $subject, $message, null, "email");

            $user->setPrivateSetting("latest_notifications_{$site->guid}", $upper_bound);
        }
    }
}