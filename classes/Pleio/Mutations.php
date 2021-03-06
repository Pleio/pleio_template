<?php
namespace Pleio;

class Mutations {
    static function login($input) {
        $username = Helpers::getUsernameByInput($input["username"]);

        if (elgg_authenticate($username, $input['password']) !== true) {
            throw new Exception("could_not_login");
        }

        $user = get_user_by_username($username);
        if (!$user) {
            throw new Exception("could_not_login");
        }

        if ($input['rememberMe']) {
            $rememberMe = true;
        } else {
            $rememberMe = false;
        }

        try {
            login($user, $rememberMe);
            unset($_SESSION['last_forward_from']);
        } catch (\LoginException $e) {
            register_error($e->getMessage());
        }
    }

    static function logout($input) {
        $result = logout();
        if (!$result) {
            throw new Exception("could_not_logout");
        }
    }

    static function register($input) {
        $email = $input['email'];
        $password = $input['password'];
        $name = $input['name'];
        $newsletter = $input['newsletter'];
        $terms = $input['terms'];
        $tags = $input['tags'];

        $ia = access_show_hidden_entities(true);
        $user = get_user_by_email($email);
        access_show_hidden_entities($ia);

        if ($user) {
            throw new Exception("already_registered");
        }

        $username = Helpers::generateUsername($email);
        $guid = register_user($username, $password, $name, $email, false);
        if ($guid) {
            $new_user = get_entity($guid);
            $site = elgg_get_site_entity();

            $ia = elgg_set_ignore_access(true);

            if ($tags) {
                $new_user->tags = filter_tags($tags);
            }

            if ($newsletter) {
                add_entity_relationship($guid, "subscribed", $site->guid);
            }

            if ($terms) {
                $new_user->setPrivateSetting("general_terms_accepted", time());
            }

            elgg_set_ignore_access($ia);

            $params = array(
                'user' => $new_user,
                'password' => $password
            );

            // @todo should registration be allowed no matter what the plugins return?
            if (!elgg_trigger_plugin_hook('register', 'user', $params, TRUE)) {
                $ia = elgg_set_ignore_access(true);
                $new_user->delete();
                elgg_set_ignore_access($ia);
                // @todo this is a generic messages. We could have plugins
                // throw a RegistrationException, but that is very odd
                // for the plugin hooks system.
                throw new \RegistrationException(elgg_echo('registerbad'));
            }

        } else {
            throw new Exception("could_not_register");
        }
    }

    static function forgotPassword($input) {
        $username = Helpers::getUsernameByInput($input["username"]);
        $user = get_user_by_username($username);

        if ($user) {
            $result = send_new_password_request($user->guid);
            if (!$result) {
                throw new Exception("unknown_error");
            }
        } else {
            // on purpose, do not give any feedback when user is not found
        }

        return [
            "status" => 200
        ];
    }

    static function forgotPasswordConfirm($input) {
        $userGuid = (int) $input["userGuid"];
        $code = (int) $input["code"];

        if (!execute_new_password_request($userGuid, $code)) {
            throw new Exception("unknown_error");
        }

        return [
            "status" => 200
        ];
    }

    static function subscribeNewsletter($input) {
        $email = $input['email'];
        $site = elgg_get_site_entity();

        $result = newsletter_subscribe_email($email, $site);
        if (!$result) {
            throw new Exception("could_not_register");
        }
    }

    static function addEntity($input) {
        if (!elgg_is_logged_in()) {
            throw new Exception("not_logged_in");
        }

        $site = elgg_get_site_entity();
        if (!Helpers::isUser()) {
            if (Helpers::canJoin()) {
                Helpers::addUser();
            } else {
                throw new Exception("not_member_of_site");
            }
        }

        if (!in_array($input["type"], array("object"))) {
            throw new Exception("invalid_type");
        }

        switch ($input["type"]) {
            case "object":
                if (!in_array($input["subtype"], array("file", "folder", "news", "blog", "question", "discussion", "comment","page", "wiki", "event", "task", "thewire"))) {
                    throw new Exception("invalid_subtype");
                }

                $entity = new \ElggObject();
                $entity->title = $input["title"];
                $entity->subtype = $input["subtype"];
            default:
                $entity->description = $input["description"];

                if ($input["richDescription"]) {
                    $entity->richDescription = $input["richDescription"];
                }

                if ((int) $input["containerGuid"]) {
                    $container = get_entity((int) $input["containerGuid"]);
                    if ($container instanceof \ElggGroup && $container->membership === ACCESS_PRIVATE && $container->group_acl) {
                        $defaultAccessId = $container->group_acl;
                    } elseif ($input["subtype"] === "comment") {
                        $defaultAccessId = $container->access_id;
                    } else {
                        $defaultAccessId = get_default_access();
                    }
                } else {
                    $defaultAccessId = get_default_access();
                }

                if (isset($input["accessId"])) {
                    $entity->access_id = (int) $input["accessId"];
                } else {
                    $entity->access_id = $defaultAccessId;
                }

                if (isset($input["writeAccessId"])) {
                    $entity->write_access_id = (int) $input["writeAccessId"];
                } else {
                    $entity->write_access_id = ACCESS_PRIVATE;
                }

                $entity->tags = filter_tags($input["tags"]);

                if (elgg_is_admin_logged_in()) {
                    if (isset($input["isRecommended"])) {
                        $entity->isRecommended = $input["isRecommended"];
                    }
                }

                if ($container) {
                    if ($input["subtype"] == "folder") {
                        if ($container instanceof \ElggGroup || $container instanceof \ElggUser) {
                            $entity->container_guid = $container->guid;
                            $entity->parent_guid = 0;
                        } else {
                            $entity->container_guid = $container->container_guid;
                            $entity->parent_guid = $container->guid;
                        }
                    } else {
                        $entity->container_guid = $container->guid;
                    }
                }
        }

        $result = $entity->save();

        if (!$result) {
            throw new Exception("could_not_save");
        }

        if (in_array($input["subtype"], ["news", "blog", "page", "event"])) {
            if (isset($input["isFeatured"])) {
                $entity->isFeatured = $input["isFeatured"];
            }

            if ($input["featured"]) {
                if ($input["featured"]["image"]) {
                    if ($input["featured"]["image"] === "false") {
                        unset($entity->featuredIcontime);
                    } else {
                        Helpers::saveToFeatured($input["featured"]["image"], $entity);
                        $entity->featuredIcontime = time();
                    }
                }

                if ($input["featured"]["video"]) {
                    $entity->featuredVideo = $input["featured"]["video"];
                } else {
                    unset($entity->featuredVideo);
                }

                if ($input["featured"]["positionY"]) {
                    $entity->featuredPositionY = $input["featured"]["positionY"];
                } else {
                    unset($entity->featuredPositionY);
                }
            }

            if ($input["source"]) {
                $entity->source = $input["source"];
            }

            $result = $entity->save();
        }

        if ($input["subtype"] === "event") {
            $startDate = strtotime($input["startDate"]);
            $endDate = strtotime($input["endDate"]);

            $entity->start_day = $startDate;
            $entity->start_time = $startDate;
            $entity->end_ts = $endDate;

            if ($input["location"]) {
                $entity->location = $input["location"];
            }

            if (isset($input["rsvp"])) {
                $entity->rsvp = $input["rsvp"];
            }

            $result = $entity->save();
        }

        $user = elgg_get_logged_in_user_entity();
        add_entity_relationship($user->guid, "content_subscription", $entity->guid);

        $view = "river/object/{$input["subtype"]}/create";
        add_to_river($view, 'create', elgg_get_logged_in_user_guid(), $entity->guid);

        return [
            "guid" => $entity->guid
        ];

    }

    static function editEntity($input) {
        $entity = get_entity((int) $input["guid"]);
        if (!$entity) {
            throw new Exception("could_not_find");
        }

        if (!$entity->canEdit()) {
            throw new Exception("could_not_save");
        }

        if (!in_array($entity->type, array("group", "object"))) {
            throw new Exception("invalid_object_type");
        }

        switch ($entity->type) {
            case "group":
                $entity->name = $input["name"];
            case "object":
                $entity->title = $input["title"];
            default:
                $entity->description = $input["description"];

                if ($input["richDescription"]) {
                    $entity->richDescription = $input["richDescription"];
                }

                if (isset($input["accessId"])) {
                    $entity->access_id = (int) $input["accessId"];
                }

                if (isset($input["writeAccessId"])) {
                    $entity->write_access_id = (int) $input["writeAccessId"];
                }

                if (elgg_is_admin_logged_in()) {
                    if (isset($input["isRecommended"])) {
                        if ($input["isRecommended"]) {
                            $entity->isRecommended = $input["isRecommended"];
                        } else {
                            unset($entity->isRecommended);
                        }
                    }
                }

                $entity->tags = filter_tags($input["tags"]);
        }

        $result = $entity->save();

        if (in_array($entity->getSubtype(), ["news", "blog", "page", "event"])) {
            if (isset($input["isFeatured"])) {
                $entity->isFeatured = $input["isFeatured"];
            }

            if ($input["featured"]) {
                if ($input["featured"]["image"]) {
                    if ($input["featured"]["image"] === "false") {
                        unset($entity->featuredIcontime);
                    } else {
                        Helpers::saveToFeatured($input["featured"]["image"], $entity);
                        $entity->featuredIcontime = time();
                    }
                }

                if ($input["featured"]["video"]) {
                    $entity->featuredVideo = $input["featured"]["video"];
                } else {
                    unset($entity->featuredVideo);
                }

                if ($input["featured"]["positionY"]) {
                    $entity->featuredPositionY = $input["featured"]["positionY"];
                } else {
                    unset($entity->featuredPositionY);
                }
            } else {
                unset($entity->featuredIcontime);
                unset($entity->featuredVideo);
                unset($entity->featuredPositionY);
            }

            if ($input["source"]) {
                $entity->source = $input["source"];
            }

            $result &= $entity->save();
        }

        if ($entity->getSubtype() === "event") {
            $startDate = strtotime($input["startDate"]);
            $endDate = strtotime($input["endDate"]);
            $entity->start_day = $startDate;
            $entity->start_time = $startDate;
            $entity->end_ts = $endDate;

            if ($input["location"]) {
                $entity->location = $input["location"];
            }

            if (isset($input["rsvp"])) {
                $entity->rsvp = $input["rsvp"];
            }

            $result &= $entity->save();
        }

        if ($result) {
            return [
                "guid" => $entity->guid
            ];
        }

        throw new Exception("could_not_save");
    }

    static function deleteEntity($input) {
        $entity = get_entity((int) $input["guid"]);
        if (!$entity) {
            throw new Exception("could_not_find");
        }

        if (!in_array($entity->type, array("group", "object"))) {
            throw new Exception("invalid_object_type");
        }

        $result = $entity->delete();
        if ($result) {
            return [
                "guid" => $input["guid"]
            ];
        }

        throw new Exception("could_not_delete");
    }

    static function addFile($input) {
        $site = elgg_get_site_entity();
        if (!Helpers::isUser()) {
            if (Helpers::canJoin()) {
                Helpers::addUser();
            } else {
                throw new Exception("not_member_of_site");
            }
        }

        $file = Helpers::getFile($input["file"]);
        if (!$file) {
            throw new Exception("no_file");
        }

        if ($file["size"] === 0) {
            throw new Exception("invalid_filesize");
        }

        $entity = new \FilePluginFile();
        $entity->title = $file["name"];

        if (isset($input["accessId"])) {
            $entity->access_id = $input["accessId"];
        } else {
            $entity->access_id = get_default_access();
        }

        if (isset($input["writeAccessId"])) {
            $entity->write_access_id = $input["writeAccessId"];
        } else {
            $entity->write_access_id = ACCESS_PRIVATE;
        }

        if ($input["containerGuid"]) {
            $container = get_entity($input["containerGuid"]);
        }

        if ($container) {
            if ($container instanceof \ElggObject) {
                $entity->container_guid = $container->container_guid;
            } else {
                $entity->container_guid = $container->guid;
            }
        }

        $filestorename = elgg_strtolower(time() . basename($file["name"]));
        $entity->setFilename("file/" . $filestorename);
        $entity->originalfilename = $file["name"];

        $entity->open("write");
        $entity->close();

        move_uploaded_file($file["tmp_name"], $entity->getFilenameOnFilestore());

        $mime_type = \ElggFile::detectMimeType($entity->getFilenameOnFilestore(), $file["type"]);

        $entity->setMimeType($mime_type);
        $entity->simpletype = file_get_simple_type($mime_type);

        $result = $entity->save();

        if ($entity->simpletype == "image") {
            Helpers::generateThumbs($entity);
            $entity->icontime = time();
            $entity->save();
        }

        if ($container instanceof \ElggObject) {
            add_entity_relationship($container->guid, "folder_of", $entity->guid);
        }

        if ($result) {
            return [
                "guid" => $entity->guid
            ];
        }

        throw new Exception("could_not_save");
    }

    static function editFileFolder($input) {
        $entity = get_entity((int) $input["guid"]);
        if (!$entity) {
            throw new Exception("could_not_find");
        }

        if (!$entity->canEdit()) {
            throw new Exception("could_not_save");
        }

        if (!in_array($entity->getSubtype(), array("file", "folder"))) {
            throw new Exception("invalid_object_subtype");
        }

        if ($input["title"]) {
            $entity->title = $input["title"];
        }

        if (isset($input["accessId"])) {
            $entity->access_id = $input["accessId"];
        } else {
            $entity->access_id = get_default_access();
        }

        if (isset($input["writeAccessId"])) {
            $entity->write_access_id = $input["writeAccessId"];
        } else {
            $entity->write_access_id = ACCESS_PRIVATE;
        }

        if ($entity->getSubtype() === "file" && $input["file"]) {
            $file = Helpers::getFile($input["file"]);
            move_uploaded_file($file["tmp_name"], $entity->getFilenameOnFilestore());
            $entity->originalfilename = $file["name"];
            $mime_type = \ElggFile::detectMimeType($entity->getFilenameOnFilestore(), $file["type"]);
            $entity->setMimeType($mime_type);
            $entity->simpletype = file_get_simple_type($mime_type);
        }

        $result = $entity->save();

        if ($result) {
            return [
                "guid" => $entity->guid
            ];
        }

        throw new Exception("could_not_save");
    }

    static function moveFileFolder($input) {
        $entity = get_entity((int) $input["guid"]);
        if (!$entity) {
            throw new Exception("could_not_find");
        }

        if (!$entity->canEdit()) {
            throw new Exception("could_not_save");
        }

        if (!in_array($entity->getSubtype(), array("file", "folder"))) {
            throw new Exception("invalid_object_subtype");
        }

        $container = get_entity((int) $input["containerGuid"]);
        if (!$container && ($entity->container_guid !== $container->guid && $entity->container_guid !== $container->container_guid)) {
            throw new Exception("invalid_new_container");
        }

        if (!$container instanceof \ElggGroup && $container->getSubtype() !== "folder") {
            throw new Exception("invalid_new_container");
        }

        switch ($entity->getSubtype()) {
            case "file":
                remove_entity_relationships($entity->guid, "folder_of", true);

                if ($entity->container_guid != $container->guid) { // not in root directory
                    add_entity_relationship($container->guid, "folder_of", $entity->guid);
                }
                break;
            case "folder":
                if ($entity->container_guid != $container->guid) { // in root directory
                    $entity->parent_guid = $container->guid;
                } else {
                    $entity->parent_guid = 0;
                }

                $entity->save();
                break;
        }
    }

    static function bookmark($input) {
        $entity = get_entity((int) $input["guid"]);
        if (!$entity) {
            throw new Exception("could_not_find");
        }

        $user = elgg_get_logged_in_user_entity();
        if (!$user) {
            throw new Exception("not_logged_in");
        }

        if ($input["isAdding"]) {
            $result = add_entity_relationship($user->guid, "bookmarked", $entity->guid);
        } else {
            $result = remove_entity_relationship($user->guid, "bookmarked", $entity->guid);
        }

        if ($result) {
            return [
                "guid" => $entity->guid
            ];
        }

        throw new Exception("could_not_save");
    }

    static function vote($input) {
        $entity = get_entity((int) $input["guid"]);
        $score = (int) $input["score"];

        if (!$entity) {
            throw new Exception("could_not_find");
        }

        $user = elgg_get_logged_in_user_entity();
        if (!$user) {
            throw new Exception("not_logged_in");
        }

        if (!in_array($score, [-1, 1])) {
            throw new Exception("invalid_value");
        }

        $past_vote = elgg_get_annotations(array(
            "guid" => $entity->guid,
            "annotation_name" => "vote",
            "annotation_owner_guid" => $user->guid
        ));

        if ($past_vote) {
            $past_vote = $past_vote[0];
            $past_value = (int) $past_vote->value;
        }

        if ($past_value === $score) {
            throw new Exception("already_voted");
        } elseif ($past_vote) {
            $result = $past_vote->delete();
        } else {
            $result = $entity->annotate("vote", $score, $entity->access_id);
        }

        if ($result) {
            return [
                "guid" => $entity->guid
            ];
        }

        throw new Exception("could_not_save");
    }

    static function follow($input) {
        $entity = get_entity((int) $input["guid"]);
        if (!$entity) {
            throw new Exception("could_not_find");
        }

        $user = elgg_get_logged_in_user_entity();
        if (!$user) {
            throw new Exception("not_logged_in");
        }

        if ($input["isFollowing"]) {
            $result = add_entity_relationship($user->guid, "content_subscription", $entity->guid);
        } else {
            $result = remove_entity_relationship($user->guid, "content_subscription", $entity->guid);
        }

        if ($result) {
            return [
                "guid" => $entity->guid
            ];
        }

        throw new Exception("could_not_save");
    }

    static function editProfileField($input) {
        $site = elgg_get_site_entity();
        $entity = get_entity(((int) $input["guid"]));
        if (!$entity) {
            throw new Exception("could_not_find");
        }

        if (!$entity->canEdit()) {
            throw new Exception("could_not_save");
        }

        if (!$entity instanceof \ElggUser) {
            throw new Exception("not_a_user");
        }

        $key = $input["key"];
        $value = $input["value"];

        $defaultFields = [
            [ "key" => "name", "name" => "Naam" ],
            [ "key" => "phone", "name" => "Telefoonnummer" ],
            [ "key" => "mobile", "name" => "Mobiel nummer" ],
            [ "key" => "emailaddress", "name" => "E-mailadres" ],
            [ "key" => "site", "name" => "Website" ],
            [ "key" => "aboutme", "name" => "Over mij" ]
        ];

        $customFields = elgg_get_plugin_setting("profile", "pleio_template") ? json_decode(elgg_get_plugin_setting("profile", "pleio_template"), true) : [];

        $allFields = array_merge($defaultFields, $customFields);

        if (!in_array($key, array_map(function($f) { return $f["key"]; }, $allFields))) {
            throw new Exception("invalid_key");
        }

        if ($value) {
            if ($key === "name") {
                $entity->$key = $value;
                $result = $entity->save();
            } else {
                $accessId = isset($input["accessId"]) ? $input["accessId"] : ACCESS_LOGGED_IN;
                $result = create_metadata($entity->guid, $key, $value, "", 0, $accessId, false, $site->guid);
            }
        } else {
            $entity->deleteMetadata($key);
            $result = true;
        }

        if ($result) {
            return [
                "guid" => $entity->guid
            ];
        }

        throw new Exception("could_not_save");
    }

    static function editInterests($input) {
        $entity = get_entity(((int) $input["guid"]));
        if (!$entity) {
            throw new Exception("could_not_find");
        }

        if (!$entity->canEdit()) {
            throw new Exception("could_not_save");
        }

        if (!$entity instanceof \ElggUser) {
            throw new Exception("not_a_user");
        }

        $entity->tags = filter_tags($input["tags"]);
        $result = $entity->save();

        if ($result) {
            return [
                "guid" => $entity->guid
            ];
        }

        throw new Exception("could_not_save");
    }

    static function editNotifications($input) {
        $entity = get_entity(((int) $input["guid"]));
        if (!$entity) {
            throw new Exception("could_not_find");
        }

        if (!$entity->canEdit()) {
            throw new Exception("could_not_save");
        }

        if (!$entity instanceof \ElggUser) {
            throw new Exception("not_a_user");
        }

        $site = elgg_get_site_entity();
        $emailNotifications = (bool) $input["emailNotifications"];
        $newsletter = (bool) $input["newsletter"];

        if ($newsletter) {
            $result &= newsletter_subscribe_user($entity, $site);
        } else {
            $result &= newsletter_unsubscribe_user($entity, $site);
        }

        if ($emailNotifications) {
            set_user_notification_setting($entity->guid, "email", true);
        } else {
            set_user_notification_setting($entity->guid, "email", false);
        }

        $result = $entity->save();

        if ($result) {
            return [
                "guid" => $entity->guid
            ];
        }

        throw new Exception("could_not_save");
    }

    static function editGroupNotifications($input) {
        $user = elgg_get_logged_in_user_entity();
        if (!$user) {
            throw new Exception("not_logged_in");
        }

        $group = get_entity(((int) $input["guid"]));
        if (!$group || !$group instanceof \ElggGroup) {
            throw new Exception("could_not_find");
        }

        if (!$group->isMember($user)) {
            throw new Exception("user_not_member_of_group");
        }

        $getsNotifications = $input["getsNotifications"];
        if ($getsNotifications) {
            add_entity_relationship($user->guid, "subscribed", $group->guid);
        } else {
            remove_entity_relationship($user->guid, "subscribed", $group->guid);
        }

        return  [
            "guid" => $group->guid
        ];
    }

    static function editEmailOverview($input) {
        $site = elgg_get_site_entity();
        $entity = get_entity(((int) $input["guid"]));


        if (!$entity) {
            throw new Exception("could_not_find");
        }

        if (!$entity->canEdit()) {
            throw new Exception("could_not_save");
        }

        if (!$entity instanceof \ElggUser) {
            throw new Exception("not_a_user");
        }

        if (!in_array($input["overview"], ["daily", "weekly", "twoweekly", "monthly", "never"])) {
            throw new Exception("invalid_value");
        }

        if ($updates === "never") {
            $entity->removePrivateSetting("email_overview_{$site->guid}");
        } else {
            $entity->setPrivateSetting("email_overview_{$site->guid}", $input["overview"]);
        }

        return [
            "guid" => $entity->guid
        ];
    }

    static function editEmail($input) {
        $entity = get_entity(((int) $input["guid"]));
        if (!$entity) {
            throw new Exception("could_not_find");
        }

        if (!$entity->canEdit()) {
            throw new Exception("could_not_save");
        }

        if (!$entity instanceof \ElggUser) {
            throw new Exception("not_a_user");
        }

        $email = trim($input["email"]);
        if (!is_email_address($email)) {
            throw new Exception("invalid_email");
        }

        if (get_user_by_email($email)) {
            throw new Exception("email_already_in_use");
        }

        set_input("guid", $entity->guid);
        set_input("email", $email);
        security_tools_prepare_email_change();

        return [
            "guid" => $entity->guid
        ];

        throw new Exception("could_not_save");
    }

    static function editPassword($input) {
        $user = get_entity(((int) $input["guid"]));
        $oldPassword = $input["oldPassword"];
        $newPassword = $input["newPassword"];

        if (!$user) {
            throw new Exception("could_not_find");
        }

        if (!$user->canEdit()) {
            throw new Exception("could_not_save");
        }

        if (!$user instanceof \ElggUser) {
            throw new Exception("not_a_user");
        }

        $credentials = array(
            "username" => $user->username,
            "password" => $oldPassword
        );

        try {
            pam_auth_userpass($credentials);
        } catch (\LoginException $e) {
            throw new Exception("invalid_old_password");
        }

        if (!validate_password($newPassword)) {
            throw new Exception("invalid_new_password");
        }

        $user->setPassword($newPassword);
        $user->code = "";

        if ($user->guid == elgg_get_logged_in_user_guid() && !empty($_COOKIE['elggperm'])) {
            // regenerate remember me code so no other user could
            // use it to authenticate later
            $code = _elgg_generate_remember_me_token();
            $_SESSION['code'] = $code;
            $user->code = md5($code);
            setcookie("elggperm", $code, (time() + (86400 * 30)), "/");
        }

        $result = $user->save();
        if ($result) {
            Helpers::sendPasswordChangeMessage($user);

            return [
                "guid" => $entity->guid
            ];
        }

        throw new Exception("could_not_save");
    }

    static function editAvatar($input) {
        $entity = get_entity(((int) $input["guid"]));
        if (!$entity) {
            throw new Exception("could_not_find");
        }

        if (!$entity->canEdit()) {
            throw new Exception("could_not_save");
        }

        if ($input["avatar"]) {
            Helpers::editAvatar($input["avatar"], $entity);
            $entity->icontime = time();
        } else {
            unset($entity->icontime);
        }

        $result = $entity->save();
        if ($result) {
            return [
                "guid" => $entity->guid
            ];
        }

        throw new Exception("could_not_save");
    }

    static function addImage($input) {
        $user = elgg_get_logged_in_user_entity();
        if (!$user) {
            throw new Exception("could_not_save");
        }

        $result = Helpers::saveToImage($input["image"], $user);

        if ($result) {
            return [
                "guid" => $result->guid
            ];
        }

        throw new Exception("could_not_save");
    }

    static function addPage($input) {
        $site = elgg_get_site_entity();

        $entity = new \ElggObject();
        $entity->subtype = "page";
        $entity->title = $input["title"];

        if (isset($input["accessId"])) {
            $entity->access_id = $input["accessId"];
        } else {
            $entity->access_id = get_default_access();
        }

        $entity->description = $input["description"];
        $entity->richDescription = $input["richDescription"];

        $entity->pageType = $input["pageType"];

        if (isset($input["containerGuid"])) {
            $entity->container_guid = $input["containerGuid"];
        } else {
            $entity->container_guid = $site->guid;
        }

        $result = $entity->save();

        if ($result) {
            return [
                "guid" => $entity->guid
            ];
        }

        throw new Exception("could_not_save");
    }

    static function editPage($input) {
        $entity = get_entity((int) $input["guid"]);
        if (!$entity) {
            throw new Exception("could_not_find");
        }

        if (!$entity->canEdit()) {
            throw new Exception("could_not_save");
        }

        $entity->title = $input["title"];

        $entity->description = $input["description"];
        $entity->richDescription = $input["richDescription"];

        if (isset($input["accessId"]) && $input["accessId"] != $entity->access_id) {
            $entity->access_id = $input["accessId"];

            foreach (Helpers::getChildren($entity, "row") as $child) {
                $child->access_id = $input["accessId"];
                $child->save();
                foreach (Helpers::getChildren($child, "page_widget") as $subchild) {
                    $subchild->access_id = $input["accessId"];
                    $subchild->save();
                }
            }
        }

        $result = $entity->save();

        if ($result) {
            return [
                "guid" => $entity->guid
            ];
        }

        throw new Exception("could_not_save");
    }

    static function addRow($input) {
        $container = get_entity($input["containerGuid"]);
        if (!$container || $container->getSubtype() !== "page") {
            throw new Exception("could_not_find");
        }

        if (!$container->canEdit()) {
            throw new Exception("could_not_save");
        }

        $row = new \ElggObject();
        $row->subtype = "row";
        $row->layout = $input["layout"];
        $row->container_guid = $input["containerGuid"];
        $row->access_id = $container->access_id;
        $result = $row->save();

        if ($result) {
            return [
                "guid" => $row->guid
            ];
        }

        throw new Exception("could_not_save");
    }

    static function addWidget($input) {
        $row = get_entity((int) $input["rowGuid"]);
        if (!$row || $row->getSubtype() !== "row") {
            throw new Exception("could_not_find");
        }

        if (!$row->canEdit()) {
            throw new Exception("could_not_save");
        }

        $entity = new \ElggObject();
        $entity->subtype = "page_widget";
        $entity->container_guid = $row->guid;
        $entity->position = $input["position"];
        $entity->access_id = $row->access_id;
        $entity->widget_type = $input["type"];

        $result = $entity->save();

        if ($result) {
            return [
                "guid" => $page->guid
            ];
        }

        throw new Exception("could_not_save");
    }

    static function editWidget($input) {
        $entity = get_entity((int) $input["guid"]);
        if (!$entity) {
            throw new Exception("could_not_find");
        }

        if (!$entity->canEdit()) {
            throw new Exception("could_not_save");
        }

        if ($input["title"]) {
            $entity->title = $input["title"];
        }

        if ($input["row"]) {
            $entity->row = (int) $input["row"];
        }

        if ($input["col"]) {
            $entity->col = (int) $input["col"];
        }

        if ($input["width"]) {
            $entity->width = (int) $input["width"];
        }

        if ($input["settings"]) {
            $entity->setPrivateSetting("settings", json_encode($input["settings"]));
        }

        $result = $entity->save();

        if ($result) {
            return [
                "guid" => $entity->guid
            ];
        }

        throw new Exception("could_not_save");
    }

    static function addGroup($input) {
        $group = new \ElggGroup();
        $user = elgg_get_logged_in_user_entity();

        $group->name = $input["name"];
        $group->membership = $input["isClosed"] ? ACCESS_PRIVATE : ACCESS_PUBLIC;
        $group->description = $input["description"];
        $group->richDescription = $input["richDescription"];
        $group->introduction = $input["introduction"];
        $group->plugins = array_unique($input["plugins"]);
        $group->tags = filter_tags($input["tags"]);
        $group->access_id = ACCESS_PUBLIC;

        if (elgg_is_admin_logged_in() && isset($input["isFeatured"])) {
            $group->isFeatured = $input["isFeatured"];
        }

        if (isset($input["autoNotification"])) {
            $group->autoNotification = $input["autoNotification"];
        }

        $result = $group->save();

        if ($input["icon"]) {
            Helpers::saveToIcon($input["icon"], $group);
            $group->icontime = time();
        }

        if ($input["featured"]) {
            if ($input["featured"]["image"]) {
                Helpers::saveToFeatured($input["featured"]["image"], $group);
                $group->featuredIcontime = time();
            }

            if ($input["featured"]["video"]) {
                $group->featuredVideo = $input["featured"]["video"];
            }

            if ($input["featured"]["positionY"]) {
                $group->featuredPositionY = $input["featured"]["positionY"];
            } else {
                unset($group->featuredPositionY);
            }
        }

        if ($result) {
            $group->join($user);

            return [
                "guid" => $group->guid
            ];
        }

        throw new Exception("could_not_save");
    }

    static function editGroup($input) {
        $group = get_entity((int) $input["guid"]);
        if (!$group) {
            throw new Exception("could_not_find");
        }

        if (!$group->canEdit() || !$group instanceof \ElggGroup) {
            throw new Exception("could_not_save");
        }

        if ($input["icon"]) {
            Helpers::saveToIcon($input["icon"], $group);
            $group->icontime = time();
        } else {
            unset($group->icontime);
        }

        $group->name = $input["name"];
        $group->membership = $input["isClosed"] ? ACCESS_PRIVATE : ACCESS_PUBLIC;
        $group->access_id = ACCESS_PUBLIC;
        $group->description = $input["description"];
        $group->richDescription = $input["richDescription"];
        $group->introduction = $input["introduction"];
        $group->tags = filter_tags($input["tags"]);
        $group->plugins = array_unique($input["plugins"]);

        if (elgg_is_admin_logged_in() && isset($input["isFeatured"])) {
            if ($input["isFeatured"]) {
                $group->isFeatured = $input["isFeatured"];
            } else {
                unset($group->isFeatured);
            }
        }

        if (isset($input["autoNotification"])) {
            if ($input["autoNotification"]) {
                $group->autoNotification = $input["autoNotification"];
            } else {
                unset($group->autoNotification);
            }
        }

        if ($input["featured"]) {
            if ($input["featured"]["image"]) {
                if ($input["featured"]["image"] === "false") {
                    unset($group->featuredIcontime);
                } else {
                    Helpers::saveToFeatured($input["featured"]["image"], $group);
                    $group->featuredIcontime = time();
                }
            }

            if ($input["featured"]["video"]) {
                $group->featuredVideo = $input["featured"]["video"];
            } else {
                unset($group->featuredVideo);
            }

            if ($input["featured"]["positionY"]) {
                $group->featuredPositionY = $input["featured"]["positionY"];
            } else {
                unset($group->featuredPositionY);
            }
        } else {
            unset($group->featuredIcontime);
            unset($group->featuredVideo);
            unset($group->featuredPositionY);
        }

        $result = $group->save();

        if ($result) {
            return [
                "guid" => $group->guid
            ];
        }

        throw new Exception("could_not_save");
    }

    static function addSubgroup($input) {
        $group = get_entity($input["groupGuid"]);
        if (!$group || !$group instanceof \ElggGroup) {
            throw new Exception("could_not_find");
        }

        if (!$group->canEdit()) {
            throw new Exception("could_not_save");
        }

        $id = create_access_collection($input["name"], $group->guid);

        if ($group->subpermissions) {
            $subpermissions = unserialize($group->subpermissions);
        }

        if (!is_array($subpermissions)) {
            $subpermissions = array();
        }

        array_push($subpermissions, $id);

        $group->subpermissions = serialize($subpermissions);
        $group->save();

        update_access_collection($id, $input["members"]);

        return [
            "success" => true
        ];
    }

    static function editSubgroup($input) {
        $access_collection = get_access_collection($input["id"]);
        if (!$access_collection) {
            throw new Exception("could_not_find");
        }

        $group = get_entity($access_collection->owner_guid);
        if (!$group || !$group instanceof \ElggGroup) {
            throw new Exception("could_not_find");
        }

        if (!$group->canEdit()) {
            throw new Exception("could_not_save");
        }

        if ($group->subpermissions) {
            $subpermissions = unserialize($group->subpermissions);
        }

        if (!is_array($subpermissions)) {
            $subpermissions = array();
        }

        if (!in_array($input["id"], $subpermissions)) {
            throw new Exception("could_not_find");
        }

        $dbprefix = elgg_get_config("dbprefix");

        if ($access_collection->name !== $input["name"]) {
            $id = sanitise_int($access_collection->id);
            $name = sanitize_string($input["name"]);
            update_data("UPDATE {$dbprefix}access_collections SET name = '{$name}' WHERE id = {$id}");
        }

        update_access_collection($access_collection->id, $input["members"]);
    }

    static function deleteSubgroup($input) {
        $access_collection = get_access_collection($input["id"]);
        if (!$access_collection) {
            throw new Exception("could_not_find");
        }

        $group = get_entity($access_collection->owner_guid);
        if (!$group || !$group instanceof \ElggGroup) {
            throw new Exception("could_not_find");
        }

        if (!$group->canEdit()) {
            throw new Exception("could_not_save");
        }

        if ($group->subpermissions) {
            $subpermissions = unserialize($group->subpermissions);
        }

        if (!is_array($subpermissions)) {
            $subpermissions = array();
        }

        if (!in_array($input["id"], $subpermissions)) {
            throw new Exception("could_not_find");
        }

        if (delete_access_collection($access_collection->id)) {
            $subpermissions = array_diff($subpermissions, [$access_collection->id]);
            $group->subpermissions = serialize($subpermissions);
            $group->save();
        }
    }

    static function joinGroup($input) {
        $site = elgg_get_site_entity();

        $group = get_entity((int) $input["guid"]);
        if (!$group || !$group instanceof \ElggGroup) {
            throw new Exception("could_not_find");
        }

        $user = elgg_get_logged_in_user_entity();
        if (!$user) {
            throw new Exception("not_logged_in");
        }

        if ($group->isPublicMembership() || $group->canEdit()) {
            groups_join_group($group, $user);
        } else {
            add_entity_relationship($user->guid, "membership_request", $group->guid);

            $owner = get_entity($group->owner_guid);
            $link = Helpers::getURL($group, true);

            $result = elgg_send_email(
                $site->email ? $site->email : "noreply@" . get_site_domain($site->guid),
                $owner->email,
                "Toegangsaanvraag voor de groep {$group->name}",
                "De gebruiker {$user->name} heeft toegang aangevraagd tot de {$group->name}. Volg de onderstaande link en ga via het menu Beheer naar toegangsaanvragen om de aanvraag te beoordelen:<br />
                <a href=\"{$link}\">$link</a>
                "
            );
        }

        return [
            "guid" => $group->guid
        ];
    }

    static function leaveGroup($input) {
        $group = get_entity((int) $input["guid"]);
        if (!$group || !$group instanceof \ElggGroup) {
            throw new Exception("could_not_find");
        }

        $user = elgg_get_logged_in_user_entity();
        if (!$user) {
            throw new Exception("not_logged_in");
        }

        if ($group->owner_guid == $user->guid) {
            throw new Exception("could_not_leave");
        }

        if (!$group->leave($user)) {
            throw new Exception("could_not_leave");
        }

        if ($group->group_acl) {
            remove_user_from_access_collection($user->guid, $group->group_acl);
        }

        remove_entity_relationship($user->guid, "membership_request", $group->guid);
        remove_entity_relationship($user->guid, "invited", $group->guid);

        return [
            "guid" => $group->guid
        ];
    }

    static function inviteToGroup($input) {
        $site = elgg_get_site_entity();
        $current_user = elgg_get_logged_in_user_entity();

        $group = get_entity((int) $input["guid"]);
        if (!$group || !$group instanceof \ElggGroup) {
            throw new Exception("could_not_find_group");
        }

        if (!$group->canEdit()) {
            throw new Exception("could_not_save");
        }

        foreach ($input["users"] as $user) {
            if ($user["guid"]) {
                $user = get_entity((int) $user["guid"]);
                $email = $user->email;
            } else if ($user["email"]) {
                $email = $user["email"];
            } else {
                $email = "";
            }

            if (!$email) {
                throw new Exception("could_not_invite");
            }

            $invite_code = group_tools_generate_email_invite_code($group->guid, $email);

            $earlier_invitation = group_tools_check_group_email_invitation($invite_code, $group->guid);
            if (!$earlier_invitation) {
                $group->annotate("email_invitation", $invite_code . "|" . $email, ACCESS_LOGGED_IN, $group->guid);
            }

            $site_url = elgg_get_site_url();
            $link = "{$site_url}groups/invitations/?invitecode={$invite_code}";

            $result = elgg_send_email(
                $site->email ? $site->email : "noreply@" . get_site_domain($site->guid),
                $email,
                "Uitnodiging om lid te worden van de groep {$group->name}",
                "Je bent uitgenodigd door {$current_user->name} om lid te worden van de groep {$group->name}. Volg de onderstaande link om lid te worden van de groep:<br />
                <a href=\"{$link}\">$link</a>
                "
            );
        }
    }

    static function resendGroupInvitation($input) {
        $site = elgg_get_site_entity();
        $current_user = elgg_get_logged_in_user_entity();

        $annotation = get_annotation((int) $input["id"]);

        if ($annotation->name !== "email_invitation") {
            throw new Exception("could_not_find");
        }

        $group = $annotation->getEntity();
        if (!$group || !$group instanceof \ElggGroup) {
            throw new Exception("could_not_find_group");
        }

        if (!$group->canEdit()) {
            throw new Exception("could_not_save");
        }

        $code = explode("|", $annotation->value);

        $site_url = elgg_get_site_url();

        $link = "{$site_url}groups/invitations/?invitecode={$code[0]}";

        $result = elgg_send_email(
            $site->email ? $site->email : "noreply@" . get_site_domain($site->guid),
            $code[1],
            "Herinnering om lid te worden van de groep {$group->name}",
            "Je bent nogmaals uitgenodigd door {$current_user->name} om lid te worden van de groep {$group->name}. Volg de onderstaande link om lid te worden van de groep:<br />
            <a href=\"{$link}\">$link</a>
            "
        );

        return [
            "guid" => $group->guid
        ];
    }

    static function deleteGroupInvitation($input) {
        $annotation = get_annotation((int) $input["id"]);

        if (!$annotation) {
            return [
                "guid" => $group->guid
            ];
        }

        if ($annotation->name !== "email_invitation") {
            throw new Exception("could_not_find");
        }

        $group = $annotation->getEntity();
        if (!$group || !$group instanceof \ElggGroup) {
            throw new Exception("could_not_find_group");
        }

        if (!$group->canEdit()) {
            throw new Exception("could_not_save");
        }

        $result = $annotation->delete();
        if (!$result) {
            throw new Exception("could_not_save");
        }

        return [
            "guid" => $group->guid
        ];
    }

    static function acceptMembershipRequest($input) {
        $site = elgg_get_site_entity();
        $logged_in_user = elgg_get_logged_in_user_entity();

        $group = get_entity($input["groupGuid"]);
        $user = get_entity($input["userGuid"]);

        if (!$group || !$group instanceof \ElggGroup) {
            throw new Exception("could_not_find_group");
        }

        if (!$user || !$user instanceof \ElggUser) {
            throw new Exception("could_not_find_group");
        }

        if (!$group->canEdit()) {
            throw new Exception("could_not_save");
        }

        $relationship = check_entity_relationship($user->guid, "membership_request", $group->guid);
        if (!$relationship) {
            throw new Exception("could_not_find_membership_request");
        }

        groups_join_group($group, $user);
        remove_entity_relationship($user->guid, "membership_request", $group->guid);

        $link = Helpers::getURL($group, true);

        $result = elgg_send_email(
            $site->email ? $site->email : "noreply@" . get_site_domain($site->guid),
            $user->email,
            "Toegangsaanvraag voor de groep {$group->name} goedgekeurd",
            "De beheerder {$logged_in_user->name} heeft jouw aanvraag tot de groep {$group->name} goedgekeurd. Volg de onderstaande link om direct naar de groep te gaan:<br />
            <a href=\"{$link}\">$link</a>
            "
        );

        return [
            "guid" => $group->guid
        ];
    }

    static function rejectMembershipRequest($input) {
        $site = elgg_get_site_entity();
        $logged_in_user = elgg_get_logged_in_user_entity();

        $group = get_entity($input["groupGuid"]);
        $user = get_entity($input["userGuid"]);

        if (!$group || !$group instanceof \ElggGroup) {
            throw new Exception("could_not_find_group");
        }

        if (!$user || !$user instanceof \ElggUser) {
            throw new Exception("could_not_find_group");
        }

        if (!$group->canEdit()) {
            throw new Exception("could_not_save");
        }

        remove_entity_relationship($user->guid, "membership_request", $group->guid);

        $result = elgg_send_email(
            $site->email ? $site->email : "noreply@" . get_site_domain($site->guid),
            $user->email,
            "Toegangsaanvraag voor de groep {$group->name} afgewezen",
            "De beheerder {$logged_in_user->name} heeft jouw aanvraag tot de groep {$group->name} afgewezen. Neem contact op met de beheerder voor meer informatie."
        );

        return [
            "guid" => $group->guid
        ];
    }

    static function sendMessageToGroup($input) {
        set_time_limit(0);

        $site = elgg_get_site_entity();

        $group = get_entity((int) $input["guid"]);
        if (!$group) {
            throw new Exception("could_not_find");
        }

        if (!$group->canEdit() || !$group instanceof \ElggGroup) {
            throw new Exception("could_not_save");
        }

        if ($input["isTest"]) {
            $current_user = elgg_get_logged_in_user_entity();
            $result =   elgg_send_email(
                $site->email ? $site->email : "noreply@" . get_site_domain($site->guid),
                $current_user->email,
                "Bericht van {$group->name}: {$input['subject']}",
                $input['message']
            );
        } else {
            $recipients = $input["recipients"];
            if ($recipients) {
                foreach ($recipients as $guid) {
                    if (!$group->isMember($guid)) {
                        continue;
                    }

                    $member = get_entity($guid);
                    if (!$member) {
                        continue;
                    }

                    $result = elgg_send_email(
                        $site->email ? $site->email : "noreply@" . get_site_domain($site->guid),
                        $member->email,
                        "Bericht van {$group->name}: {$input['subject']}",
                        $input['message']
                    );
                }
            } else {
                foreach ($group->getMembers(0) as $member) {
                    $result = elgg_send_email(
                        $site->email ? $site->email : "noreply@" . get_site_domain($site->guid),
                        $member->email,
                        "Bericht van {$group->name}: {$input['subject']}",
                        $input['message']
                    );
                }
            }
        }

        return [
            "guid" => $group->guid
        ];
    }

    static function acceptGroupInvitation($input) {
        $user = elgg_get_logged_in_user_entity();
        if (!$user) {
            throw new Exception("not_logged_in");
        }

        $group = group_tools_check_group_email_invitation($input["code"]);
        if (!$group) {
            throw new Exception("invalid_code");
        }

        groups_join_group($group, $user);

        $options = array(
            "guid" => $group->guid,
            "annotation_name" => "email_invitation",
            "wheres" => array("(v.string = '" . sanitize_string($input["code"]) . "' OR v.string LIKE '" . sanitize_string($input["code"]) . "|%')"),
            "annotation_owner_guid" => $group->guid,
            "limit" => 1
        );

        $annotations = elgg_get_annotations($options);
        if (!empty($annotations)) {
            $ia = elgg_set_ignore_access(true);
            $annotations[0]->delete();
            elgg_set_ignore_access($ia);
        }

        return [
            "guid" => $group->guid
        ];
    }

    static function changeGroupRoleMutation($input) {
        $site = elgg_get_site_entity();

        $current_user = elgg_get_logged_in_user_entity();
        if (!$current_user) {
            throw new Exception("not_logged_in");
        }

        $group = get_entity((int) $input["guid"]);
        if (!$group || !$group instanceof \ElggGroup) {
            throw new Exception("could_not_find_group");
        }

        if (!$group->canEdit()) {
            throw new Exception("could_not_save");
        }

        $user = get_entity((int) $input["userGuid"]);
        if (!$user || !$user instanceof \ElggUser) {
            throw new Exception("could_not_find_user");
        }

        if (!$group->isMember($user)) {
           throw new Exception("user_not_member_of_group");
        }

        $role = $input["role"];

        switch ($role) {
            case "owner":
                if (!$current_user->isAdmin() && $current_user->guid != $group->owner_guid) {
                    throw new Exception("user_not_group_owner_or_site_admin");
                }

                Helpers::transferGroupOwnership($group, $user);

                $link = Helpers::getURL($group, true);

                $result = elgg_send_email(
                    $site->email ? $site->email : "noreply@" . get_site_domain($site->guid),
                    $user->email,
                    "Eigenaarschap van de groep {$group->name} overgedragen",
                    "De beheerder {$logged_in_user->name} heeft het eigenaarschap van de groep {$group->name} aan jou overgedragen. Bekijk de groep op:<br />
                    <a href=\"{$link}\">$link</a>
                    "
                );

                break;
            case "admin":
                add_entity_relationship($user->guid, "group_admin", $group->guid);
                break;
            case "member":
                remove_entity_relationship($user->guid, "group_admin", $group->guid);
                break;
            case "removed":
                remove_entity_relationship($user->guid, "group_admin", $group->guid);
                leave_group($group->guid, $user->guid);
                break;
        }

        return [
            "guid" => $group->guid
        ];
    }

    static function editTask($input) {
        $task = get_entity((int) $input["guid"]);
        if (!$task) {
            throw new Exception("could_not_find");
        }

        if (!$task->canEdit() || !$task instanceof \ElggObject || $task->getSubtype() !== "task") {
            throw new Exception("could_not_save");
        }

        $task->state = $input["state"];

        $result = $task->save();

        if ($result) {
            return [
                "guid" => $task->guid
            ];
        }

        throw new Exception("could_not_save");
    }

    static function attendEvent($input) {
        $event = get_entity((int) $input["guid"]);
        if (!$event) {
            throw new Exception("could_not_find");
        }

        if (!$event instanceof \ElggObject || $event->getSubtype() !== "event") {
            throw new Exception("could_not_save");
        }

        $user = elgg_get_logged_in_user_entity();
        if (!$user) {
            throw new Exception("not_logged_in");
        }

        if ($input["state"] === "accept") {
            add_entity_relationship($event->guid, "event_attending", $user->guid);
        } else {
            remove_entity_relationship($event->guid, "event_attending", $user->guid);
        }

        if ($input["state"] === "maybe") {
            add_entity_relationship($event->guid, "event_maybe", $user->guid);
        } else {
            remove_entity_relationship($event->guid, "event_maybe", $user->guid);
        }

        if ($input["state"] == "reject") {
            add_entity_relationship($event->guid, "event_reject", $user->guid);
        } else {
            remove_entity_relationship($event->guid, "event_reject", $user->guid);
        }

        return [
            "guid" => $event->guid
        ];
    }

    static function markAsRead($input) {
        $dbprefix = elgg_get_config("dbprefix");

        $user = elgg_get_logged_in_user_entity();
        if (!$user) {
            return [
                "success" => false,
                "notification" => null
            ];
        }

        $id = (int) $input["id"];
        if (!$id) {
            throw new Exception("could_not_find");
        }

        $sql = "SELECT * FROM {$dbprefix}notifications WHERE id = {$id} AND user_guid = {$user->guid}";
        $notification = get_data_row($sql);

        if (!$notification) {
            throw new Exception("could_not_find");
        }

        $result = update_data("UPDATE {$dbprefix}notifications SET unread = 'no' WHERE id = {$id} AND user_guid = {$user->guid}");
        if ($result) {
            $notification = get_data_row($sql);

            return [
                "success" => true,
                "notification" => Mapper::getNotification($notification)
            ];
        }

        return [
            "success" => false,
            "notification" => null
        ];
    }

    static function markAllAsRead($input) {
        $dbprefix = elgg_get_config("dbprefix");

        $user = elgg_get_logged_in_user_entity();
        if (!$user) {
            return [ "success" => false ];
        }

        $result = update_data("UPDATE {$dbprefix}notifications SET unread = 'no' WHERE user_guid = {$user->guid}");
        if ($result) {
            return [ "success" => true ];
        }

        return [ "success" => false ];
    }

    static function toggleBestAnswer($input) {
        $site = elgg_get_site_entity();
        $user = elgg_get_logged_in_user_entity();
        if (!$user || !check_entity_relationship($user->guid, "questions_expert", $site->guid)) {
            return [
                "guid" => $question->guid
            ];
        }

        $entity = get_entity($input["guid"]);
        if (!$entity || !in_array($entity->getSubtype(), ["comment", "answer"])) {
            throw new Exception("could_not_save");
        }

        $question = $entity->getContainerEntity();
        if (!$question) {
            throw new Exception("could_not_find");
        }

        if (check_entity_relationship($question->guid, "correctAnswer", $entity->guid)) {
            remove_entity_relationship($question->guid, "correctAnswer", $entity->guid);
        } else {
            $correctAnswers = $question->getEntitiesFromRelationship("correctAnswer", false, 0);
            if ($correctAnswers) {
                foreach ($correctAnswers as $correctAnswer) {
                    remove_entity_relationship($question->guid, "correctAnswer", $correctAnswer->guid);
                }
            }

            add_entity_relationship($question->guid, "correctAnswer", $entity->guid);
        }

        return [
            "guid" => $question->guid
        ];
    }
}
