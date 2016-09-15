<?php
namespace Pleio;

class Resolver {

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