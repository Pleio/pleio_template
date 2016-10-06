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
                throw new RegistrationException(elgg_echo('registerbad'));
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
            "status" => "ok"
        ];
    }

    static function forgotPasswordConfirm($input) {
        $userGuid = (int) $input["userGuid"];
        $code = (int) $input["code"];

        if (!execute_new_password_request($userGuid, $code)) {
            throw new Exception("unknown_error");
        }

        return [
            "status" => "ok"
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
        if (!in_array($input["type"], array("group", "object"))) {
            throw new Exception("invalid_type");
        }

        switch ($input["type"]) {
            case "group":
                $entity = new \ElggGroup();
                $entity->name = $input["name"];
            case "object":
                if (!in_array($input["subtype"], array("news", "comment"))) {
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
        if ($result) {
            return [
                "guid" => $entity->guid
            ];
        }

        throw new Exception("could_not_save");
    }

    static function editEntity($input) {
        $entity = get_entity((int) $input["guid"]);
        if (!$entity) {
            throw new Exception("could_not_find");
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
}