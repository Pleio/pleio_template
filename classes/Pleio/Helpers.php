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

    static function countAnnotations(ElggUser $owner, $name, $value = null) {
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

    static function sendPasswordChangeMessage(ElggUser $user) {
        $site = elgg_get_site_entity();
        $subject = elgg_echo("security_tools:notify_user:password:subject");
        $message = elgg_echo("security_tools:notify_user:password:message", array(
            $user->name,
            $site->name,
            $site->url
        ));

        notify_user($user->guid, $site->guid, $subject, $message, null, "email");
    }
}