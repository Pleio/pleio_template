<?php
$notifications = elgg_extract("notifications", $vars);
$site = elgg_extract("site", $vars);
?>

Je hebt nieuwe notificaties ontvangen op <?php echo $site->name; ?>. Ga naar <?php echo $site->url; ?> om de details te bekijken.

<?php foreach ($notifications as $notification): ?><?php
    echo "<hr style=\"border:none;border-bottom:1px solid #ececec;margin:1.5rem 0;width:100%\">";
    if ($notification['action'] === "created") {
        echo "<b>{$notification['performer']->name}</b> heeft een nieuw item <b>{$notification['entity']->title}</b> geplaatst in <b>{$notification['container']->name}</b>.";
    } elseif ($notification['action'] === "commented") {
        echo "<b>{$notification['performer']->name}</b> heeft gereageerd op <b>{$notification['entity']->title}</b>.";
    }
?><?php endforeach; ?>