<?php
namespace Pleio;

class Resolver {
    static function getSite($a, $args, $c) {
        $site = elgg_get_site_entity();
        $user = elgg_get_logged_in_user_entity();

        $showLogo = (elgg_get_plugin_setting("show_logo", "pleio_template") === "yes") ? true : false;
        $showLeader = (elgg_get_plugin_setting("show_leader", "pleio_template") === "yes") ? true : false;
        $showInitiative = (elgg_get_plugin_setting("show_initiative", "pleio_template") === "yes") ? true : false;

        $menu = json_decode(elgg_get_plugin_setting("menu", "pleio_template"));
        if (!$menu) {
            $menu = [];
        }

        $profile = json_decode(elgg_get_plugin_setting("profile", "pleio_template"));
        if (!$profile) {
            $profile = [];
        }

        $filters = json_decode(elgg_get_plugin_setting("filters", "pleio_template"));
        if (!$filters) {
            $filters = [];
        }

        $initiatorLink = elgg_get_plugin_setting("initiator_link", "pleio_template");

        $theme = elgg_get_plugin_setting("theme", "pleio_template", "leraar");

        $footer = json_decode(elgg_get_plugin_setting("footer", "pleio_template"));
        if (!$footer) {
            $footer = [];
        }

        if ($user && Helpers::isUser()) {
            if (Helpers::canJoin()) {
                Helpers::addUser();
            }
        }

        $accessIds = [];
        foreach (get_write_access_array() as $id => $description) {
            $accessIds[] = [
                "id" => $id,
                "description" => $description
            ];
        }

        $externalLogin = elgg_is_active_plugin("pleio") ? true : false;

        return [
            "guid" => $site->guid,
            "name" => $site->name,
            "menu" => $menu,
            "profile" => $profile,
            "theme" => $theme,
            "footer" => $footer,
            "logo" => "/mod/pleio_template/logo.php?lastcache={$site->logotime}",
            "showLogo" => $showLogo,
            "initiatorLink" => $initiatorLink,
            "showLeader" => $showLeader,
            "showInitiative" => $showInitiative,
            "externalLogin" => $externalLogin,
            "accessIds" => $accessIds,
            "filters" => $filters,
            "style" => Resolver::getStyle(),
            "defaultAccessId" => get_default_access()
        ];
    }

    static function getStyle() {
        return [
            "colorPrimary" => elgg_get_plugin_setting("color_primary", "pleio_template"),
            "colorSecondary" => elgg_get_plugin_setting("color_secondary", "pleio_template"),
            "colorTertiary" => elgg_get_plugin_setting("color_tertiary", "pleio_template"),
            "colorQuaternary" => elgg_get_plugin_setting("color_quaternary", "pleio_template")
        ];
    }

    static function getActivities($a, $args, $c) {
        global $CONFIG;

        $tags = $args["tags"];

        if ($tags == ["mine"]) {
            $user = elgg_get_logged_in_user_entity();
            if ($user && $user->tags) {
                if (is_array($user->tags)) {
                    $tags = $user->tags;
                } else {
                    $tags = [$user->tags];
                }
            }

            $result = Helpers::getEntitiesFromTags(["news", "blog", "question"], $tags, (int) $args["offset"], (int) $args["limit"]);
        } else {
            $options = [
                "type" => "object",
                "subtype" => ["news", "blog", "question"],
                "offset" => (int) $args["offset"],
                "limit" => (int) $args["limit"]
            ];

            if ($args["containerGuid"]) {
                $options["container_guid"] = (int) $args["containerGuid"];
            }

            if ($tags) {
                $options["metadata_name_value_pairs"] = [];
                foreach ($tags as $tag) {
                    $options["metadata_name_value_pairs"][] = [
                        "name" => "tags",
                        "value" => $tag
                    ];
                }
            }

            $result = [
                "total" => elgg_get_entities_from_metadata(array_merge($options, ["count" => true])),
                "entities" => elgg_get_entities_from_metadata($options)
            ];
        }

        if ((int) $args["offset"] === 0) {
            $featured = Helpers::getFeaturedEntity($options, $tags);
        }

        $activities = array();

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
            if ($object && $subject) {
                if ($featured && $object->guid === $featured->guid) {
                    continue;
                }

                $activities[] = array(
                    "guid" => "activity:" . $object->guid,
                    "type" => "create",
                    "object" => $object
                );
            }
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
        $options = array(
            "type" => "object",
            "subtype" => "comment",
            "container_guid" => (int) $object["guid"],
            "count" => true
        );

        return elgg_get_entities($options);
    }

    static function getMembers($a, $args, $c) {
        $dbprefix = elgg_get_config("dbprefix");
        $group = get_entity($a["guid"]);

        if (!$group) {
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
            "offset" => $offset,

        ];

        if ($args["q"]) {
            $q = sanitize_string($args["q"]);
            $options["wheres"] = "ue.name LIKE '{$q}%'";
        }

        if ($group->membership === ACCESS_PRIVATE && !$group->canEdit() && !$group->isMember())  {
            return [
                "total" => $group->getMembers($limit, $offset, true),
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

        $owner = $group->getOwnerEntity();
        $admins[] = $owner;

        $members = [];
        foreach (elgg_get_entities_from_relationship($options) as $member) {
            if ($member == $owner) {
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
            "total" => $group->getMembers($limit, $offset, true),
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
            throw new Exception("could_not_edit");
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
            "canWrite" => false,
            "edges" => $invite
        ];
    }

    static function getComments($object) {
        $options = array(
            "type" => "object",
            "subtype" => "comment",
            "container_guid" => (int) $object['guid']
        );

        $entities = elgg_get_entities($options);
        if (!$entities) {
            return [];
        }

        $comments = [];
        foreach ($entities as $entity) {
            $comments[] = [
                "guid" => $entity->guid,
                "ownerGuid" => $entity->owner_guid,
                "description" => $entity->description,
                "canEdit" => $entity->canEdit(),
                "timeCreated" => date("c", $entity->time_created),
                "timeUpdated" => date("c", $entity->time_updated)
            ];
        }

        return $comments;
    }

    static function getWidgets($entity) {
        $options = array(
            "type" => "object",
            "subtype" => "page_widget",
            "container_guid" => (int) $entity->guid
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

        $profile = [];
        foreach ($raw_results as $result) {
            $profile[$result["name"]] = $result["value"];
        }

        $result = [];
        foreach ($allFields as $item) {
            $result[] = [
                "key" => $item["key"],
                "name" => $item["name"],
                "value" => $profile[$item["key"]]
            ];
        }

        return $result;
    }

    static function getGroups($a, $args, $c) {
        $options = array(
            "type" => "group",
            "limit" => (int) $args["limit"],
            "offset" => (int) $args["offset"]
        );

        $total = elgg_get_entities(array_merge($options, array(
            "count" => true
        )));

        $entities = [];
        foreach (elgg_get_entities($options) as $entity) {
            $entities[] = [
                "guid" => $entity->guid,
                "name" => $entity->name,
                "timeCreated" => date("c", $entity->time_created),
                "timeUpdated" => date("c", $entity->time_updated),
                "tags" => Helpers::renderTags($entity->tags)
            ];
        }

        return [
            "total" => $total,
            "canWrite" => $site->canWriteToContainer(0, "group"),
            "entities" => $entities
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
                $subtypes = ["blog", "news", "question"];
            } elseif ($args["subtype"] === "file|folder") {
                $subtypes = ["file", "folder"];
            } elseif ($args["subtype"]) {
                $subtypes = $args["subtype"];
            }
        }

        $tags = $args["tags"];
        if ($tags == ["mine"]) {
            $user = elgg_get_logged_in_user_entity();
            if ($user && $user->tags) {
                if (is_array($user->tags)) {
                    $tags = $user->tags;
                } else {
                    $tags = [$user->tags];
                }
            }

            $result = Helpers::getEntitiesFromTags($subtype, $tags, (int) $args["offset"], (int) $args["limit"]);
        } else {
            $options = [
                "type" => $type,
                "subtypes" => $subtypes,
                "offset" => (int) $args["offset"],
                "limit" => (int) $args["limit"]
            ];

            if ($args["subtype"] === "event") {
                $msid = get_metastring_id("startDate");
                $yesterday = (int) mktime(0, 0, 0, date("n"), date("j") - 1, date("Y"));

                if ($msid) {
                    $options["joins"] = [
                        "JOIN {$dbprefix}metadata md ON e.guid = md.entity_guid",
                        "JOIN {$dbprefix}metastrings msv ON md.value_id = msv.id"
                    ];
                    $options["wheres"] = [
                        "md.name_id = {$msid}",
                        "msv.string > $yesterday"
                    ];
                    $options["order_by"] = "msv.string ASC";
                }
            }

            if ($tags) {
                $options["metadata_name_value_pairs"] = [];
                foreach ($tags as $tag) {
                    $options["metadata_name_value_pairs"][] = [
                        "name" => "tags",
                        "value" => $tag
                    ];
                }
            }

            if ($args["containerGuid"]) {
                $options["container_guid"] = (int) $args["containerGuid"];
            }

            $result = [
                "total" => elgg_get_entities_from_metadata(array_merge($options, ["count" => true])),
                "entities" => elgg_get_entities_from_metadata($options)
            ];
        }

        if ((int) $args["offset"] === 0) {
            $featured = Helpers::getFeaturedEntity($options, $tags);
        }

        $entities = array();

        if ($featured) {
            $entities[] = Mapper::getObject($featured, true);
        }

        foreach ($result["entities"] as $entity) {
            switch ($entity->type) {
                case "object":
                    if ($featured && $entity->guid === $featured->guid) {
                        continue;
                    }

                    $entities[] = Mapper::getObject($entity);
                    break;
                case "group":
                    $entities[] = Mapper::getGroup($entity);
                    break;
                case "user":
                    $entities[] = Mapper::getUser($entity);
                    break;
            }
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

    static function emailOverview($user) {
        $user = get_entity($user["guid"]);
        if (!$user || !$user instanceof \ElggUser) {
            return "none";
        }

        if (!$user->canEdit()) {
            return "none";
        }

        return $user->getPrivateSetting("email_overview");
    }

    static function getsNotificationOnReply($user) {
        $user = get_entity($user["guid"]);
        if (!$user || !$user instanceof \ElggUser) {
            return false;
        }

        if (!$user->canEdit()) {
            return false;
        }

        return $user->getPrivateSetting("notificationOnReply") ? true : false;
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

        if (!$args["type"]) {
            $args["type"] = "object";
        }

        if (!$args["subtype"] || !in_array($args["subtype"], ["blog","news","question"])) {
            $args["subtype"] = ["blog","news","question"];
        }

        $es_results = $es->search(
            $args["q"],
            null,
            $args["type"],
            $args["subtype"],
            $args["limit"],
            $args["offset"]
        );

        foreach ($es_results["hits"] as $hit) {
            $results[] = Mapper::getObject($hit);
        }

        $searchTotals = [];
        $totals = $es->search($args["q"], null, $args["type"], ["blog","news","question"]);

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
}