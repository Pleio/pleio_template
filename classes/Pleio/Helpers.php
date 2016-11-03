<?php
namespace Pleio;

class Helpers {
    static function generateUsername($email) {
        list($username, $dummy) = explode("@", $email);
        $username = preg_replace("/[^a-zA-Z0-9]+/", "", $username);

        $hidden = access_get_show_hidden_status();
        access_show_hidden_entities(true);

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

    static function saveToIcon($filename, $owner) {
        $filename = str_replace(".", "_", $filename);
        $icon_sizes = elgg_get_config("icon_sizes");

        $files = array();
        foreach ($icon_sizes as $name => $size_info) {
            $resized = get_resized_image_from_uploaded_file($filename, $size_info["w"], $size_info["h"], $size_info["square"], true);

            if ($resized) {
                $file = new \ElggFile();
                $file->owner_guid = $owner->guid;
                $file->setFilename("profile/{$owner->guid}{$name}.jpg");
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

    static function saveToFeatured($filename, $owner) {
        $filename = str_replace(".", "_", $filename);

        $resized = get_resized_image_from_uploaded_file($filename, 1400, 396, false, true);
        if ($resized) {
            $file = new \ElggFile();
            $file->owner_guid = $owner->guid;
            $file->setFilename("featured/{$owner->guid}.jpg");
            $file->open("write");
            $file->write($resized);
            $file->close();
        }
    }

    static function saveToImage($filename, $owner) {
        $filename = str_replace(".", "_", $filename);
        $time = time();

        $resized = get_resized_image_from_uploaded_file($filename, 1200, 1200, false, true);
        if ($resized) {
            $file = new \ElggFile();
            $file->owner_guid = $owner->guid;
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
        $type = sanitise_string($entity->type);
        $subtype = (int) $entity->subtype;

        insert_data("
            INSERT INTO elgg_entity_views (guid, type, subtype, container_guid, site_guid, views)
            VALUES ({$guid}, '{$type}', {$subtype}, {$entity->container_guid}, {$entity->site_guid}, 1)
            ON DUPLICATE KEY UPDATE views = views + 1;
        ");

        if (is_memcache_available()) {
            $cache = new \ElggMemcache('entity_view_counter');
            $key = "view_" . session_id() . "_" . $entity->guid;
            $cache->save($key, 1);
        }
    }

    static function getEntitiesFromTags($subtype, $tags, $offset = 0, $limit = 20) {
        global $CONFIG;

        $bools = [
            ["term" => [ "type" => "object" ]],
            ["term" => [ "subtype" => get_subtype_id("object", $subtype) ]],
            ["term" => [ "site_guid" => $CONFIG->site_guid ]]
        ];

        $user = elgg_get_logged_in_user_guid();

        $ignore_access = elgg_check_access_overrides($user);
        if ($ignore_access != true && !elgg_is_admin_logged_in()) {
            $bools[] = ["terms" => [ "access_id" => get_access_array() ]];
        }

        if ($tags && is_array($tags) && count($tags) > 0) {
            $bools[] = ["terms" => [ "tags" => $tags ]];
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
}