<?php
namespace Pleio;

class Resolver {
    static function site($a, $args, $c) {
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
                ["guid" => 1, "title" => "Blog", "link" => "/blog", "js" => true],
                ["guid" => 2, "title" => "Nieuws", "link" => "/news", "js" => true],
                ["guid" => 3, "title" => "Forum", "link" => "/forum", "js" => true]
            ],
            "accessIds" => $accessIds,
            "defaultAccessId" => get_default_access()
        ];
    }

    static function getObject($a, $args, $c) {
        $guid = (int) $args["guid"];
        $entity = get_entity($guid);

        if (!$entity) {
            return;
        }

        return [
            "guid" => $guid,
            "title" => $entity->title,
            "description" => $entity->description,
            "timeCreated" => date("c", $entity->time_created),
            "timeUpdated" => date("c", $entity->time_updated),
            "canEdit" => $entity->canEdit(),
            "accessId" => $entity->access_id,
            "tags" => Helpers::renderTags($entity->tags)
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
                "description" => $entity->description,
                "time_created" => $entity->time_created,
                "time_updated" => $entity->time_updated
            ];
        }

        return $comments;
    }

    static function getUser($object) {
        $owner = get_entity($object['ownerGuid']);

        return [
            "guid" => $owner->guid,
            "name" => $owner->name,
            "icon" => $owner->getIconURL()
        ];
    }

    static function getEntities($a, $args, $c) {
        $subtype = $args["subtype"];
        $tags = $args["tags"];

        if (!in_array($subtype, array("news"))) {
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
                "ownerGuid" => $entity->owner_guid,
                "title" => $entity->title,
                "description" => $entity->description,
                "timeCreated" => $entity->time_created,
                "timeUpdated" => $entity->time_updated,
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

    static function search($a, $args, $c) {
        $searchResult = \ESInterface::get()->search($args['q']);

        $results = array();
        foreach ($searchResult['hits'] as $hit) {
            $results[] = array(
                "guid" => $hit->guid,
                "title" => $hit->title ? $hit->title : $hit->name,
                "url" => $hit->getURL()
            );
        }

        return [
            "total" => $searchResult['count'],
            "results" => $results
        ];
    }

    static function getViewer() {
        $entity = elgg_get_logged_in_user_entity();

        return [
            "id" => 0,
            "loggedIn" => elgg_is_logged_in(),
            "username" => $entity ? $entity->username : "",
            "name" => $entity ? $entity->name : ""
        ];
    }
}