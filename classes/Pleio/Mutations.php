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
        } catch (LoginException $e) {
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

        $user = get_user_by_email($email);
        if ($user) {
            throw new Exception("already_registered");
        }

        $username = Helpers::generateUsername($email);
        $guid = register_user($username, $password, $name, $email, false);
        if ($guid) {
            $new_user = get_entity($guid);
            $site = elgg_get_site_entity();

            if ($newsletter) {
                add_entity_relationship($new_user->guid, "subscribed", $site->guid);
            } else {
                add_entity_relationship($new_user->guid, "blacklisted", $site->guid);
            }

            if ($tags) {
                $ia = elgg_set_ignore_access(true);
                $new_user->tags = filter_tags($tags);
                elgg_set_ignore_access($ia);
            }

            if ($terms) {
                $new_user->setPrivateSetting("general_terms_accepted", time());
            }

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
        $site = elgg_get_site_entity();
        if (!$site->isUser()) {
            if ($site->canJoin()) {
                $site->addUser();
            } else {
                throw new Exception("not_member_of_site");
            }
        }

        if (!in_array($input["type"], array("group", "object"))) {
            throw new Exception("invalid_type");
        }

        switch ($input["type"]) {
            case "group":
                $entity = new \ElggGroup();
                $entity->name = $input["name"];
            case "object":
                if (!in_array($input["subtype"], array("news", "blog", "question", "comment"))) {
                    throw new Exception("invalid_subtype");
                }

                $entity = new \ElggObject();
                $entity->title = $input["title"];
                $entity->subtype = $input["subtype"];
            default:
                $entity->description = $input["description"];
                $entity->access_id = (int) $input["accessId"] || get_default_access();
                $entity->tags = $input["tags"];

                if ((int) $input["containerGuid"]) {
                    $entity->container_guid = (int) $input["containerGuid"];
                }
        }

        $result = $entity->save();

        if (!$result) {
            throw new Exception("could_not_save");
        }

        if (in_array($input["subtype"], ["news", "blog"])) {
            if (isset($input["isFeatured"])) {
                $entity->isFeatured = $input["isFeatured"];
            }

            if ($input["featuredImage"]) {
                Helpers::saveToFeatured($input["featuredImage"], $entity);
                $entity->featuredIcontime = time();
            }

            if ($input["source"]) {
                $entity->source = $input["source"];
            }

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

                if ((int) $input["accessId"]) {
                    $entity->access_id = (int) $input["accessId"];
                }

                $entity->tags = $input["tags"];
        }

        $result = $entity->save();

        if (in_array($entity->getSubtype(), ["blog", "news"])) {
            if (isset($input["isFeatured"])) {
                $entity->isFeatured = $input["isFeatured"];
            }

            if ($input["featuredImage"]) {
                if ($input["featuredImage"] === "false") {
                    unset($entity->featuredIcontime);
                } else {
                    Helpers::saveToFeatured($input["featuredImage"], $entity);
                    $entity->featuredIcontime = time();
                }
            }

            if ($input["source"]) {
                $entity->source = $input["source"];
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

        if (!in_array($key, ["name", "phone", "mobile", "emailaddress", "site", "sector", "school", "description"])) {
            throw new Exception("invalid_key");
        }

        if ($value) {
            if ($key == "name") {
                $entity->$key = $value;
                $result = $entity->save();
            } else {
                $result = create_metadata($entity->guid, $key, $value, "", $entity->guid, get_default_access(), false);
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
        } catch (Exception $e) {
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

        Helpers::saveToIcon($input["avatar"], $entity);

        $entity->icontime = time();
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
}