<?php
$users = Pleio\NotificationsAdmin::getUserStats();
?>
<table class="elgg-table mbl">
    <tbody>
        <tr>
            <td>Totaal gebruikers</td><td><?php echo $users["total"]; ?></td>
        </tr>
        <tr>
            <td>Aantal gebruikers met e-mail notificaties</td><td><?php echo $users["email"]; ?></td>
        </tr>
        <tr>
            <td>Aantal gebruikers met periodiek overzicht</td><td><?php echo $users["active"]; ?></td>
        </tr>
    </tbody>
</table>

<?php echo elgg_view("output/confirmlink", [
    "href" => "/action/admin/enable_email_notifications",
    "text" => "Zet e-mailnotificaties aan voor alle gebruikers",
    "class" => "elgg-button elgg-button-submit",
    "is_action" => true
]); ?>

<br /><br />

<?php echo elgg_view("output/confirmlink", [
    "href" => "/action/admin/disable_email_notifications",
    "text" => "Zet e-mailnotificaties uit voor alle gebruikers",
    "class" => "elgg-button elgg-button-submit",
    "is_action" => true
]); ?>

<br /><br />

<?php echo elgg_view("output/confirmlink", [
    "href" => "/action/admin/disable_email_overviews",
    "text" => "Zet periodiek overzicht voor alle gebruikers uit",
    "class" => "elgg-button elgg-button-submit",
    "is_action" => true
]); ?>

<br /><br />

<?php echo elgg_view("output/confirmlink", [
    "href" => "/action/admin/enable_email_overviews",
    "text" => "Zet periodiek overzicht voor alle gebruikers op wekelijks",
    "class" => "elgg-button elgg-button-submit",
    "is_action" => true
]); ?>

<br /><br />