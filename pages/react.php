<?php
$site = elgg_get_site_entity();
elgg_set_page_owner_guid($site->guid);

$page = get_input("page");
if ($page && $page[0] === "view") {
    $object = pleio_template_get_object($page[1]);
}

if ($object) {
    $title = ($object->title ? $object->title : $object->name) . " · " . $site->name;
    $metas = [
        "og:title" => $object->title ? $object->title : $object->name,
        "og:description" => str_replace("\"", "", elgg_get_excerpt($object->description)),
        "og:type" => "article",
        "og:image" => $object->featuredIcontime ? "/mod/pleio_template/featuredimage.php?guid={$object->guid}&lastcache={$object->featuredIcontime}" : "",
        "og:video" => $object->featuredVideo ? $object->featuredVideo : "",
        "og:url" => full_url(),
        "og:site_name" => $site->name,
        "article:published_time" => date("Y-m-d H:i", $object->time_created),
        "article:modified_time" => date("Y-m-d H:i", $object->time_updated),
    ];
} else {
    $title = $site->name;
    $metas = [ "og:title" => $site->name ];
}

echo elgg_view_page($title, $content, "default", [
    "metas" => $metas,
    "settings" => Pleio\Helpers::getSettings()
]);
