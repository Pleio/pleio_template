<?php
namespace Pleio;

class Resolver {
    static function getSite($a, $args, $c) {
        $site = elgg_get_site_entity();

        $accessIds = [];
        foreach (get_write_access_array() as $id => $description) {
            $accessIds[] = [
                "id" => $id,
                "description" => $description
            ];
        }

        return [
            "guid" => $site->guid,
            "title" => $site->title,
            "menu" => [
                ["guid" => "menu:" . 1, "title" => "Blog", "link" => "/blog", "js" => true],
                ["guid" => "menu:" . 2, "title" => "Nieuws", "link" => "/news", "js" => true],
                ["guid" => "menu:" . 3, "title" => "Forum", "link" => "/questions", "js" => true]
            ],
            "accessIds" => $accessIds,
            "defaultAccessId" => get_default_access()
        ];
    }

    static function getActivities($a, $args, $c) {
        global $CONFIG;

        $tags = $args["tags"];

        $bools = [
            ["term" => [ "type" => "object" ]],
            ["term" => [ "site_guid" => $CONFIG->site_guid ]]
        ];

        foreach ($tags as $tag) {
            $bools[] = ["term" => [ "tags" => $tag ]];
        }

        $user = elgg_get_logged_in_user_guid();
        $ignore_access = elgg_check_access_overrides($user);
        if ($ignore_access != true && !elgg_is_admin_logged_in()) {
            $bools[] = ["terms" => [ "access_id" => get_access_array() ]];
        }

        $results = \ESInterface::get()->client->search([
            "index" => $CONFIG->elasticsearch_index,
            "body" => [
                "query" => [
                    "bool" => [
                        "must" => $bools
                    ]
                ],
                "from" => (int) $args["offset"],
                "size" => (int) $args["limit"],
                "sort" => [
                    "time_created" => "desc"
                ]
            ]
        ]);

        $total = $results['hits']['total'];

        $activities = array();
        foreach ($results['hits']['hits'] as $hit) {
            $object = get_entity($hit['_id']);

            if (!$object) {
                continue;
            }

            $subject = $object->getOwnerEntity();
            if ($object && $subject) {
                $activities[] = array(
                    "guid" => "activity:" . $object->guid,
                    "type" => "create",
                    "object_guid" => $object->guid
                );
            }
        }

        return [
            "total" => $total,
            "activities" => $activities
        ];
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

        if ($entity instanceof \ElggUser) {
            return [
                "guid" => $entity->guid,
                "ownerGuid" => $entity->owner_guid,
                "status" => 200,
                "type" => $entity->type,
                "username" => $entity->username,
                "name" => $entity->name,
                "url" => $entity->getURL(),
                "icon" => $entity->getIconURL("large"),
                "timeCreated" => $entity->time_created,
                "timeUpdated" => $entity->time_updated,
                "canEdit" => $entity->canEdit(),
                "tags" => Helpers::renderTags($entity->tags)
            ];
        }

        if ($entity instanceof \ElggObject) {
            return [
                "guid" => $guid,
                "ownerGuid" => $entity->owner_guid,
                "status" => 200,
                "type" => $entity->type,
                "subtype" => $entity->getSubtype(),
                "source" => $entity->source,
                "isFeatured" => $entity->isFeatured ? true : false,
                "featuredImage" => $entity->featuredIcontime ? "/mod/pleio_template/featuredimage.php?guid={$entity->guid}&lastcache={$entity->featuredIcontime}" : "",
                "title" => $entity->title,
                "url" => $entity->getURL(),
                "description" => $entity->description,
                "excerpt" => elgg_get_excerpt($entity->description),
                "timeCreated" => date("c", $entity->time_created),
                "timeUpdated" => date("c", $entity->time_updated),
                "canEdit" => $entity->canEdit(),
                "accessId" => $entity->access_id,
                "tags" => Helpers::renderTags($entity->tags)
            ];
        }
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
                "timeCreated" => date("c", $entity->time_created),
                "timeUpdated" => date("c", $entity->time_updated)
            ];
        }

        return $comments;
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
            "url" => $user->getURL()
        ];
    }

    static function getStats($user) {
        $user = get_entity($user["guid"]);
        if (!$user || !$user instanceof \ElggUser) {
            return [];
        }

        $items = [
            [
                "key" => "answers",
                "name" => "Antwoorden",
                "value" => $user->countObjects("comment")
            ],
            [
                "key" => "upvotes",
                "name" => "Stemmen omhoog",
                "value" => Helpers::countAnnotations($user, "vote", 1)
            ],
            [
                "key" => "downvotes",
                "name" => "Stemmen omlaag",
                "value" => Helpers::countAnnotations($user, "vote", -1)
            ]
        ];

        return $items;
    }

    static function getProfile($user) {
        $user = get_entity($user["guid"]);
        if (!$user || !$user instanceof \ElggUser) {
            return [];
        }

        $defaultItems = [
            [ "key" => "phone", "name" => "Telefoonnummer" ],
            [ "key" => "mobile", "name" => "Mobiel nummer" ],
            [ "key" => "emailaddress", "name" => "E-mailadres" ],
            [ "key" => "site", "name" => "Website" ],
            [ "key" => "sector", "name" => "Onderwijssector" ],
            [ "key" => "school", "name" => "School" ],
            [ "key" => "description", "name" => "Over mij" ]
        ];

        $result = [];
        foreach ($defaultItems as $item) {
            $result[] = [
                "key" => $item["key"],
                "name" => $item["name"],
                "value" => $user->$item["key"] ? $user->$item["key"] : ""
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
        $subtype = $args["subtype"];
        $tags = $args["tags"];

        if (!in_array($subtype, array("blog", "news", "question"))) {
            $subtype = "news";
        }

        $options = array(
            "type" => "object",
            "subtype" => $subtype,
            "limit" => (int) $args["limit"],
            "offset" => (int) $args["offset"],
            "order_by" => "e.guid DESC"
        );

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

        $total = elgg_get_entities_from_metadata(array_merge($options, array(
            "count" => true
        )));

        $entities = array();
        foreach (elgg_get_entities_from_metadata($options) as $entity) {
            $entities[] = array(
                "guid" => $entity->guid,
                "status" => 200,
                "ownerGuid" => $entity->owner_guid,
                "isFeatured" => $entity->isFeatured ? true : false,
                "featuredImage" => $entity->featuredIcontime ? "/mod/pleio_template/featuredimage.php?guid={$entity->guid}&lastcache={$entity->featuredIcontime}" : "",
                "title" => $entity->title,
                "type" => $entity->type,
                "description" => $entity->description,
                "excerpt" => elgg_get_excerpt($entity->description),
                "timeCreated" => date("c", $entity->time_created),
                "timeUpdated" => date("c", $entity->time_updated),
                "tags" => Helpers::renderTags($entity->tags)
            );
        }

        $site = elgg_get_site_entity();

        return [
            "total" => $total,
            "canWrite" => $site->canWriteToContainer(0, "object", $subtype),
            "entities" => $entities
        ];
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

    static function search($a, $args, $c) {
        $es = \ESInterface::get();

        $results = array();
        $es_results = $es->search($args["q"], null, $args["type"], $args["subtype"], $args["limit"], $args["offset"]);
        foreach ($es_results['hits'] as $hit) {
            $results[] = [
                "guid" => $hit->guid,
                "ownerGuid" => $hit->owner_guid,
                "status" => 200,
                "type" => $hit->type,
                "subtype" => $hit->getSubtype(),
                "isFeatured" => $hit->isFeatured ? true : false,
                "featuredImage" => $hit->featuredIcontime ? "/mod/pleio_template/featuredimage.php?guid={$hit->guid}&lastcache={$hit->featuredIcontime}" : "",
                "title" => $hit->title,
                "url" => $hit->getURL(),
                "description" => $hit->description,
                "excerpt" => elgg_get_excerpt($hit->description),
                "timeCreated" => date("c", $hit->time_created),
                "timeUpdated" => date("c", $hit->time_updated),
                "canEdit" => $hit->canEdit(),
                "accessId" => $hit->access_id,
                "tags" => Helpers::renderTags($hit->tags)
            ];
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
            "totals" => $searchTotals,
            "results" => $results
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
                $entities[] = [
                    "guid" => $entity->guid,
                    "ownerGuid" => $entity->owner_guid,
                    "title" => $entity->title,
                    "type" => $entity->type,
                    "subtype" => $entity->getSubtype(),
                    "isFeatured" => $entity->isFeatured ? true : false,
                    "featuredImage" => $entity->featuredIcontime ? "/mod/pleio_template/featuredimage.php?guid={$entity->guid}&lastcache={$entity->featuredIcontime}" : "",
                    "description" => $entity->description,
                    "timeCreated" => date("c", $entity->time_created),
                    "timeUpdated" => date("c", $entity->time_updated),
                    "tags" => Helpers::renderTags($entity->tags)
                ];
            }
        } else {
            $total = 0;
            $entities = [];
        }

        return [
            "total" => $total,
            "entities" => $entities
        ];
    }
}