<?php
$groups = Pleio\NotificationsAdmin::getGroupStats();
$users = Pleio\NotificationsAdmin::getUserStats();
?>
<table class="elgg-table mbl">
    <tbody>
        <tr>
            <td>Totaal groepen</td><td><?php echo $groups["total_groups"]; ?></td>
        </tr>
        <tr>
            <td>Aantal groepen met auto-notificatie</td><td><?php echo $groups["active_groups"]; ?></td>
        </tr>
        <tr>
            <td>Aantal abonnees</td><td><?php echo $groups["total_subscribers"]; ?></td>
        </tr>
    </tbody>
</table>

<?php echo elgg_view("output/confirmlink", [
    "href" => "/action/admin/enable_auto_notifications",
    "text" => "Zet auto-notificaties aan voor alle groepen",
    "class" => "elgg-button elgg-button-submit",
    "is_action" => true
]); ?>

<br /><br />

<?php echo elgg_view("output/confirmlink", [
    "href" => "/action/admin/disable_auto_notifications",
    "text" => "Zet auto-notificaties uit voor alle groepen",
    "class" => "elgg-button elgg-button-submit",
    "is_action" => true
]); ?>

<br /><br />

<?php echo elgg_view("output/confirmlink", [
    "href" => "/action/admin/subscribe_users_to_auto_notification",
    "text" => "Abonneer alle groepsleden op groepen met auto-notificatie aan",
    "class" => "elgg-button elgg-button-submit",
    "is_action" => true
]); ?>

<br /><br />

<?php echo elgg_view("output/confirmlink", [
    "href" => "/action/admin/unsubscribe_users_to_auto_notification",
    "text" => "Deabonneer alle groepsleden op groepen met auto-notificatie aan",
    "class" => "elgg-button elgg-button-submit",
    "is_action" => true
]); ?>
