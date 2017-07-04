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

        if (!in_array($input["type"], array("group", "object"))) {
            throw new Exception("invalid_type");
        }

        $accessId = get_default_access();
        if ((int) $input["containerGuid"]) {
            $container = get_entity((int) $input["containerGuid"]);
            if ($container instanceof \ElggGroup && $container->membership === ACCESS_PRIVATE && $container->group_acl) {
                $accessId = $container->group_acl;
            }
        }

        switch ($input["type"]) {
            case "object":
                if (!in_array($input["subtype"], array("file", "folder", "news", "blog", "question", "comment","page", "wiki", "event", "task"))) {
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

                $entity->access_id = $accessId;
                $entity->tags = filter_tags($input["tags"]);

                if (elgg_is_admin_logged_in()) {
                    if (isset($input["isRecommended"])) {
                        $entity->isRecommended = $input["isRecommended"];
                    }
                }

                if ($container) {
                    $entity->container_guid = $container->guid;
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
            $entity->startDate = date("U", strtotime($input["startDate"]));
            $entity->endDate = date("U", strtotime($input["endDate"]));
            $result = $entity->save();
        }

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

                if ((int) $input["accessId"]) {
                    $entity->access_id = (int) $input["accessId"];
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
            $entity->startDate = date("U", strtotime($input["startDate"]));
            $entity->endDate = date("U", strtotime($input["endDate"]));
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

        if ($file["size"] === 0 || $file["size"] > 1048576 * 10) {
            throw new Exception("invalid_filesize");
        }

        $acceptable_types = [
            "image/png",
            "image/jpeg",
            "application/pdf",
            "text/plain",
            "text/csv",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.ms-powerpoint",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation"
        ];

        $mime_type = mime_content_type($file["tmp_name"]);
        if (!in_array($mime_type, $acceptable_types)) {
            throw new Exception("invalid_filetype");
        }

        $entity = new \FilePluginFile();
        $entity->title = $file["name"];
        $entity->access_id = get_default_access();

        if ($input["containerGuid"]) {
            $entity->container_guid = $input["containerGuid"];
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
            [ "key" => "phone", "name" => "Telefoonnummer" ],
            [ "key" => "mobile", "name" => "Mobiel nummer" ],
            [ "key" => "emailaddress", "name" => "E-mailadres" ],
            [ "key" => "site", "name" => "Website" ],
            [ "key" => "description", "name" => "Over mij" ]
        ];

        $customFields = elgg_get_plugin_setting("profile", "pleio_template") ? json_decode(elgg_get_plugin_setting("profile", "pleio_template"), true) : [];

        $allFields = array_merge($defaultFields, $customFields);

        if (!in_array($key, array_map(function($f) { return $f["key"]; }, $allFields))) {
            throw new Exception("invalid_key");
        }

        if ($value) {
            if ($key == "name") {
                $entity->$key = $value;
                $result = $entity->save();
            } else {
                $result = create_metadata($entity->guid, $key, $value, "", 0, get_default_access(), false, $site->guid);
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
        $notificationOnReply = (bool) $input["notificationOnReply"];
        $newsletter = (bool) $input["newsletter"];

        if ($newsletter) {
            $result &= newsletter_subscribe_user($entity, $site);
        } else {
            $result &= newsletter_unsubscribe_user($entity, $site);
        }

        if ($notificationOnReply) {
            $entity->setPrivateSetting("notificationOnReply", "yes");
        } else {
            $entity->removePrivateSetting("notificationOnReply");
        }

        $result = $entity->save();

        if ($result) {
            return [
                "guid" => $entity->guid
            ];
        }

        throw new Exception("could_not_save");
    }

    static function editEmailOverview($input) {
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
            $entity->removePrivateSetting("email_overview");
        } else {
            $entity->setPrivateSetting("email_overview", $input["overview"]);
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
            Helpers::saveToIcon($input["avatar"], $entity);
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
        $entity = new ElggObject();
        $entity->subtype = "page";
        $entity->title = $input["title"];

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
            throw new Eception("could_not_save");
        }

        $entity->title = $input["title"];
        $result = $entity->save();

        if ($result) {
            return [
                "guid" => $entity->guid
            ];
        }

        throw new Exception("could_not_save");
    }

    static function addWidget($input) {
        $page = get_entity((int) $input["pageGuid"]);
        if (!$page) {
            throw new Exception("could_not_find");
        }

        if (!$page->canEdit()) {
            throw new Exception("could_not_save");
        }

        $entity = new \ElggObject();
        $entity->subtype = "page_widget";
        $entity->title = $input["title"];
        $entity->container_guid = $page->guid;
        $entity->access_id = get_default_access();
        $result = $entity->save();

        $entity->widget_type = $input["type"];
        $result &= $entity->save();

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
            throw new Eception("could_not_save");
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

        if ($input["icon"]) {
            Helpers::saveToIcon($input["icon"], $entity);
            $group->icontime = time();
        } else {
            unset($group->icontime);
        }

        $group->name = $input["name"];
        $group->membership = $input["isClosed"] ? ACCESS_PRIVATE : ACCESS_PUBLIC;
        $group->description = $input["description"];
        $group->plugins = array_unique($input["plugins"]);
        $group->tags = filter_tags($input["tags"]);
        $group->access_id = get_default_access();
        $result = $group->save();

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
        $group->description = $input["description"];
        $group->tags = filter_tags($input["tags"]);
        $group->plugins = array_unique($input["plugins"]);

        $result = $group->save();

        if ($result) {
            return [
                "guid" => $group->guid
            ];
        }

        throw new Exception("could_not_save");
    }

    static function joinGroup($input) {
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
            Helpers::sendGroupMembershipRequestNotification($group, $user);
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

            if ($email) {
                group_tools_invite_email($group, $email, "", true);
            }
        }
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

        $result = add_entity_relationship($user->guid, "event_attending", $event->guid);

        if ($result) {
            return [
                "guid" => $event->guid
            ];
        }

        throw new Exception("could_not_save");
    }
}