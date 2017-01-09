<?php
$plugin = $vars["entity"];

echo elgg_view_module(
    "inline",
    elgg_echo("pleio_template:analytics"),
    elgg_view("plugins/pleio_template/modules/analytics", ["plugin" => $plugin])
);