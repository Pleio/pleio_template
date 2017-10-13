<?php 
$container_guid = get_input("container_guid");
$current_folder	= elgg_extract("folder", $vars);

$container = get_entity($container_guid);
if ($container instanceof ElggObject) {
    $folders = file_tools_get_folders($container->container_guid);
} else {
    $folders = file_tools_get_folders($container->guid);
}

$options = array(
    0 => elgg_echo("file_tools:input:folder_select:main")
);

if(!empty($folders)) {
    $options = $options + file_tools_build_select_options($folders, 1);
}

$vars["options_values"] = $options;
$vars["value"] = $current_folder;

echo elgg_view("input/dropdown", $vars);
