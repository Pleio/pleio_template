<?php
$site = elgg_get_site_entity();
elgg_set_page_owner_guid($site->guid);

$title = $site->title;
echo elgg_view_page($title, $content);
