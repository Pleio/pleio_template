<?php
$plugin = $vars["entity"];

echo elgg_view_module(
    "inline",
    elgg_echo("pleio_template:logo"),
    elgg_view("plugins/pleio_template/modules/logo", ["plugin" => $plugin])
);

echo elgg_view_module(
    "inline",
    elgg_echo("pleio_template:settings"),
    elgg_view("plugins/pleio_template/modules/settings", ["plugin" => $plugin])
);

echo elgg_view_module(
    "inline",
    elgg_echo("pleio_template:menu"),
    elgg_view("plugins/pleio_template/modules/menu", ["plugin" => $plugin])
);

echo elgg_view_module(
    "inline",
    elgg_echo("pleio_template:filters"),
    elgg_view("plugins/pleio_template/modules/filters", ["plugin" => $plugin])
);

echo elgg_view_module(
    "inline",
    elgg_echo("pleio_template:footer"),
    elgg_view("plugins/pleio_template/modules/footer", ["plugin" => $plugin])
);

echo elgg_view_module(
    "inline",
    elgg_echo("pleio_template:analytics"),
    elgg_view("plugins/pleio_template/modules/analytics", ["plugin" => $plugin])
);
