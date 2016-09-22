<?php
require_once(dirname(__FILE__) . "/../../vendor/autoload.php");
spl_autoload_register("pleio_template_autoloader");
function pleio_template_autoloader($class) {
    $filename = "classes/" . str_replace("\\", "/", $class) . ".php";
    if (file_exists(dirname(__FILE__) . "/" . $filename)) {
        include($filename);
    }
}

define("PLEIO_TEMPLATE_LESS", dirname(__FILE__) . "/src/less/");

function pleio_template_init() {
    elgg_register_css("pleio_template", "/css/pleio_template.css");
    elgg_register_js("pleio_template", "/mod/pleio_template/build/all.js");

    elgg_register_plugin_hook_handler("index", "system", "pleio_template_index_handler");

    elgg_register_page_handler("activity", "pleio_template_page_handler");
    elgg_register_page_handler("blog", "pleio_template_page_handler");
    elgg_register_page_handler("news", "pleio_template_page_handler");
    elgg_register_page_handler("forum", "pleio_template_page_handler");

    elgg_register_page_handler("graphql", "pleio_template_graphql");

    if (!isset($_COOKIE["CSRF_TOKEN"])) {
        $token = md5(openssl_random_pseudo_bytes(32));
        $domain = ini_get("session.cookie_domain");
        setcookie("CSRF_TOKEN", $token, 0, "/", $domain);
    }
}

elgg_register_event_handler("init", "system", "pleio_template_init");

function pleio_template_index_handler($hook, $type, $return_value, $return_value) {
    include("pages/react.php");
    return true;
}

function pleio_template_page_handler($page) {
    include("pages/react.php");
    return true;
}

function pleio_template_graphql() {
    include("pages/graphql.php");
    return true;
}

function pleio_template_assets($path) {
    return "/mod/pleio_template/src/" . $path;
}