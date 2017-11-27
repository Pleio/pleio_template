<?php
namespace Pleio;

class Helpers {
    static function generateUsername($email) {
        list($username, $dummy) = explode("@", $email);
        $username = preg_replace("/[^a-zA-Z0-9]+/", "", $username);

        $hidden = access_get_show_hidden_status();
        access_show_hidden_entities(true);

        while (strlen($username) < 4) {
            $username .= "0";
        }

        if (get_user_by_username($username)) {
            $i = 1;

            while (get_user_by_username($username . $i)) {
                $i++;
            }

            $result = $username . $i;
        } else {
            $result = $username . $i;
        }

        access_show_hidden_entities($hidden);

        return $result;
    }

    static function getUsernameByInput($username) {
        if (strpos($username, "@") !== false && ($users = get_user_by_email($username))) {
            $username = $users[0]->username;
        } else {
            $username = $username;
        }

        return $username;
    }

    static function getFeaturedEntity($options, $tags = []) {
        $tags = Helpers::renderTags($tags);

        $entities = elgg_get_entities_from_metadata(array_merge($options, [
            "metadata_name_value_pairs" => [
                "name" => "isFeatured",
                "value" => "1"
            ],
            "limit" => 1
        ]));

        if (!$entities) {
            return null;
        }

        if ($entities) {
            $entity = $entities[0];
        }

        if (!$tags || count($tags) === 0) {
            return $entity;
        }

        $entityTags = Helpers::renderTags($entity->tags);
        if (count(array_intersect($entityTags, $tags)) > 0) {
            return $entity;
        }
        
        return null;
    }

    static function renderTags($tags) {
        if ($tags) {
            if (!is_array($tags)) {
                return [$tags];
            } else {
                return $tags;
            }
        } else {
            return [];
        }
    }

    static function getURL($entity) {
        switch ($entity->type) {
            case "group":
                $friendlytitle = elgg_get_friendly_title($entity->name);
                return "/groups/view/{$entity->guid}/{$friendlytitle}";
            case "user":
                return "/profile/{$entity->username}";
            case "object":
                $friendlytitle = elgg_get_friendly_title($entity->title);

                $container = $entity->getContainerEntity();
                if ($container instanceof \ElggGroup) {
                    $container_friendlytitle = elgg_get_friendly_title($container->name);
                    $root = "/groups/view/{$container->guid}/{$container_friendlytitle}/";
                } else {
                    $root = "/";
                }

                switch ($entity->getSubtype()) {
                    case "news":
                        $root .= "news";
                        break;
                    case "question":
                        $root .= "questions";
                        break;
                    case "groupforumtopic":
                        $root .= "questions";
                        break;
                    case "blog":
                        $root .= "blog";
                        break;
                    case "page":
                        $root .= "cms";
                        break;
                    case "event":
                        $root .= "events";
                        break;
                    default:
                        $root .= $entity->getSubtype();
                }

                return "{$root}/view/{$entity->guid}/$friendlytitle";
        }
    }

    static function saveToIcon($filename, $entity) {
        $filename = str_replace(".", "_", $filename);
        $icon_sizes = elgg_get_config("icon_sizes");

        $class = get_class($entity);
        switch($class) {
            case "ElggGroup":
                $owner_guid = $entity->owner_guid;
                $target_filename = "groups/{$entity->guid}";
                break;
            case "ElggUser":                
                $owner_guid = $entity->guid;
                $target_filename = "profile/{$entity->guid}";
                break;
            default:
                throw new Exception("Could not save an icon for this type of entity.");
        }

        $files = array();
        foreach ($icon_sizes as $name => $size_info) {
            $resized = get_resized_image_from_uploaded_file($filename, $size_info["w"], $size_info["h"], $size_info["square"], true);

            if ($resized) {
                $file = new \ElggFile();
                $file->owner_guid = $owner_guid;
                $file->access_id = get_default_access();
                $file->setFilename("{$target_filename}{$name}.jpg");
                $file->open("write");
                $file->write($resized);
                $file->close();

                $files[] = $file;
            } else {
                // cleanup on fail
                foreach ($files as $file) {
                    $file->delete();
                }
            }
        }
    }

    static function getFile($filename) {
        $filename = str_replace(".", "_", $filename);

        if (empty($_FILES[$filename])) {
            return null;
        }

        return $_FILES[$filename];
    }

    static function saveToFeatured($filename, $owner) {
        $filename = str_replace(".", "_", $filename);

        $resized = get_resized_image_from_uploaded_file($filename, 1400, 2000, false, false);
        if ($resized) {
            $file = new \ElggFile();
            $file->owner_guid = $owner->guid;
            $file->access_id = get_default_access();
            $file->setFilename("featured/{$owner->guid}.jpg");
            $file->open("write");
            $file->write($resized);
            $file->close();
        }
    }

    static function saveToImage($filename, $owner) {
        $filename = str_replace(".", "_", $filename);
        $time = time();

        $resized = get_resized_image_from_uploaded_file($filename, 1200, 1200, false, false);
        if ($resized) {
            $file = new \ElggFile();
            $file->owner_guid = $owner->guid;
            $file->access_id = get_default_access();
            $file->setFilename("image/{$time}.jpg");
            $file->open("write");
            $file->write($resized);
            $file->close();

            $file->save();
            return $file;
        }
    }

    static function stringsToMetastrings($input) {
        $metastrings = [];

        if (!is_array($metastrings)) {
            return $metastrings;
        }

        foreach ($input as $tag) {
            $id = get_metastring_id($tag);
            if ($id) {
                $metastrings[] = $id;
            }
        }

        return $metastrings;
    }

    static function countAnnotations(\ElggUser $owner, $name, $value = null) {
        $options = array(
            "annotation_name" => $name,
            "annotation_owner_guid" => $owner->guid,
            "count" => true
        );

        if ($value) {
            $options["annnotation_value"] = $value;
        }

        return elgg_get_annotations($options);
    }

    static function sendPasswordChangeMessage(\ElggUser $user) {
        $site = elgg_get_site_entity();
        $subject = elgg_echo("security_tools:notify_user:password:subject");
        $message = elgg_echo("security_tools:notify_user:password:message", array(
            $user->name,
            $site->name,
            $site->url
        ));

        notify_user($user->guid, $site->guid, $subject, $message, null, "email");
    }

    static function addView(\ElggEntity $entity) {
        if (isset($_SERVER["HTTP_USER_AGENT"]) && preg_match('/bot|crawl|slurp|spider/i', $_SERVER["HTTP_USER_AGENT"])) {
            return true;
        }

        $user = elgg_get_logged_in_user_entity();
        if ($user && $user->guid == $entity->guid) {
            return true;
        }

        if (is_memcache_available()) {
            $cache = new \ElggMemcache('entity_view_counter');
            $key = "view_" . session_id() . "_" . $entity->guid;
            if ($cache->load($key)) {
                    return true;
            }
        }

        $guid = (int) $entity->guid;
        $user_guid = (int) elgg_get_logged_in_user_guid();
        $type = sanitise_string($entity->type);
        $subtype = (int) $entity->subtype;

        insert_data("
            INSERT INTO elgg_entity_views (guid, type, subtype, container_guid, site_guid, views)
            VALUES ({$guid}, '{$type}', {$subtype}, {$entity->container_guid}, {$entity->site_guid}, 1)
            ON DUPLICATE KEY UPDATE views = views + 1;
        ");

        /*insert_data("
            INSERT INTO elgg_entity_views_log (entity_guid, type, subtype, container_guid, site_guid, performed_by_guid, time_created)
            VALUES ({$guid}, '${type}', {$subtype}, {$entity->container_guid}, {$entity->site_guid}, {$user_guid}, NOW());
        ");*/

        if (is_memcache_available()) {
            $cache = new \ElggMemcache('entity_view_counter');
            $key = "view_" . session_id() . "_" . $entity->guid;
            $cache->save($key, 1);
        }
    }

    static function getEntitiesFromTags($subtypes, $tags, $offset = 0, $limit = 20) {
        global $CONFIG;

        $bools = [
            ["term" => [ "type" => "object" ]],
            ["term" => [ "site_guid" => $CONFIG->site_guid ]]
        ];

        if ($subtypes) {
            if (is_array($subtypes)) {
                $get_subtype_id = function($subtype) { return get_subtype_id("object", $subtype); };
                $bools[] = ["terms" => [ "subtype" => array_map($get_subtype_id, $subtypes)]];
            } else {
                $bools[] = ["term" => [ "subtype" => get_subtype_id("object", $subtypes) ]];
            }
        }

        $user = elgg_get_logged_in_user_guid();

        $ignore_access = elgg_check_access_overrides($user);
        if ($ignore_access != true && !elgg_is_admin_logged_in()) {
            $bools[] = ["terms" => [ "access_id" => get_access_array() ]];
        }

        if ($tags && is_array($tags) && count($tags) > 0) {
            $bools[] = ["terms" => [ "tags" => array_map("strtolower", $tags) ]];
        }

        $results = \ESInterface::get()->client->search([
            "index" => $CONFIG->elasticsearch_index,
            "body" => [
                "query" => [
                    "bool" => [
                        "must" => $bools
                    ]
                ],
                "from" => (int) $offset,
                "size" => (int) $limit,
                "sort" => [
                    "time_created" => "desc"
                ]
            ]
        ]);

        $total = $results['hits']['total'];

        $entities = [];

        foreach ($results["hits"]["hits"] as $hit) {
            $entity = get_entity($hit["_id"]);
            if ($entity) {
                $entities[] = get_entity($hit["_id"]);
            }
        }

        return [
            "total" => $total,
            "entities" => $entities
        ];
    }

    static function isUser() {
        $user = elgg_get_logged_in_user_entity();
        if (!$user) {
            return false;
        }

        $site = elgg_get_site_entity();
        // method exposed in subsite_manager
        if (method_exists($site, "isUser")) {
            return $site->isUser();
        }

        $result = check_entity_relationship($user->guid, "member_of_site", $site->guid);

        if ($result) {
            return true;
        }

        return false;
    }

    static function canJoin() {
        // method exposed in subsite_manager
        if (method_exists($site, "canJoin")) {
            return $site->canJoin();
        }

        return elgg_get_config("allow_registration");
    }

    static function addUser() {
        $user_guid = elgg_get_logged_in_user_guid();
        if ($user_guid) {
            $site = elgg_get_site_entity();
            return $site->addUser($user_guid);
        }

        return false;
    }

    static function getGroupMembership(\ElggGroup $group) {
        $user = elgg_get_logged_in_user_entity();

        if ($group->isMember()) {
            return "joined";
        }

        $request = check_entity_relationship($user->guid, "membership_request", $group->guid);
        if ($request) {
            return "requested";
        }

        $invite = check_entity_relationship($user->guid, "invited", $group->guid);
        if ($invite) {
            return "invited";
        }

        return "not_joined";
    }

    static function getGroupIntroduction(\ElggGroup $group) {
        if ($group->isMember() || $group->canEdit()) {
            return $group->introduction;
        }

        return "";
    }

    static function sendGroupMembershipRequestNotification(\ElggGroup $group, \ElggUser $user) {
        global $CONFIG;

        $url = "{$CONFIG->url}groups/requests/$group->guid";
        $subject = elgg_echo('groups:request:subject', array(
            $user->name,
            $group->name,
        ));

        $body = elgg_echo('groups:request:body', array(
            $group->getOwnerEntity()->name,
            $user->name,
            $group->name,
            $user->getURL(),
            $url,
        ));
        
        return notify_user($group->owner_guid, $user->guid, $subject, $body);
    }

    static function getFolderContents($folder, $limit = 100, $offset = 0, $order_by = "filename", $direction = "asc", $filter = "all") {
        if ($folder) {
            $totalFolders = Helpers::getFolders($folder, $limit, $offset, true);
            $folders = Helpers::getFolders($folder, $limit, $offset, false, $order_by, $direction);
        } else {
            // when we are on site-level, we only have files.
            $totalFolders = 0;
            $folders = array();
        }

        $totalFiles = Helpers::getFiles($folder, 1, 0, true);

        if ($limit == 0) {
            $files = Helpers::getFiles($folder, 0, max(0, $offset-$totalFolders), false, $order_by, $direction);
        } elseif ($limit > count($folders)) {
            $files = Helpers::getFiles($folder, $limit-count($folders), max(0, $offset-$totalFolders), false, $order_by, $direction);
        } else {
            $files = array();
        }

        switch ($filter) {
            case "files":
                return array($totalFiles, $files);
            case "folders":
                return array($totalFolders, $folders);
            case "all":
            default:
                return array($totalFolders + $totalFiles, array_merge($folders, $files));
        }


    }

    static function getFolders($parent, $limit = 100, $offset = 0, $count = false, $order_by = "filename", $direction = "ASC") {
        $dbprefix = elgg_get_config("dbprefix");

        $options = array(
            'type' => 'object',
            'subtype' => 'folder',
            'limit' => $limit,
            'offset' => $offset
        );

        if (!$count) {
            switch ($order_by) {
                case "timeCreated":
                    $options['order_by'] = 'e.time_created';
                    break;
                case "owner":
                    $options['joins'] = "JOIN {$dbprefix}users_entity ue ON e.owner_guid = ue.guid";
                    $options['order_by'] = 'ue.name';
                    break;
                default:
                    $options['joins'] = "JOIN {$dbprefix}objects_entity oe ON e.guid = oe.guid";
                    $options['order_by'] = 'oe.title';
            }

            switch ($direction) {
                case "desc":
                    $options['order_by'] .= ' DESC';
                    break;
                case "asc":
                    $options['order_by'] .= ' ASC';
                    break;
            }
        } else {
            $options['count'] = true;
        }

        if ($parent) {
            if ($parent instanceof \ElggUser | $parent instanceof \ElggGroup) {
                $options['container_guid'] = $parent->guid;
                $options['metadata_name_value_pairs'] = array(array(
                    'name' => 'parent_guid',
                    'value' => 0
                ));
            } else {
                $options['container_guid'] = $parent->container_guid;
                $options['metadata_name_value_pairs'] = array(array(
                    'name' => 'parent_guid',
                    'value' => $parent->guid
                ));
            }

            return elgg_get_entities_from_metadata($options);
        } else {
            if (!$count) {
                return array();
            } else {
                return 0;
            }
        }
    }

    static function getFiles($parent, $limit = 100, $offset = 0, $count = false, $order_by = "filename", $direction = "asc") {
        $dbprefix = elgg_get_config("dbprefix");

        $options = array(
            'type' => 'object',
            'subtype' => 'file',
            'limit' => $limit,
            'offset' => $offset
        );

        if (!$count) {
            switch ($order_by) {
                case "timeCreated":
                    $options['order_by'] = 'e.time_created';
                    break;
                case "owner":
                    $options['joins'] = "JOIN {$dbprefix}users_entity ue ON e.owner_guid = ue.guid";
                    $options['order_by'] = 'ue.name';
                    break;
                default:
                    $options['joins'] = "JOIN {$dbprefix}objects_entity oe ON e.guid = oe.guid";
                    $options['order_by'] = 'oe.title';
            }

            switch ($direction) {
                case "desc":
                    $options['order_by'] .= ' DESC';
                    break;
                case "asc":
                    $options['order_by'] .= ' ASC';
                    break;
            }
        } else {
            $options['count'] = true;
        }

        if ($parent) {
            if ($parent instanceof \ElggUser | $parent instanceof \ElggGroup) {
                $options['container_guid'] = $parent->guid;
                $options['wheres'] = "NOT EXISTS (
                        SELECT 1 FROM {$dbprefix}entity_relationships r
                        WHERE r.guid_two = e.guid AND
                        r.relationship = 'folder_of')";
            } else {
                $options['container_guid'] = $parent->container_guid;
                $options['relationship'] = "folder_of";
                $options['relationship_guid'] = $parent->guid;
            }
        }

        return elgg_get_entities_from_relationship($options);
    }

    static function generateThumbs($file) {
		$formats = array(
			"thumbnail" => 60,
			"smallthumb" => 153,
			"largethumb" => 600
		);

		$file->icontime = time();
        $filestorename = $file->getFilename();
        $filestorename = elgg_substr($filestorename, elgg_strlen("file/"));

		foreach ($formats as $name => $size) {
	        $thumbnail = get_resized_image_from_existing_file($file->getFilenameOnFilestore(), $size, $size, true);

	        if ($thumbnail) {
	        	$filename = "file/{$name}" . $filestorename;
	            $thumb = new \ElggFile();
	            $thumb->setFilename($filename);
	            $thumb->open("write");
	            $thumb->write($thumbnail);
	            $thumb->close();

	            $file->$name = $filename;
	            unset($thumbnail);
	        }
		}
    }

    static function getBreadcrumb($folder) {
        $path = array();

        if ($folder instanceof \ElggUser | $folder instanceof \ElggGroup) {
            return $path;
        }

        $path[] = $folder;

        $parent = get_entity($folder->parent_guid);
        while ($parent) {
            $path[] = $parent;
            $parent = get_entity($parent->parent_guid);
        }

        return array_reverse($path);
    }

    static function getSettings() {
        $site = elgg_get_site_entity();

        return [
            "odtEnabled" => elgg_is_active_plugin("odt_editor") ? true : false,
            "externalLogin" => elgg_is_active_plugin("pleio") ? true : false,
            "advancedPermissions" => elgg_get_plugin_setting("advanced_permissions", "pleio_template") === "yes" ? true : false,
            "site" => [
                "guid" => $site->guid,
                "name" => $site->name,
                "accessIds" => Resolver::getAccessIds(["guid" => $site->guid]),
                "defaultAccessId" => Resolver::getDefaultAccessId(["guid" => $site->guid]),
                "startPage" => elgg_get_plugin_setting("startpage", "pleio_template") ?: "activity",
                "startPageCms" => elgg_get_plugin_setting("startpage_cms", "pleio_template")
            ]
        ];
    }

    static function getEventStartDate($entity) {
        $start_day = $entity->start_day;
        $start_time = $entity->start_time;

        if (!$start_day) {
            return null;
        }

        $date = mktime(
            date("H", $start_time),
            date("i", $start_time),
            date("s", $start_time),
            date("n", $start_day),
            date("j", $start_day),
            date("Y", $start_day)
        );

        return date("c", $date);
    }

    static function getEventEndDate($entity) {
        if (!$entity->end_ts) {
            return null;
        }

        return date("c", $entity->end_ts);
    }
}