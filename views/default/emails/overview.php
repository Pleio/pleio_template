<?php
$entities = elgg_extract("entities", $vars, []);
?>

<?php foreach ($entities as $entity): ?>
    <h1><?php echo $entity->title; ?></h1>
    <p><?php echo elgg_get_excerpt($entity->description); ?></p>
    <br />
<?php endforeach; ?>