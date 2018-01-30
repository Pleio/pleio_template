<?php
require_once(dirname(__FILE__) . "/lib/functions.php");
require_once(dirname(__FILE__) . "/lib/events.php");
require_once(dirname(__FILE__) . "/lib/hooks.php");

require_once(dirname(__FILE__) . "/../../vendor/autoload.php");
spl_autoload_register("pleio_template_autoloader");
function pleio_template_autoloader($class) {
    $filename = "classes/" . str_replace("\\", "/", $class) . ".php";
    if (file_exists(dirname(__FILE__) . "/" . $filename)) {
        include($filename);
    }
}

$CONFIG->pleio_subtypes = ["news", "blog", "question", "event"];

function pleio_template_init() {
    $lang = get_current_language();
    if ($lang == "nl") {
        setlocale(LC_TIME, "nl_NL");
    }

    elgg_register_action("odt_editor/upload", dirname(__FILE__) . "/actions/odt_editor/upload.php");
    elgg_register_action("odt_editor/upload_asnew", dirname(__FILE__) . "/actions/odt_editor/upload_asnew.php");

    elgg_register_action("admin/disable_email_overviews", dirname(__FILE__) . "/actions/admin/disable_email_overviews.php", "admin");
    elgg_register_action("admin/enable_email_overviews", dirname(__FILE__) . "/actions/admin/enable_email_overviews.php", "admin");
    elgg_register_action("admin/disable_auto_notifications", dirname(__FILE__) . "/actions/admin/disable_auto_notifications.php", "admin");
    elgg_register_action("admin/enable_auto_notifications", dirname(__FILE__) . "/actions/admin/enable_auto_notifications.php", "admin");
    elgg_register_action("admin/subscribe_users_to_auto_notification", dirname(__FILE__) . "/actions/admin/subscribe_users_to_auto_notification.php", "admin");
    elgg_register_action("admin/unsubscribe_users_to_auto_notification", dirname(__FILE__) . "/actions/admin/unsubscribe_users_to_auto_notification.php", "admin");


    elgg_register_plugin_hook_handler("index", "system", "pleio_template_index_handler");
    elgg_register_plugin_hook_handler("container_permissions_check", "object", "pleio_template_container_permissions_check_hook");
    elgg_register_plugin_hook_handler("action", "plugins/settings/save", "pleio_template_plugins_settings_save");
    elgg_register_plugin_hook_handler("permissions_check", "all", "pleio_template_permissions_check");

    elgg_register_event_handler("create", "object", "pleio_template_create_object_handler");
    elgg_register_event_handler("create", "member_of_site", "pleio_template_create_member_of_site_handler");
    elgg_register_event_handler("join", "group", "pleio_template_join_group_handler");
    elgg_register_event_handler("leave", "group", "pleio_template_leave_group_handler");

    elgg_register_page_handler("campagne", "pleio_template_page_handler");
    elgg_register_page_handler("activity", "pleio_template_page_handler");
    elgg_register_page_handler("blog", "pleio_template_page_handler");
    elgg_register_page_handler("news", "pleio_template_page_handler");
    elgg_register_page_handler("questions", "pleio_template_page_handler");
    elgg_register_page_handler("discussions", "pleio_template_page_handler");
    elgg_register_page_handler("profile", "pleio_template_page_handler");
    elgg_register_page_handler("groups", "pleio_template_page_handler");
    elgg_register_page_handler("cms", "pleio_template_page_handler");
    elgg_register_page_handler("pages", "pleio_template_page_handler");
    elgg_register_page_handler("search", "pleio_template_page_handler");
    elgg_register_page_handler("bookmarks", "pleio_template_page_handler");
    elgg_register_page_handler("trending", "pleio_template_page_handler");
    elgg_register_page_handler("events", "pleio_template_events_handler");

    elgg_register_page_handler("login", "pleio_template_page_handler");
    elgg_register_page_handler("register", "pleio_template_page_handler");
    elgg_register_page_handler("forgotpassword", "pleio_template_page_handler");
    elgg_register_page_handler("resetpassword", "pleio_template_page_handler");

    elgg_register_page_handler("graphql", "pleio_template_graphql");
    elgg_register_page_handler("upload", "pleio_template_upload");

    elgg_register_page_handler("bulk_download", "pleio_template_bulk_download");

    elgg_register_page_handler("exporting", "pleio_template_export_handler");

    elgg_unregister_plugin_hook_handler("register", "user", "newsletter_register_user_handler");
    elgg_unregister_event_handler("create", "member_of_site", "newsletter_join_site_event_handler");

    elgg_unregister_plugin_hook_handler("entity:icon:url", "user", "profile_override_avatar_url");
    elgg_register_plugin_hook_handler("entity:icon:url", "user", "pleio_template_user_icon_url");

    elgg_unregister_plugin_hook_handler("route", "groups", "group_tools_route_groups_handler");

    elgg_register_plugin_hook_handler("cron", "hourly", "pleio_template_cron_notifications_handler");
    elgg_register_plugin_hook_handler("cron", "daily", "pleio_template_cron_email_overview_handler");
    elgg_register_plugin_hook_handler("cron", "weekly", "pleio_template_cron_email_overview_handler");
    elgg_register_plugin_hook_handler("cron", "monthly", "pleio_template_cron_email_overview_handler");

    elgg_unregister_plugin_hook_handler("email", "system", "html_email_handler_email_hook");
    elgg_register_plugin_hook_handler("email", "system", "pleio_template_email_handler");

    elgg_extend_view("css/admin", "pleio_template/css/admin");

    elgg_register_simplecache_view("css/web");

    elgg_register_admin_menu_item("administer", "notifications", "administer_utilities");
    elgg_register_admin_menu_item("administer", "all", "users");
    if (elgg_in_context("admin")) {
        elgg_register_plugin_hook_handler("register", "menu:entity", "pleio_template_user_setup_menu", 502);
    }

    if (!isset($_COOKIE["CSRF_TOKEN"])) {
        $token = md5(openssl_random_pseudo_bytes(32));
        $domain = ini_get("session.cookie_domain");
        setcookie("CSRF_TOKEN", $token, 0, "/", $domain);
    }
}

elgg_register_event_handler("init", "system", "pleio_template_init");

function pleio_template_index_handler($hook, $type, $return_value, $params) {
    if ($return_value) {
        return;
    }

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

function pleio_template_plugins_settings_save($hook, $type, $return_value, $params) {
    $site = elgg_get_site_entity();
    $plugin_id = get_input("plugin_id");

    if ($plugin_id !== "pleio_template") {
        return $return_value;
    }

    $name = get_input("filterName", []);
    $values = get_input("filterValues", []);
    $required = get_input("filterRequired", []);

    $menuTitle = get_input("menuTitle", []);
    $menuLink = get_input("menuLink", []);

    $profileKey = get_input("profileKey", []);
    $profileName = get_input("profileName", []);

    $menu = [];
    foreach ($menuLink as $i => $link) {
        $menu[] = [
            "title" => $menuTitle[$i],
            "link" => $menuLink[$i]
        ];
    }

    $profile = [];
    foreach ($profileKey as $i => $key) {
        if (in_array($profileKey[$i], ["guid", "type", "subtype", "owner_guid", "site_guid", "container_guid", "access_id", "time_created", "time_updated", "last_action", "enabled", "name", "username", "password", "salt", "password_hash", "email", "language", "code", "banned", "admin", "last_action", "prev_last_action", "last_login", "prev_last_login"])) {
            continue;
        }

        if (preg_match("/^a-z/", $profileKey[$i])) {
            continue;
        }

        $profile[] = [
            "key" => $profileKey[$i],
            "name" => $profileName[$i]
        ];
    }

    $filters = [];
    foreach ($name as $i => $name) {
        $filters[] = [
            "name" => $name,
            "required" => ($required[$i] === "yes") ? true : false,
            "values" => $values[$i]
        ];
    }

    $footerTitle = get_input("footerTitle", []);
    $footerLink = get_input("footerLink", []);

    $footer = [];
    foreach ($footerLink as $i => $link) {
        $footer[] = [
            "title" => $footerTitle[$i],
            "link" => $footerLink[$i]
        ];
    }

    $params = get_input("params");
    $params["menu"] = json_encode($menu);
    $params["profile"] = json_encode($profile);
    $params["filters"] = json_encode($filters);
    $params["footer"] = json_encode($footer);
    set_input("params", $params);

    $file = new \ElggFile();
    $file->owner_guid = $site->guid;
    $file->access_id = ACCESS_PUBLIC;
    $file->setFilename("pleio_template/{$site->guid}_logo.jpg");

    $logo = get_resized_image_from_uploaded_file("logo", 404, 231, false, true);
    $remove_logo = get_input("remove_logo");

    if ($logo) {
        $file->open("write");
        $file->write($logo);
        $file->close();

        $site->logotime = time();
        $site->save();
    } elseif ($remove_logo === "1") {
        $file->delete();

        unset($site->logotime);
        $site->save();
    }
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

function pleio_template_events_handler($page) {
    // rewrite some old event URL's
    switch ($page[0]) {
        case "event":
            forward("/events/view/{$page[2]}/{$page[3]}");
            return true;
        default:
            return pleio_template_page_handler($page);
    }
}

function pleio_template_page_handler($page) {
    set_input("page", $page);
    include("pages/react.php");
    return true;
}

function pleio_template_export_handler($page) {
    switch ($page[0]) {
        case "group":
            set_input("group_guid", $page[1]);
            include("pages/exporting/group.php");
            return true;
        case "event":
            set_input("event_guid", $page[1]);
            include("pages/exporting/event.php");
            return true;
        case "calendar":
            include("pages/exporting/calendar.php");
            return true;
        return true;
    }
}

function pleio_template_graphql($page) {
    include("pages/graphql.php");
    return true;
}

function pleio_template_bulk_download($page) {
    include("pages/bulk_download.php");
    return true;
}

function pleio_template_assets($path) {
    return "/mod/pleio_template/src/" . $path;
}

function webpack_dev_server_is_available() {
    global $CONFIG;

    if ($CONFIG->env == "prod") {
        return false;
    }

    $fp = @fsockopen("127.0.0.1", "9001", $errno, $errstr, 0.25);
    if (is_resource($fp)) {
        fclose($fp);
        return true;
    } else {
        return false;
    }
}

function pleio_template_get_object($guid) {
    $object = get_entity($guid);

    if (!$object) {
        return false;
    }

    if (!$object instanceof ElggObject) {
        return false;
    }

    if (!in_array($object->getSubtype(), ["blog", "question", "news"])) {
        return false;
    }

    return $object;
}

function pleio_template_cron_notifications_handler($hook, $period, $return, $params) {
    $ia = elgg_set_ignore_access(true);
    Pleio\NotificationsHandler::sendToAll();
    elgg_set_ignore_access($ia);
}

function pleio_template_cron_email_overview_handler($hook, $period, $return, $params) {
    $ia = elgg_set_ignore_access(true);
    Pleio\EmailOverviewHandler::sendToAll($period);
    elgg_set_ignore_access($ia);
}

function pleio_template_email_handler($hook, $type, $return, $params) {
    global $CONFIG;
    $site = elgg_get_site_entity();

    $message_id = sprintf("<%s.%s@%s>", base_convert(microtime(), 10, 36), base_convert(bin2hex(openssl_random_pseudo_bytes(8)), 16, 36), $_SERVER["SERVER_NAME"]);

    $reply_to = "=?UTF-8?B?" . base64_encode($site->name) . "?= ";

    if ($site->email) {
        $reply_to .= "<" . $site->email . ">";
    } elseif (isset($CONFIG->email_from)) {
        $reply_to .= "<{$CONFIG->email_from[1]}>";
    } else {
        $reply_to .= "<noreply@" . get_site_domain($site->guid) . ">";
    }

    $headers = "Sender: {$params["from"]}\r\n"
        . "From: {$params["from"]}\r\n"
        . "Reply-To: {$reply_to}\r\n"
        . "Message-Id: {$message_id}\r\n"
        . "MIME-Version: 1.0\r\n"
        . "Content-Type: text/html; charset=UTF-8\r\n";

    // Sanitise subject by stripping line endings
    $subject = preg_replace("/(\r\n|\r|\n)/", " ", $params["subject"]);

    $body = $params["body"];
    $body = nl2br($body);

    $email_params = [
        "subject" => $subject,
        "body" => $body
    ];

    if (!is_array($params["params"])) {
        $params["params"] = [];
    }

	if (!isset($CONFIG->block_mail)) {
        return mail(
            $params["to"],
            $subject,
            elgg_view("emails/default", array_merge($email_params, $params["params"])),
            $headers
        );
	} else {
		return true;
	}
}

function pleio_template_format_date($datetime, $type = "default") {
    switch ($type) {
        case "event":
            return strftime("%d %B %Y", $datetime);
        default:
            return strftime("%d-%m-%y", $datetime);
    }
}

function pleio_template_user_setup_menu($hook, $type, $items, $params) {
    $entity = elgg_extract("entity", $params);
    if (!$entity || !$entity instanceof ElggUser) {
        return $items;
    }

    foreach ($items as $key => $item) {
        if (in_array($item->getName(), ["add_friend"])) {
            unset($items[$key]);
        }
    }

    $items[] = ElggMenuItem::factory([
        "name" => "edit",
        "text" => elgg_echo("edit"),
        "href" => "/admin/users/edit?guid={$entity->guid}"
    ]);

    return $items;
}