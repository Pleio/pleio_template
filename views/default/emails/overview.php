<?php
$entities = elgg_extract("entities", $vars, []);

foreach ($entities as $entity) {
    $subtype = $entity->getSubtype();
    if (elgg_view_exists("emails/objects/${subtype}")) {
        echo elgg_view("emails/objects/${subtype}", [ "entity" => $entity ]);
    }
}