<?php
$entities = elgg_extract("entities", $vars, []);

foreach ($entities as $entity) {
    echo $entity->getSubtype() . PHP_EOL;
    echo $entity->title . PHP_EOL;
    echo elgg_get_excerpt($entity->description) . PHP_EOL;
    echo PHP_EOL;
}