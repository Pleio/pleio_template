<?php
namespace Pleio;

class Resolver {
    static function site($a, $args, $c) {
        $site = elgg_get_site_entity();

        return [
            "guid" => $site->guid,
            "title" => $site->title,
            "menu" => [
                ["guid" => 1, "title" => "Blog", "link" => "/blog", "inJS" => true],
                ["guid" => 2, "title" => "Nieuws", "link" => "/news", "inJS" => true],
                ["guid" => 3, "title" => "Forum", "link" => "/forum", "inJS" => true]
            ]
        ];
    }

    static function getNode($a, $args, $c) {
        $guid = (int) $args["guid"];
        return get_entity($guid);
    }

    static function getComments($object) {
        $options = array(
            "type" => "object",
            "subtype" => "comment",
            "container_guid" => (int) $object['guid']
        );

        $comments = array();
        foreach (elgg_get_entities($options) as $comment) {
            $comments[] = [
                "guid" => $comment->guid,
                "description" => $comment->description,
                "time_created" => $comment->time_created,
                "time_updated" => $comment->time_updated
            ];
        }

        return $comments;
    }

    static function getUser($object) {
        $owner = get_entity($object['owner_guid']);

        return [
            "guid" => $owner->guid,
            "name" => $owner->name,
            "icon" => $owner->getIconURL()
        ];
    }

    static function getEntities($a, $args, $c) {
        $subtype = $args["subtype"];

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

        $total = elgg_get_entities(array_merge($options, array(
            "count" => true
        )));

        $entities = array();
        foreach (elgg_get_entities($options) as $entity) {
            $entities[] = array(
                "guid" => $entity->guid,
                "owner_guid" => $entity->owner_guid,
                "title" => $entity->title,
                "description" => $entity->description,
                "time_created" => $entity->time_created,
                "time_updated" => $entity->time_updated
            );
        }

        return [
            "total" => $total,
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