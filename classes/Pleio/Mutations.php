<?php
namespace Pleio;

class Mutations {
    static function login($input) {
        if (strpos($input['username'], '@') !== false && ($users = get_user_by_email($input['username']))) {
            $username = $users[0]->username;
        } else {
            $username = $input['username'];
        }

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

    static function subscribeNewsletter($input) {
        $email = $input['email'];
        $site = elgg_get_site_entity();

        $result = newsletter_subscribe_email($email, $site);
        if (!$result) {
            throw new Exception("could_not_register");
        }
    }
}