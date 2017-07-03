<?php
namespace Pleio;

class Mapper {

    static function getUser($entity) {
        return [
            "guid" => $entity->guid,
            "status" => 200,
            "ownerGuid" => $entity->owner_guid,
            "type" => $entity->type,
            "username" => $entity->username,
            "name" => $entity->name,
            "url" => Helpers::getURL($entity),
            "icon" => $entity->getIconURL("large"),
            "timeCreated" => $entity->time_created,
            "timeUpdated" => $entity->time_updated,
            "canEdit" => $entity->canEdit(),
            "tags" => Helpers::renderTags($entity->tags)
        ];
    }

    static function getGroup($entity) {
        return [
            "guid" => $entity->guid,
            "status" => 200,
            "type" => $entity->type,
            "name" => $entity->name,
            "isClosed" => ($entity->membership === ACCESS_PRIVATE) ? true : false,
            "membership" => Helpers::getGroupMembership($entity),
            "description" => $entity->description,
            "plugins" => $entity->plugins ? $entity->plugins : [],
            "url" => Helpers::getURL($entity),
            "icon" => $entity->getIconURL("large"),
            "timeCreated" => $entity->time_created,
            "timeUpdated" => $entity->time_updated,
            "canEdit" => $entity->canEdit(),
            "tags" => Helpers::renderTags($entity->tags)
        ];
    }

    static function getObject($entity, $is_highlighted = false) {
        return [
            "guid" => $entity->guid,
            "status" => 200,
            "ownerGuid" => $entity->owner_guid,
            "type" => $entity->type,
            "subtype" => $entity->getSubtype(),
            "source" => $entity->source,
            "isFeatured" => $entity->isFeatured,
            "isHighlighted" => $is_highlighted ? true : false,
            "featured" => [
                "image" => $entity->featuredIcontime ? "/mod/pleio_template/featuredimage.php?guid={$entity->guid}&lastcache={$entity->featuredIcontime}" : "",
                "positionY" => $entity->featuredPositionY ? $entity->featuredPositionY : 50,
                "video" => $entity->featuredVideo ? $entity->featuredVideo : ""
            ],
            "title" => $entity->title,
            "url" => Helpers::getURL($entity),
            "description" => $entity->description,
            "richDescription" => $entity->richDescription,
            "state" => $entity->state ? $entity->state : "NEW",
            "excerpt" => elgg_get_excerpt($entity->description),
            "timeCreated" => date("c", $entity->time_created),
            "timeUpdated" => date("c", $entity->time_updated),
            "startDate" => date("c", $entity->startDate),
            "endDate" => date("c", $entity->endDate),
            "canEdit" => $entity->canEdit(),
            "accessId" => $entity->access_id,
            "tags" => Helpers::renderTags($entity->tags)
        ];
    }

    static function getPage($entity) {
        return [
            "guid" => $entity->guid,
            "status" => 200,
            "ownerGuid" => $entity->owner_guid,
            "canEdit" => $entity->canEdit(),
            "type" => $entity->type,
            "subtype" => $entity->getSubtype(),
            "title" => $entity->title,
            "timeCreated" => $entity->timeCreated,
            "timeUpdated" => $entity->timeUpdated,
            "url" => Helpers::getURL($entity),
            "widgets" => Resolver::getWidgets($entity)
        ];
    }

    static function getWidget($entity) {
        return [
            "guid" => $entity->guid,
            "type" => $entity->widget_type ? $entity->widget_type : "Empty",
            "row" => $entity->row ? $entity->row : 1,
            "width" => $entity->width ? $entity->width : 4,
            "settings" => $entity->getPrivateSetting("settings") ? json_decode($entity->getPrivateSetting("settings")) : []
        ];
    }
}