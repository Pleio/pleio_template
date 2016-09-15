<?php
require_once(dirname(__FILE__) . "/../../vendor/autoload.php");
spl_autoload_register('pleio_template_autoloader');
function pleio_template_autoloader($class) {
    $filename = "classes/" . str_replace('\\', '/', $class) . '.php';
    if (file_exists(dirname(__FILE__) . "/" . $filename)) {
        include($filename);
    }
}

define("PLEIO_TEMPLATE_LESS", dirname(__FILE__) . "/src/less/");

function pleio_template_init() {
    elgg_register_css("pleio_template", "/css/pleio_template.css");
    elgg_register_js("pleio_template", "/mod/pleio_template/build/all.js");

    elgg_register_page_handler('graphql', 'pleio_template_graphql');
}

elgg_register_event_handler('init', 'system', 'pleio_template_init');

function pleio_template_graphql() {
    include("pages/graphql.php");
    return true;
}

function pleio_template_assets($path) {
    return "/mod/pleio_template/src/" . $path;
}