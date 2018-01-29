<?php
echo elgg_view_module(
    "inline",
    elgg_echo("groups"),
    elgg_view("admin/administer_utilities/modules/groups")
);

echo elgg_view_module(
    "inline",
    elgg_echo("users"),
    elgg_view("admin/administer_utilities/modules/users")
);
