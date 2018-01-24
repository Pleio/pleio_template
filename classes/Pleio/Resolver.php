<?php
namespace Pleio;

class Resolver {
    static function getSite($a, $args, $c) {
        $site = elgg_get_site_entity();
        $user = elgg_get_logged_in_user_entity();

        $showLogo = (elgg_get_plugin_setting("show_logo", "pleio_template") === "yes") ? true : false;
        $showLeader = (elgg_get_plugin_setting("show_leader", "pleio_template") === "yes") ? true : false;
        $showLeaderButtons = (elgg_get_plugin_setting("show_leader_buttons", "pleio_template") === "no") ? false : true;

        $subtitle = elgg_get_plugin_setting("subtitle", "pleio_template");
        if (!$subtitle) {
            $subtitle = "";
        }

        $leaderImage = elgg_get_plugin_setting("leader_image", "pleio_template");
        if (!$leaderImage) {
            $leaderImage = "";
        }

        $showInitiative = (elgg_get_plugin_setting("show_initiative", "pleio_template") === "yes") ? true : false;

        $profile = json_decode(elgg_get_plugin_setting("profile", "pleio_template"));
        if (!$profile) {
            $profile = [];
        }

        $filters = json_decode(elgg_get_plugin_setting("filters", "pleio_template"));
        if (!$filters) {
            $filters = [];
        }

        $initiatorLink = elgg_get_plugin_setting("initiator_link", "pleio_template") ?: "";
        $theme = elgg_get_plugin_setting("theme", "pleio_template") ?: "leraar";
        $startpage = elgg_get_plugin_setting("startpage", "pleio_template") ?: "activity";
        $footer = json_decode(elgg_get_plugin_setting("footer", "pleio_template")) ?: [];

        if ($user && Helpers::isUser()) {
            if (Helpers::canJoin()) {
                Helpers::addUser();
            }
        }

        return [
            "guid" => $site->guid,
            "name" => $site->name,
            "menu" => Resolver::getMenu(),
            "profile" => $profile,
            "theme" => $theme,
            "footer" => $footer,
            "logo" => "/mod/pleio_template/logo.php?lastcache={$site->logotime}",
            "showLogo" => $showLogo,
            "startpage" => $startpage,
            "initiatorLink" => $initiatorLink,
            "showLeader" => $showLeader,
            "showLeaderButtons" => $showLeaderButtons,
            "subtitle" => $subtitle,
            "leaderImage" => $leaderImage,
            "showInitiative" => $showInitiative,
            "filters" => $filters,
            "style" => Resolver::getStyle()
        ];
    }

    static function getStyle() {
        return [
            "colorPrimary" => elgg_get_plugin_setting("color_primary", "pleio_template") ?: "#01689b",
            "colorSecondary" => elgg_get_plugin_setting("color_secondary", "pleio_template") ?: "#009ee3",
            "colorTertiary" => elgg_get_plugin_setting("color_tertiary", "pleio_template") ?: "#00c6ff",
            "colorQuaternary" => elgg_get_plugin_setting("color_quaternary", "pleio_template") ?: "#154273"
        ];
    }

    static function getMenu() {
        $menu = json_decode(elgg_get_plugin_setting("menu", "pleio_template"));

        if (!$menu) {
            $menu = [
                ["title" => "Blog", "link" => "/blog"],
                ["title" => "Nieuws", "link" => "/news"],
                ["title" => "Discussies", "link" => "/discussions"],
                ["title" => "Agenda", "link" => "/events"],
                ["title" => "Groepen", "link" => "/groups"]
            ];
        }

        return $menu;
    }

    static function getNotifications($a, $args, $c) {
        $dbprefix = elgg_get_config("dbprefix");
        $site = elgg_get_site_entity();

        $user = elgg_get_logged_in_user_entity();
        if (!$user) {
            return [
                "total" => 0,
                "notifications" => []
            ];
        }

        $limit = (int) ($args["limit"] ?: 20);
        $offset = (int) ($args["offset"] ?: 0);

        $sql = "SELECT * FROM {$dbprefix}notifications WHERE user_guid = {$user->guid} AND site_guid = {$site->guid} ORDER BY id DESC LIMIT {$offset}, {$limit}";

        $result = get_data_row("SELECT COUNT(*) AS total FROM {$dbprefix}notifications WHERE user_guid = {$user->guid} AND site_guid = {$site->guid}");
        $total = $result->total;

        $result = get_data_row("SELECT COUNT(*) AS total FROM {$dbprefix}notifications WHERE user_guid = {$user->guid} AND site_guid = {$site->guid} AND unread = 'yes'");
        $totalUnread = $result->total;

        $notifications = [];
        foreach (get_data($sql) as $notification) {
            $notifications[] = Mapper::getNotification($notification);
        }

        return [
            "total" => $total,
            "totalUnread" => $totalUnread,
            "edges" => $notifications
        ];
    }

    static function canChangeOwnership($object) {
        $entity = get_entity($object["guid"]);
        if (!$entity) {
            return false;
        }

        $logged_in_user = elgg_get_logged_in_user_entity();
        if (!$logged_in_user) {
            return false;
        }

        if ($logged_in_user->guid == $entity->owner_guid) {
            return true;
        }

        if ($logged_in_user->isAdmin()) {
            return true;
        }

        return false;
    }

    static function getAccessIds($object) {
        $old_guid = elgg_set_page_owner_guid($object["guid"]);

        $accessIds = [];
        foreach (get_write_access_array() as $id => $description) {
            if ($id === -2) {
                continue;
            }

            $accessIds[] = [
                "id" => $id,
                "description" => $description
            ];
        }

        elgg_set_page_owner_guid($old_guid);

        return $accessIds;
    }

    static function getDefaultAccessId($container) {
        $container = get_entity($container["guid"]);

        if ($container instanceof \ElggGroup && $container->membership === ACCESS_PRIVATE && $container->group_acl) {
            $default_access = $container->group_acl;
        } else {
            $default_access = get_default_access();
        }

        return $default_access;
    }

    static function getActivities($a, $args, $c) {
        global $CONFIG;

        $tags = $args["tags"];

        $user = elgg_get_logged_in_user_entity();
        if ($user && $tags == ["mine"]) {
            if ($user->tags) {
                if (is_array($user->tags)) {
                    $tags = $user->tags;
                } else {
                    $tags = [$user->tags];
                }
            } else {
                $tags = [];
            }
        }

        list ($joins, $wheres) = Helpers::getTagFilterJoin($tags);

        $options = [
            "type" => "object",
            "subtype" => ["news", "blog", "question", "discussion", "thewire"],
            "offset" => (int) $args["offset"],
            "limit" => (int) $args["limit"],
            "joins" => $joins,
            "wheres" => $wheres
        ];

        if ($args["containerGuid"]) {
            $options["container_guid"] = (int) $args["containerGuid"];
        }

        $result = [
            "total" => elgg_get_entities_from_metadata(array_merge($options, ["count" => true])),
            "entities" => elgg_get_entities_from_metadata($options)
        ];

        if ((int) $args["offset"] === 0) {
            $featured = Helpers::getFeaturedEntity($options, $tags);
        }

        $activities = [];

        if ($featured) {
            $activities[] = [
                "guid" => "activity:" . $featured->guid,
                "type" => "create",
                "object" => $featured,
                "isHighlighted" => true
            ];
        }

        foreach ($result["entities"] as $object) {
            $object = get_entity($object->guid);
            $subject = $object->getOwnerEntity();

            if (!$object || !$subject) {
                continue;
            }

            if ($featured && $object->guid === $featured->guid) {
                continue;
            }

            $activities[] = array(
                "guid" => "activity:" . $object->guid,
                "type" => "create",
                "object" => $object
            );
        }

        return [
            "total" => $result["total"],
            "edges" => $activities
        ];
    }

    static function getRecommended($a, $args, $c) {
        $options = [
            "type" => "object",
            "metadata_name" => "isRecommended",
            "metadata_value" => "1",
            "offset" => (int) $args["offset"],
            "limit" => (int) $args["limit"]
        ];

        $entities = [];
        foreach (elgg_get_entities_from_metadata($options) as $entity) {
            $entities[] = [
                "guid" => $entity->guid,
                "type" => $entity->type,
                "subtype" => $entity->getSubtype(),
                "title" => $entity->title,
                "description" => $entity->description,
                "ownerGuid" => $entity->owner_guid,
                "url" => Helpers::getURL($entity),
                "timeCreated" => $entity->time_created,
                "timeUpdated" => $entity->time_updated
            ];
        }

        return [
            "total" => elgg_get_entities_from_metadata(array_merge($options, ["count" => true])),
            "edges" => $entities
        ];
    }

    static function getTrending($a, $args, $c) {
        $options = array(
            "annotation_name" => "vote",
            "annotation_value" => 1,
            "order_by" => "n_table.time_created desc",
            "limit" => 250
        );

        $tagLikes = [];
        $annotations = elgg_get_annotations($options);
        foreach ($annotations as $annotation) {
            $tags = $annotation->getEntity()->tags;
            if (!$tags) {
                continue;
            }

            if (!is_array($tags)) {
                $tags = [$tags];
            }

            foreach ($tags as $tag) {
                if ($tagLikes[$tag]) {
                    $tagLikes[$tag] += 1;
                } else {
                    $tagLikes[$tag] = 1;
                }
            }
        }

        arsort($tagLikes);
        $tagLikes = array_slice($tagLikes, 0, 3);

        $return = [];
        foreach ($tagLikes as $tag => $likes) {
            $return[] = [
                "tag" => $tag,
                "likes" => $likes
            ];
        }

        return $return;
    }

    static function getTop($a, $args, $c) {
        $options = array(
            "annotation_name" => "vote",
            "annotation_value" => 1,
            "order_by" => "n_table.time_created desc",
            "limit" => 250
        );

        $topUsers = [];
        $annotations = elgg_get_annotations($options);
        foreach ($annotations as $annotation) {
            $ownerGuid = $annotation->getEntity()->owner_guid;
            if (!$ownerGuid || $ownerGuid == 0) {
                continue;
            }

            if ($topUsers[$ownerGuid]) {
                $topUsers[$ownerGuid] += 1;
            } else {
                $topUsers[$ownerGuid] = 1;
            }
        }

        arsort($topUsers);

        $topUsers = array_slice($topUsers, 0, 3, true);

        $return = [];
        foreach ($topUsers as $userGuid => $likes) {
            $entity = get_entity($userGuid);

            if (!$entity) {
                continue;
            }

            $return[] = [
                "user" => Mapper::getUser($entity),
                "likes" => $likes
            ];
        }

        return $return;
    }

    static function getUsersOnline($site) {
        global $CONFIG;

        $time = time() - 600;
        $site = elgg_get_site_entity();

        return elgg_get_entities(array(
            "type" => "user",
            "count" => true,
            "joins" => [
                    "join {$CONFIG->dbprefix}users_entity u on e.guid = u.guid",
                    "join {$CONFIG->dbprefix}entity_relationships r ON e.guid = r.guid_one AND relationship = 'member_of_site'"
            ],
            "wheres" => [
                "u.last_action >= {$time}",
                "r.guid_two = {$site->guid}"
            ]
        ));
    }

    static function getEntity($a, $args, $c) {
        $guid = (int) $args["guid"];
        $username = $args["username"];

        if ($guid) {
            $entity = get_entity($guid);
        } elseif ($username) {
            $entity = get_user_by_username($username);
        }

        if (!$entity) {
            return [
                "guid" => $guid,
                "type" => "object",
                "status" => 404
            ];
        }

        if ($entity instanceof \ElggGroup) {
            return Mapper::getGroup($entity);
        }

        if ($entity instanceof \ElggUser) {
            return Mapper::getUser($entity);
        }

        if ($entity instanceof \ElggObject) {
            Helpers::addView($entity);

            $subtype = $entity->getSubtype();
            switch ($subtype) {
                case "page":
                case "static":
                    return Mapper::getPage($entity);
                case "page_widget":
                    return Mapper::getWidget($entity);
                default:
                    return Mapper::getObject($entity);
            }
        }
    }

    static function canWriteToContainer($a, $args, $c) {
        if ($args["containerGuid"]) {
            $container = get_entity($args["containerGuid"]);
            if (!$container) {
                throw new Exception("could_not_find");
            }

            return $container->canWriteToContainer(0, $args["type"], $args["subtype"]);
        }

        $user = elgg_get_logged_in_user_entity();
        if (!$user) {
            return false;
        }

        return $user->canWriteToContainer(0, $args["type"], $args["subtype"]);
    }

    static function countComments($object) {
        $total_comments = elgg_get_entities([
            "type" => "object",
            "subtypes" => ["comment", "answer"],
            "container_guid" => (int) $object["guid"],
            "count" => true
        ]);

        $total_annotations = elgg_get_annotations([
            "guid" => (int) $object["guid"],
            "annotation_names" => ["group_topic_post", "generic_comment"],
            "count" => true
        ]);

        return $total_comments + $total_annotations;
    }

    static function getMembers($a, $args, $c) {
        $dbprefix = elgg_get_config("dbprefix");
        $group = get_entity($a["guid"]);

        if (!$group || !$group instanceof \ElggGroup) {
            throw new Exception("could_not_find");
        }

        $offset = (int) $args["offset"] ? (int) $args["offset"] : 0;
        $limit = (int) $args["limit"] ? (int) $args["limit"] : 10;

        $options = [
            "relationship" => "member",
            "relationship_guid" => $group->guid,
            "inverse_relationship" => true,
            "joins" => ["JOIN {$dbprefix}users_entity ue ON e.guid = ue.guid"],
            "order_by" => "ue.name",
            "type" => "user",
            "limit" => $limit,
            "offset" => $offset
        ];

        if ($args["q"]) {
            $q = sanitize_string($args["q"]);
            $options["wheres"] = "ue.name LIKE '{$q}%'";

            $total = elgg_get_entities_from_relationship(array_merge(
                $options,
                ["count" => true]
            ));
        } else {
            $result = get_data_row("SELECT COUNT(guid_one) AS total FROM {$dbprefix}entity_relationships WHERE relationship = 'member' AND guid_two = {$group->guid}");
            $total = $result->total;
        }

        if ($group->membership === ACCESS_PRIVATE && !$group->canEdit() && !$group->isMember())  {
            return [
                "total" => $total,
                "canWrite" => false,
                "edges" => []
            ];
        }

        $admins = elgg_get_entities_from_relationship([
            "relationship" => "group_admin",
            "relationship_guid" => $group->guid,
            "inverse_relationship" => true,
            "type" => "user",
            "limit" => 0
        ]);

        $members = [];
        foreach (elgg_get_entities_from_relationship($options) as $member) {
            if ($member->guid == $group->owner_guid) {
                $role = "owner";
            } else if (in_array($member, $admins)) {
                $role = "admin";
            } else {
                $role = "member";
            }

            $members[] = [
                "role" => $role,
                "user" => Mapper::getUser($member)
            ];
        }

        return [
            "total" => $total,
            "canWrite" => false,
            "edges" => $members
        ];
    }

    static function getAttendees($a, $args, $c) {
        $entity = get_entity($a["guid"]);
        if (!$entity || !$entity->getSubtype() === "event") {
            return [
                "total" => 0,
                "totalMaybe" => 0,
                "totalReject" => 0,
                "edges" => []
            ];
        }

        switch ($args["state"]) {
            case "accept":
                $relationship = "event_attending";
                break;
            case "maybe":
                $relationship = "event_maybe";
                break;
            case "reject":
                $relationship = "event_reject";
                break;
            default:
                $relationship = "event_attending";
                break;
        }

        $options = [
            "type" => "user",
            "relationship" => $relationship,
            "relationship_guid" => $entity->guid,
            "inverse_relationship" => true
        ];

        $total = elgg_get_entities_from_relationship(array_merge($options, ["count" => true]));
        $totalMaybe = elgg_get_entities_from_relationship(array_merge($options, ["relationship" => "event_maybe", "count" => true]));
        $totalReject = elgg_get_entities_from_relationship(array_merge($options, ["relationship" => "event_reject", "count" => true]));

        $attendees = elgg_get_entities_from_relationship($options);

        $edges = [];
        foreach ($attendees as $attendee) {
            $edges[] = Mapper::getUser($attendee);
        }

        return [
            "total" => $total,
            "totalMaybe" => $totalMaybe,
            "totalReject" => $totalReject,
            "edges" => $edges
        ];
    }

    static function getAttending($a, $args, $c) {
        $entity = get_entity($a["guid"]);
        if (!$entity || !$entity->getSubtype() === "event") {
            return null;
        }

        $user = elgg_get_logged_in_user_entity();
        if (!$user) {
            return null;
        }

        if (check_entity_relationship($user->guid, "event_attending", $entity->guid)) {
            return "accept";
        }

        if (check_entity_relationship($user->guid, "event_maybe", $entity->guid)) {
            return "maybe";
        }

        if (check_entity_relationship($user->guid, "event_reject", $entity->guid)) {
            return "reject";
        }
    }

    static function getInvite($a, $args, $c) {
        $dbprefix = elgg_get_config("dbprefix");
        $site = elgg_get_site_entity();

        $offset = (int) $args["offset"] || 0;
        $limit = (int) $args["limit"] || 10;

        $group = get_entity($a["guid"]);

        if (!$group->canEdit()) {
            return [ "total" => 0, "edges" => [] ];
        }

        $options = [
            "type" => "user",
            "site_guids" => false,
            "relationship" => "member_of_site",
            "relationship_guid" => $site->guid,
            "inverse_relationship" => true
        ];

        if ($args["q"]) {
            $q = sanitize_string($args["q"]);
            $options["joins"] = "JOIN {$dbprefix}users_entity ue ON e.guid = ue.guid";
            $options["wheres"] = "ue.name LIKE '{$q}%'";
        }

        $total = elgg_get_entities_from_relationship(array_merge($options, ["count" => true]));
        $users = elgg_get_entities_from_relationship($options);

        $invite = [];
        foreach ($users as $user) {
            $invite[] = [
                "invited" => check_entity_relationship($group->guid, "invited", $user->guid),
                "user" => Mapper::getUser($user)
            ];
        }

        return [
            "total" => $total,
            "edges" => $invite
        ];
    }

    static function getInvited($a, $args, $c) {
        $dbprefix = elgg_get_config("dbprefix");
        $site = elgg_get_site_entity();

        $offset = (int) $args["offset"] || 0;
        $limit = (int) $args["limit"] || 10;

        $group = get_entity($a["guid"]);

        if (!$group || !$group->canEdit()) {
            return [ "total" => 0, "edges" => [] ];
        }

        $options = [
            "guid" => $group->guid,
            "annotation_names" => "email_invitation",
            "offset" => $args["offset"] ? (int) $args["offset"] : 0,
            "limit" => $args["limit"] ? (int) $args["limit"] : 0,
            "order_by" => "id DESC"
        ];

        $total = elgg_get_annotations(array_merge($options, ["count" => true]));

        $invites = [];
        foreach (elgg_get_annotations($options) as $invite) {
            $code = explode("|", $invite->value);

            $user = get_user_by_email($code[1]);
            if ($user) {
                $user = Mapper::getUser($user[0]);
                $email = null;
            } else {
                $user = null;
                $email = $code[1];
            }

            $invites[] = [
                "id" => $invite->id,
                "invited" => true,
                "timeCreated" => date("c", $invite->time_created),
                "user" => $user,
                "email" => $email
            ];
        }

        return [
            "total" => $total,
            "edges" => $invites
        ];
    }

    static function getMembershipRequests($a, $args, $c) {
        $group = get_entity($a["guid"]);

        if (!$group || !$group->canEdit()) {
            return [ "total" => 0, "edges" => [] ];
        }

        $options = [
            "type" => "user",
            "relationship_guid" => $group->guid,
            "relationship" => "membership_request",
            "inverse_relationship" => true
        ];

        $edges = [];
        foreach (elgg_get_entities_from_relationship($options) as $user) {
            $edges[] = Mapper::getUser($user);
       }

        return [
            "total" => elgg_get_entities_from_relationship(array_merge($options, ["count" => true])),
            "edges" => $edges
        ];
    }

    static function getComments($object) {
        $entities = elgg_get_entities([
            "type" => "object",
            "subtypes" => ["comment", "answer"],
            "container_guid" => (int) $object["guid"],
            "limit" => 0
        ]);

        $annotations = elgg_get_annotations([
            "guid" => (int) $object["guid"],
            "annotation_names" => ["group_topic_post", "generic_comment"],
            "limit" => 0
        ]);

        if (!$entities) {
            $entities = [];
        }

        if (!$annotations) {
            $annotations = [];
        }

        $comments = array_merge($entities, $annotations);

        usort($comments, function($a, $b) {
            return ($a->time_created > $b->time_created) ? -1 : 1;
        });

        $mapped_comments = [];
        foreach ($comments as $comment) {
            $mapped_comments[] = Mapper::getComment($comment);
        }

        return $mapped_comments;
    }

    static function getRows($entity) {
        $options = [
            "container_guid" => (int) $entity["guid"],
            "type" => "object",
            "subtype" => "row",
            "order_by" => "e.guid",
            "limit" => false
        ];

        $rows = [];
        foreach(elgg_get_entities($options) as $row) {
            $rows[] = Mapper::getRow($row);
        }

        return $rows;
    }

    static function getWidgets($entity) {
        $options = array(
            "container_guid" => (int) $entity["guid"],
            "type" => "object",
            "subtype" => "page_widget",
            "order_by" => "e.guid",
            "limit" => false
        );

        $widgets = [];
        foreach (elgg_get_entities($options) as $widget) {
            $widgets[] = Mapper::getWidget($widget);
        }

        return $widgets;
    }

    static function getUser($guid) {
        $user = get_entity($guid);
        if (!$user) {
            return [
                "guid" => 0,
                "name" => "Unknown user"
            ];
        }

        return [
            "guid" => $user->guid,
            "username" => $user->username,
            "name" => $user->name,
            "icon" => $user->getIconURL("large"),
            "url" => Helpers::getURL($user)
        ];
    }

    static function getStats($user) {
        $user = get_entity($user["guid"]);
        if (!$user || !$user instanceof \ElggUser) {
            return [];
        }

        $answers = elgg_get_entities([
            "type" => "object",
            "subtype" => "comment",
            "owner_guid" => $user->guid,
            "count" => true
        ]);

        $upvotes = elgg_get_annotations([
            "annotation_name" => "vote",
            "annotation_value" => 1,
            "annotation_owner_guid" => $user->guid,
            "count" => true
        ]);

        $downvotes = elgg_get_annotations([
            "annotation_name" => "vote",
            "annotation_value" => -1,
            "annotation_owner_guid" => $user->guid,
            "count" => true
        ]);

        $items = [
            [
                "key" => "answers",
                "name" => "Antwoorden",
                "value" => $answers ? $answers : 0
            ],
            [
                "key" => "upvotes",
                "name" => "Stemmen omhoog",
                "value" => $upvotes ? $upvotes : 0
            ],
            [
                "key" => "downvotes",
                "name" => "Stemmen omlaag",
                "value" => $downvotes ? $downvotes : 0
            ]
        ];

        return $items;
    }

    static function getProfile($user) {
        $user = get_entity($user["guid"]);
        $site = elgg_get_site_entity();

        if (!$user || !$user instanceof \ElggUser) {
            return [];
        }

        $defaultFields = [
            [ "key" => "phone", "name" => "Telefoonnummer" ],
            [ "key" => "mobile", "name" => "Mobiel nummer" ],
            [ "key" => "emailaddress", "name" => "E-mailadres" ],
            [ "key" => "site", "name" => "Website" ],
            [ "key" => "description", "name" => "Over mij" ]
        ];

        $customFields = elgg_get_plugin_setting("profile", "pleio_template") ? json_decode(elgg_get_plugin_setting("profile", "pleio_template"), true) : [];

        $allFields = array_merge($defaultFields, $customFields);

        $raw_results = elgg_get_metadata([
            "guid" => $user->guid,
            "site_guids" => $site->guid,
            "metadata_names" => array_map(function($f) { return $f["key"]; }, $allFields)
        ]);

        $metadata_by_key = [];
        foreach ($raw_results as $result) {
            $metadata_by_key[$result["name"]] = $result;
        }

        if (!isset($metadata_by_key["emailaddress"]) && $user->canEdit()) {
            $emailaddress = new \stdClass();
            $emailaddress->name = "emailaddress";
            $emailaddress->value = $user->email;
            $emailaddress->access_id = ACCESS_PRIVATE;
            $metadata_by_key["emailaddress"] = $emailaddress;
        }

        $result = [];
        foreach ($allFields as $item) {
            if (isset($metadata_by_key[$item["key"]])) {
                $item["value"] = $metadata_by_key[$item["key"]]->value;
                $item["accessId"] = $metadata_by_key[$item["key"]]->access_id;
            } else {
                $item["value"] = "";
                $item["accessId"] = ACCESS_PRIVATE;
            }

            $result[] = $item;
        }

        return $result;
    }

    static function getGroups($a, $args, $c) {
        $dbprefix = elgg_get_config("dbprefix");
        $user = elgg_get_logged_in_user_entity();

        $options = [
            "type" => "group",
            "limit" => (int) $args["limit"],
            "offset" => (int) $args["offset"],
            "joins" => []
        ];

        $msid = get_metastring_id("isFeatured");
        if ($msid) {
            $options["joins"][] = "LEFT JOIN {$dbprefix}metadata md ON e.guid = md.entity_guid AND md.name_id = {$msid}";
            $options["order_by"] = "md.name_id DESC, ge.name";
        } else {
            $options["order_by"] = "ge.name";
        }

        if ($user && $args["filter"] === "mine") {
            $options["relationship"] = "member";
            $options["relationship_guid"] = $user->guid;
            $options["joins"][] = "JOIN {$dbprefix}groups_entity ge ON e.guid = ge.guid";

            $total = elgg_get_entities_from_relationship(array_merge($options, array( "count" => true )));
            $entities = elgg_get_entities_from_relationship($options);
        } else {
            $options["joins"][] = "JOIN {$dbprefix}groups_entity ge ON e.guid = ge.guid";

            $total = elgg_get_entities(array_merge($options, array( "count" => true )));
            $entities = elgg_get_entities($options);
        }

        $edges = [];
        foreach ($entities as $entity) {
            $edges[] = Mapper::getGroup($entity);
        }

        if ($user) {
            $canWrite = $user->canWriteToContainer(0, "group");
        } else {
            $canWrite = false;
        }

        return [
            "total" => $total,
            "canWrite" => $canWrite,
            "edges" => $edges
        ];
    }

    static function getEvents($a, $args, $c) {
        $user = elgg_get_logged_in_user_entity();

        $options = array(
            "type" => "object",
            "subtype" => "event",
            "limit" => (int) $args["limit"],
            "offset" => (int) $args["offset"]
        );

        if ($args["containerGuid"]) {
            if ($args["containerGuid"] === 1) {
                $container = elgg_get_site_entity();
            } else {
                $container = get_entity($args["containerGuid"]);
            }
        }

        if ($container) {
            $options["container_guid"] = $container->guid;
        }


        $msid = get_metastring_id("start_day");
        if ($msid) {
            $dbprefix = elgg_get_config("dbprefix");

            $options["joins"] = [
                "JOIN {$dbprefix}metadata md ON e.guid = md.entity_guid",
                "JOIN {$dbprefix}metastrings msv ON md.value_id = msv.id"
            ];

            $yesterday = (int) mktime(0, 0, 0, date("n"), date("j") - 1, date("Y"));

            switch ($args["filter"]) {
                case "previous":
                    $options["wheres"] = [
                        "md.name_id = {$msid}",
                        "msv.string <= $yesterday"
                    ];
                    $options["order_by"] = "msv.string DESC";
                    break;
                case "upcoming":
                default:
                    $options["wheres"] = [
                        "md.name_id = {$msid}",
                        "msv.string > $yesterday"
                    ];
                    $options["order_by"] = "msv.string ASC";
                    break;
            }
        }

        $total = elgg_get_entities(array_merge($options, array( "count" => true )));

        $edges = [];
        foreach (elgg_get_entities($options) as $entity) {
            $edges[] = Mapper::getObject($entity);
        }

        if ($user) {
            $canWrite = $user->canWriteToContainer(0, "object", "event");
        } else {
            $canWrite = false;
        }

        return [
            "total" => $total,
            "canWrite" => $canWrite,
            "edges" => $edges
        ];
    }

    static function getEntities($a, $args, $c) {
        $dbprefix = elgg_get_config("dbprefix");

        if (!$args["type"] || !in_array($args["type"], ["group", "object"])) {
            $type = "object";
        } else {
            $type = $args["type"];
        }

        if ($type == "object") {
            if (!$args["subtype"] || $args["subtype"] == "all") {
                $subtypes = ["blog", "news", "question", "discussion", "groupforumtopic"];
            } elseif ($args["subtype"] === "file|folder") {
                $subtypes = ["file", "folder"];
            } elseif ($args["subtype"] === "discussion") {
                $subtypes = ["discussion", "groupforumtopic"];
            } elseif ($args["subtype"] === "page") {
                $subtypes = ["page", "static"];
            } elseif ($args["subtype"]) {
                $subtypes = $args["subtype"];
            }
        }

        $tags = $args["tags"];

        $user = elgg_get_logged_in_user_entity();
        if ($user && $tags == ["mine"]) {
            if ($user->tags) {
                if (is_array($user->tags)) {
                    $tags = $user->tags;
                } else {
                    $tags = [$user->tags];
                }
            } else {
                $tags = [];
            }
        }

        list ($joins, $wheres) = Helpers::getTagFilterJoin($tags);

        $options = [
            "type" => $type,
            "subtypes" => $subtypes,
            "offset" => (int) $args["offset"],
            "limit" => (int) $args["limit"],
            "joins" => $joins,
            "wheres" => $wheres
        ];

        if ($args["containerGuid"]) {
            if ($args["containerGuid"] === 1) {
                $container = elgg_get_site_entity();
            } else {
                $container = get_entity($args["containerGuid"]);
            }
        }

        if ($container) {
            $options["container_guid"] = $container->guid;
        }

        $total = elgg_get_entities_from_metadata(array_merge($options, ["count" => true]));
        $entities = elgg_get_entities_from_metadata($options);

        $result = [
            "total" => $total,
            "entities" => $entities ?: []
        ];

        if ((int) $args["offset"] === 0) {
            $featured = Helpers::getFeaturedEntity($options, $tags);
        }

        $entities = array();

        if ($featured) {
            $entities[] = Mapper::getObject($featured, true);
        }

        foreach ($result["entities"] as $entity) {
            if ($featured && $entity->guid === $featured->guid) {
                continue;
            }

            $entities[] = Mapper::getEntity($entity);
        }

        $user = elgg_get_logged_in_user_entity();

        if ($user) {
            $canWrite = $user->canWriteToContainer(0, "object", $args["subtype"]);
        } else {
            $canWrite = false;
        }

        return [
            "total" => $result["total"],
            "canWrite" => $canWrite,
            "edges" => $entities
        ];
    }

    static function getFiles($a, $args, $c) {
        $container = get_entity($args["containerGuid"]);
        if ($container) {
            list($total, $entities) = Helpers::getFolderContents($container, $args["limit"], $args["offset"], $args["orderBy"], $args["direction"], $args["filter"]);

            $edges = [];
            foreach ($entities as $entity) {
                $edges[] = Mapper::getObject($entity);
            }
        } else {
            $total = 0;
            $edges = [];
        }

        $user = elgg_get_logged_in_user_entity();
        if ($user) {
            $canWrite = $container ? $container->canWriteToContainer(0, "object", "file") : false;
        } else {
            $canWrite = false;
        }

        return [
            "total" => $total,
            "canWrite" => $canWrite,
            "edges" => $edges
        ];
    }

    static function emailOverview($user) {
        $site = elgg_get_site_entity();

        $user = get_entity($user["guid"]);
        if (!$user || !$user instanceof \ElggUser) {
            return "none";
        }

        if (!$user->canEdit()) {
            return "none";
        }

        return $user->getPrivateSetting("email_overview_{$site->guid}");
    }

    static function getEmailNotifications($user) {
        $user = get_entity($user["guid"]);
        if (!$user || !$user instanceof \ElggUser) {
            return false;
        }

        if (!$user->canEdit()) {
            return false;
        }

        $settings = get_user_notification_settings($user->guid);
        if ($settings && $settings->email) {
            return ($settings->email === "1") ? true : false;
        }

        return false;
    }

    static function getsNewsletter($user) {
        $user = get_entity($user["guid"]);
        if (!$user || !$user instanceof \ElggUser) {
            return false;
        }

        if (!$user->canEdit()) {
            return false;
        }

        $site = elgg_get_site_entity();
        return check_entity_relationship($user->guid, \NewsletterSubscription::SUBSCRIPTION, $site->guid);
    }

    static function getEmail($user) {
        $user = get_entity($user["guid"]);
        if (!$user || !$user instanceof \ElggUser) {
            return "";
        }

        if (!$user->canEdit()) {
            return "";
        }

        return $user->email;
    }

    static function isBookmarked($object) {
        if (!elgg_is_logged_in()) {
            return false;
        }

        $user = elgg_get_logged_in_user_entity();
        if (check_entity_relationship($user->guid, "bookmarked", $object['guid'])) {
            return true;
        }

        return false;
    }

    static function isFollowing($object) {
        if (!elgg_is_logged_in()) {
            return false;
        }

        $user = elgg_get_logged_in_user_entity();
        if (check_entity_relationship($user->guid, "content_subscription", $object['guid'])) {
            return true;
        }

        return false;
    }

    static function isRecommended($object) {
        $object = get_entity($object["guid"]);
        return $object->isRecommended && ($object->isRecommended == 1) ? true : false;
    }

    static function canBookmark($object) {
        if (elgg_is_logged_in()) {
            return true;
        }

        return false;
    }

    static function canComment($object) {
        if (elgg_is_logged_in()) {
            return true;
        }

        return false;
    }

    static function canVote($object) {
        if (elgg_is_logged_in()) {
            return true;
        }

        return false;
    }

    static function search($a, $args, $c) {
        $es = \ESInterface::get();

        $results = array();

        $es_results = $es->search(
            $args["q"],
            null,
            $args["type"] ?: null,
            $args["subtype"] ?: null,
            $args["limit"],
            $args["offset"],
            "",
            "",
            $args["containerGuid"]
        );

        foreach ($es_results["hits"] as $hit) {
            $results[] = Mapper::getEntity($hit);
        }

        $searchTotals = [];
        $totals = $es->search(
            $args["q"],
            null,
            null,
            null,
            null,
            null,
            "",
            "",
            $args["containerGuid"]
        );

        foreach ($totals["count_per_type"] as $type => $total) {
            if ($type === "object") {
                continue;
            }

            $searchTotals[] = [
                "subtype" => $type,
                "total" => $total
            ];
        }

        foreach ($totals["count_per_subtype"] as $subtype => $total) {
            $searchTotals[] = [
                "subtype" => $subtype,
                "total" => $total
            ];
        }

        return [
            "total" => $es_results["count"],
            "totals" => $searchTotals,
            "edges" => $results
        ];
    }

    static function getFile($a, $args, $c) {
        $guid = (int) $args["guid"];
        $file = get_entity($guid);

        return [
            "guid" => $file->guid,
            "url" => "/file/download/" . $file->guid
        ];
    }

    static function getViewer() {
        $user = elgg_get_logged_in_user_entity();
        if ($user) {
            $tags = $user->tags;
        } else {
            $tags = [];
        }

        return [
            "guid" => 0,
            "loggedIn" => elgg_is_logged_in(),
            "isAdmin" => $user ? $user->isAdmin() : false,
            "tags" => $tags
        ];
    }

    static function getViews($entity) {
        $dbprefix = elgg_get_config("dbprefix");
        $guid = (int) $entity["guid"];
        $result = get_data_row("SELECT views FROM {$dbprefix}entity_views WHERE guid={$guid}");

        if ($result) {
            return $result->views;
        }

        return 0;
    }

    static function getVotes($entity) {
        $result = elgg_get_annotations(array(
            "guid" => (int) $entity["guid"],
            "annotation_name" => "vote",
            "annotation_calculation" => "sum",
            "limit" => false
        ));

        if ($result) {
            return (int) $result;
        }

        return 0;
    }

    static function hasVoted($entity) {
        if (!elgg_is_logged_in()) {
            return false;
        }

        $user = elgg_get_logged_in_user_entity();

        $past_vote = elgg_get_annotations(array(
            "guid" => (int) $entity["guid"],
            "annotation_name" => "vote",
            "annotation_owner_guid" => (int) $user->guid,
            "limit" => 1
        ));

        if ($past_vote) {
            return true;
        }

        return false;
    }

    static function getBookmarks($a, $args, $c) {
        $user = elgg_get_logged_in_user_entity();
        $tags = $args["tags"];
        $subtype = $args["subtype"];

        if ($user) {
            $options = [
                "relationship_guid" => $user->guid,
                "relationship" => "bookmarked",
                "offset" => (int) $args["offset"],
                "limit" => (int) $args["limit"],
                "order_by" => "r.id DESC"
            ];

            if ($subtype && in_array($subtype, ["news", "question", "blog"])) {
                $options["type"] = "object";
                $options["subtype"] = $subtype;
            }

            // @todo: Elgg will generate a query that will definately not scale for large amounts of items.
            // Think we will need a seperate table to speed up tag matching
            if ($tags) {
                $options["metadata_name_value_pairs"] = [];
                foreach ($tags as $tag) {
                    $options["metadata_name_value_pairs"][] = [
                        "name" => "tags",
                        "value" => $tag
                    ];
                }
            }

            $total = elgg_get_entities_from_relationship(array_merge($options, ["count" => true]));

            $entities = [];
            foreach (elgg_get_entities_from_relationship($options) as $entity) {
                $entities[] = Mapper::getObject($entity);
            }

        } else {
            $total = 0;
            $entities = [];
        }

        return [
            "total" => $total,
            "edges" => $entities
        ];
    }

    static function inGroup($object) {
        $entity = get_entity($object["guid"]);
        if (!$entity) {
            return false;
        }

        if ($entity->getContainerEntity() instanceof \ElggGroup) {
            return true;
        }

        return false;
    }

    static function getBreadcrumb($a, $args, $c) {
        if (!$args["guid"]) {
            return [];
        }

        $entity = get_entity($args["guid"]);
        if (!$entity) {
            return [];
        }

        return Helpers::getBreadcrumb($entity);
    }

    static function hasChildren($entity) {
        $options = [
            "type" => "object",
            "subtype" => $entity->subtype,
            "container_guid" => $entity["guid"],
            "count" => true
        ];

        $result = elgg_get_entities($options);

        if ($result !== 0) {
            return true;
        }

        return false;
    }

    static function getSubgroups($group) {
        $group = get_entity($group["guid"]);
        if (!$group || !$group->canEdit()) {
            return [
                "total" => 0,
                "edges" => []
            ];
        }

        if (!$group->subpermissions) {
            return [
                "total" => 0,
                "edges" => []
            ];
        }

        $subgroups = [];
        foreach (unserialize($group->subpermissions) as $subpermission) {
            $access_collection = get_access_collection($subpermission);
            if (!$access_collection) {
                continue;
            }

            $members = [];
            foreach (get_members_of_access_collection($access_collection->id) as $member) {
                $members[] = Mapper::getUser($member);
            }

            $subgroups[] = [
                "id" => $access_collection->id,
                "name" => $access_collection->name,
                "members" => $members
            ];
        }

        usort($subgroups, function($a, $b) {
            return ($a["name"] > $b["name"]) ? -1 : 1;
        });

        return [
            "total" => count($subgroups),
            "edges" => $subgroups
        ];
    }
}