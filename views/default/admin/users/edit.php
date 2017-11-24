<?php
$guid = get_input("guid");

$user = get_entity($guid);
if (!$user || !$user instanceof ElggUser) {
    register_error(elgg_echo("ClassException:ClassnameNotClass", array($guid, elgg_echo("item:user"))));
    forward("/admin/users/all");
}

echo elgg_view_module(
    "inline",
    elgg_echo("admin:profile:details"),
    elgg_view("admin/users/components/details", ["entity" => $user])
);

echo elgg_view_form("admin/users/edit", ["action" => "action/profile/edit"], ["entity" => $user]);