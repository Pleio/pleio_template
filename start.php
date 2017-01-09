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
    elgg_register_plugin_hook_handler("index", "system", "pleio_template_index_handler");
    elgg_register_plugin_hook_handler("container_permissions_check", "object", "pleio_template_container_permissions_check_hook");

    elgg_register_page_handler("campagne", "pleio_template_page_handler");
    elgg_register_page_handler("activity", "pleio_template_page_handler");
    elgg_register_page_handler("blog", "pleio_template_page_handler");
    elgg_register_page_handler("news", "pleio_template_page_handler");
    elgg_register_page_handler("questions", "pleio_template_page_handler");
    elgg_register_page_handler("profile", "pleio_template_page_handler");
    elgg_register_page_handler("page", "pleio_template_page_handler");
    elgg_register_page_handler("pages", "pleio_template_page_handler");
    elgg_register_page_handler("search", "pleio_template_page_handler");
    elgg_register_page_handler("bookmarks", "pleio_template_page_handler");
    elgg_register_page_handler("trending", "pleio_template_page_handler");

    elgg_register_page_handler("login", "pleio_template_page_handler");
    elgg_register_page_handler("register", "pleio_template_page_handler");
    elgg_register_page_handler("forgotpassword", "pleio_template_page_handler");
    elgg_register_page_handler("resetpassword", "pleio_template_page_handler");

    elgg_register_page_handler("graphql", "pleio_template_graphql");
    elgg_register_page_handler("upload", "pleio_template_upload");

    elgg_unregister_plugin_hook_handler("entity:icon:url", "user", "profile_override_avatar_url");
    elgg_register_plugin_hook_handler("entity:icon:url", "user", "pleio_template_user_icon_url");

    if (!isset($_COOKIE["CSRF_TOKEN"])) {
        $token = md5(openssl_random_pseudo_bytes(32));
        $domain = ini_get("session.cookie_domain");
        setcookie("CSRF_TOKEN", $token, 0, "/", $domain);
    }
}

elgg_register_event_handler("init", "system", "pleio_template_init");

function pleio_template_index_handler($hook, $type, $return_value, $params) {
    include("pages/react.php");
    return true;
}

function pleio_template_container_permissions_check_hook($hook, $type, $return_value, $params) {
    $user = elgg_extract("user", $params);
    $container = elgg_extract("container", $params);
    $subtype = elgg_extract("subtype", $params);

    if (!$user) {
        return $return_value;
    }

    if (!in_array($subtype, ["page", "news"])) {
        return $return_value;
    }

    // only allow admins to create pages and news
    return $user->isAdmin();
}

function pleio_template_user_icon_url($hook, $type, $return_value, $params) {
    // if someone already set this, quit
    if ($return_value) {
        return null;
    }

    $user = $params['entity'];
    $size = $params['size'];

    if (!elgg_instanceof($user, 'user')) {
        return null;
    }

    $user_guid = $user->getGUID();
    $icon_time = $user->icontime;

    if (!$icon_time) {
        return "/mod/pleio_template/src/images/user.png";
    }

    if ($user->isBanned()) {
        return null;
    }

    $filehandler = new ElggFile();
    $filehandler->owner_guid = $user_guid;
    $filehandler->setFilename("profile/{$user_guid}{$size}.jpg");

    try {
        if ($filehandler->exists()) {
            $join_date = $user->getTimeCreated();
            return "mod/profile/icondirect.php?lastcache=$icon_time&joindate=$join_date&guid=$user_guid&size=$size";
        }
    } catch (InvalidParameterException $e) {
        return "/mod/pleio_template/src/images/user.png";
    }

    return null;
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