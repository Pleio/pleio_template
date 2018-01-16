<?php
namespace Pleio;

class Mapper {
    static function getEntity($entity) {
        if ($entity instanceof \ElggUser) {
            return Mapper::getUser($entity);
        } elseif ($entity instanceof \ElggGroup) {
            return Mapper::getGroup($entity);
        } elseif ($entity instanceof \ElggObject) {
            return Mapper::getObject($entity);
        }
    }

    static function getUser($entity) {
        return [
            "guid" => $entity->guid,
            "status" => 200,
            "ownerGuid" => $entity->owner_guid,
            "type" => $entity->type,
            "username" => $entity->username,
            "name" => html_entity_decode($entity->name, ENT_COMPAT | ENT_QUOTES, 'UTF-8'),
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
            "name" => html_entity_decode($entity->name, ENT_COMPAT | ENT_QUOTES, 'UTF-8'),
            "isClosed" => ($entity->membership === ACCESS_PRIVATE) ? true : false,
            "membership" => Helpers::getGroupMembership($entity),
            "description" => strip_tags($entity->description),
            "excerpt" => elgg_get_excerpt(html_entity_decode($entity->description, ENT_COMPAT | ENT_QUOTES, 'UTF-8'), 150),
            "introduction" => Helpers::getGroupIntroduction($entity),
            "plugins" => $entity->plugins ? $entity->plugins : [],
            "url" => Helpers::getURL($entity),
            "icon" => $entity->getIconURL("large"),
            "featured" => [
                "image" => $entity->featuredIcontime ? "/mod/pleio_template/featuredimage.php?guid={$entity->guid}&lastcache={$entity->featuredIcontime}" : "",
                "positionY" => $entity->featuredPositionY ? $entity->featuredPositionY : 50,
                "video" => $entity->featuredVideo ? $entity->featuredVideo : ""
            ],
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
            "location" => $entity->location,
            "rsvp" => $entity->rsvp ? true : false,
            "isFeatured" => $entity->isFeatured,
            "isHighlighted" => $is_highlighted ? true : false,
            "featured" => [
                "image" => Helpers::getFeaturedImage($entity),
                "positionY" => $entity->featuredPositionY ? $entity->featuredPositionY : 50,
                "video" => $entity->featuredVideo ? $entity->featuredVideo : ""
            ],
            "title" => html_entity_decode($entity->title, ENT_COMPAT | ENT_QUOTES, 'UTF-8'),
            "url" => Helpers::getURL($entity),
            "thumbnail" => $entity->getIconURL(),
            "description" => $entity->description,
            "richDescription" => $entity->richDescription,
            "mimeType" => $entity->mimetype,
            "state" => $entity->state ? $entity->state : "NEW",
            "excerpt" => elgg_get_excerpt(html_entity_decode($entity->description, ENT_COMPAT | ENT_QUOTES, 'UTF-8')),
            "timeCreated" => date("c", $entity->time_created),
            "timeUpdated" => date("c", $entity->time_updated),
            "startDate" => Helpers::getEventStartDate($entity),
            "endDate" => Helpers::getEventEndDate($entity),
            "canEdit" => $entity->canEdit(),
            "accessId" => $entity->access_id,
            "writeAccessId" => $entity->write_access_id ? $entity->write_access_id : ACCESS_PRIVATE,
            "tags" => Helpers::renderTags($entity->tags)
        ];
    }

    static function getComment($entity) {
        return [
            "guid" => $entity->guid ? $entity->guid : "annotation:" . $entity->id,
            "ownerGuid" => $entity->owner_guid,
            "description" => $entity->description ? strip_tags(html_entity_decode($entity->description, ENT_COMPAT | ENT_QUOTES, 'UTF-8')) : strip_tags(html_entity_decode($entity->value, ENT_COMPAT | ENT_QUOTES, 'UTF-8')),
            "canEdit" => $entity->canEdit(),
            "timeCreated" => date("c", $entity->time_created),
            "timeUpdated" => date("c", $entity->time_updated)
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
            "pageType" => $entity->pageType,
            "title" => $entity->title,
            "description" => $entity->description,
            "richDescription" => $entity->richDescription,
            "timeCreated" => $entity->timeCreated,
            "timeUpdated" => $entity->timeUpdated,
            "url" => Helpers::getURL($entity)
        ];
    }

    static function getRow($entity) {
        return [
            "guid" => $entity->guid,
            "type" => "object",
            "subtype" => "row",
            "layout" => $entity->layout ? $entity->layout : "full",
            "canEdit" => $entity->canEdit()
        ];
    }

    static function getWidget($entity) {
        return [
            "guid" => $entity->guid,
            "type" => $entity->widget_type ? $entity->widget_type : "Empty",
            "position" => $entity->position,
            "canEdit" => $entity->canEdit(),
            "settings" => $entity->getPrivateSetting("settings") ? json_decode($entity->getPrivateSetting("settings")) : []
        ];
    }

    static function getNotification($notification) {
        $performer = get_entity($notification->performer_guid);
        $entity = get_entity($notification->entity_guid);
        $container = get_entity($notification->container_guid);

        return [
            "id" => $notification->id,
            "action" => $notification->action,
            "performer" => $performer ? Mapper::getUser($performer) : null,
            "entity" => $entity ? Mapper::getEntity($entity) : null,
            "container" => $container ? Mapper::getEntity($container) : null,
            "isUnread" => $notification->unread === "yes" ? true : false,
            "timeCreated" => date("c", $notification->time_created)
        ];
    }
}