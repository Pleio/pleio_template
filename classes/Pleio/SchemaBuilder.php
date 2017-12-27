<?php
namespace Pleio;

use GraphQL\Type\Definition\EnumType;
use GraphQL\Type\Definition\InterfaceType;
use GraphQL\Type\Definition\InputObjectType;
use GraphQL\Type\Definition\Type;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Schema;
use GraphQLRelay\Relay;

class SchemaBuilder {
    static function build() {
        $typeEnum = new EnumType([
            "name" => "Type",
            "description" => "The type of entity",
            "values" => [
                "user" => [
                    "value" => "user"
                ],
                "group" => [
                    "value" => "group"
                ],
                "object" => [
                    "value" => "object"
                ],
                "page" => [
                    "value" => "page"
                ]
            ]
        ]);

        $groupFilterEnum = new EnumType([
            "name" => "GroupFilter",
            "description" => "Show all groups or only mine",
            "values" => [
                "all" => [ "value" => "all" ],
                "mine" => [ "value" => "mine" ]
            ]
        ]);

        $eventFilterEnum = new EnumType([
            "name" => "EventFilter",
            "description" => "Show upcoming events or previous events",
            "values" => [
                "upcoming" => [ "value" => "upcoming" ],
                "previous" => [ "value" => "previous" ]
            ]
        ]);

        $overviewEnum = new EnumType([
            "name" => "Overview",
            "values" => [
                "daily" => [ "value" => "daily" ],
                "weekly" => [ "value" => "weekly" ],
                "twoweekly" => [ "value" => "twoweekly" ],
                "monthly" => [ "value" => "monthly" ],
                "never" => [ "value" => "never" ]
            ]
        ]);

        $roleEnum = new EnumType([
            "name" => "Role",
            "description" => "The type of role.",
            "values" => [
                "owner" => [
                    "value" => "owner"
                ],
                "admin" => [
                    "value" => "admin"
                ],
                "member" => [
                    "value" => "member"
                ],
                "removed" => [
                    "value" => "removed"
                ],
            ]
        ]);

        $entityInterface = new InterfaceType([
            "name" => "Entity",
            "fields" => [
                "guid" => [
                    "type" => Type::nonNull(Type::string())
                ],
                "status" => [
                    "type" => Type::int()
                ]
            ],
            "resolveType" => function($object) use (&$userType, &$objectType, &$groupType, &$pageType) {
                switch ($object["type"]) {
                    case "user":
                        return $userType;
                    case "group":
                        return $groupType;
                    case "object":
                        switch ($object["subtype"]) {
                            case "page":
                                return $pageType;
                            default:
                                return $objectType;
                        }
                }
            }
        ]);

        $accessIdType = new ObjectType([
            "name" => "AccessId",
            "fields" => [
                "id" => [
                    "type" => Type::nonNull(Type::int())
                ],
                "description" => [
                    "type" => Type::nonNull(Type::string())
                ]
            ]
        ]);

        $fileType = new ObjectType([
            "name" => "File",
            "fields" => [
                "guid" => [
                    "type" => Type::nonNull(Type::string())
                ],
                "url" => [
                    "type" => Type::nonNull(Type::string())
                ]
            ]
        ]);

        $profileItem = new ObjectType([
            "name" => "ProfileItem",
            "fields" => [
                "key" => [
                    "type" => Type::nonNull(Type::string())
                ],
                "name" => [
                    "type" => Type::nonNull(Type::string())
                ],
                "value" => [
                    "type" => Type::string()
                ]
            ]
        ]);

        $statsItem = new ObjectType([
            "name" => "StatsItem",
            "fields" => [
                "key" => [
                    "type" => Type::nonNull(Type::string())
                ],
                "name" => [
                    "type" => Type::nonNull(Type::string())
                ],
                "value" => [
                    "type" => Type::string()
                ]
            ]
        ]);

        $widgetSetting = new ObjectType([
            "name" => "WidgetSetting",
            "fields" => [
                "key" => [
                    "type" => Type::nonNull(Type::string())
                ],
                "value" => [
                    "type" => Type::string()
                ]
            ]
        ]);

        $widgetItem = new ObjectType([
            "name" => "Widget",
            "fields" => [
                "guid" => [
                    "type" => Type::nonNull(Type::string())
                ],
                "type" => [
                    "type" => Type::nonNull(Type::string())
                ],
                "position" => [
                    "type" => Type::int()
                ],
                "settings" => [
                    "type" => Type::listOf($widgetSetting)
                ],
                "canEdit" => [
                    "type" => Type::nonNull(Type::boolean())
                ]
            ]
        ]);

        $rowItem = new ObjectType([
            "name" => "Row",
            "fields" => [
                "guid" => [
                    "type" => Type::nonNull(Type::string())
                ],
                "layout" => [
                    "type" => Type::nonNull(Type::string())
                ],
                "canEdit" => [
                    "type" => Type::nonNull(Type::boolean())
                ],
                "widgets" => [
                    "type" => Type::listOf($widgetItem),
                    "resolve" => function($object) {
                        return Resolver::getWidgets($object);
                    }
                ]
            ]
        ]);

        $featured = new ObjectType([
            "name" => "Featured",
            "fields" => [
                "video" => [
                    "type" => Type::string()
                ],
                "image" => [
                    "type" => Type::string()
                ],
                "positionY" => [
                    "type" => Type::int()
                ]
            ]
        ]);

        $pageType = new ObjectType([
            "name" => "Page",
            "interfaces" => [$entityInterface],
            "fields" => [
                "guid" => [
                    "type" => Type::nonNull(Type::string())
                ],
                "status" => [
                    "type" => Type::int()
                ],
                "canEdit" => [
                    "type" => Type::nonNull(Type::boolean())
                ],
                "title" => [
                    "type" => Type::string()
                ],
                "description" => [
                    "type" => Type::string()
                ],
                "hasChildren" => [
                    "type" => Type::boolean(),
                    "resolve" => function($object) {
                        return Resolver::hasChildren($object);
                    }
                ],
                "richDescription" => [
                    "type" => Type::string()
                ],
                "url" => [
                    "type" => Type::string()
                ],
                "timeCreated" => [
                    "type" => Type::string()
                ],
                "timeUpdated" => [
                    "type" => Type::string()
                ],
                "pageType" => [
                    "type" => Type::string()
                ],
                "rows" => [
                    "type" => Type::listOf($rowItem),
                    "resolve" => function($object) {
                        return Resolver::getRows($object);
                    }
                ]
            ]
        ]);

        $userType = new ObjectType([
            "name" => "User",
            "interfaces" => [$entityInterface],
            "fields" => [
                "guid" => [
                    "type" => Type::nonNull(Type::string())
                ],
                "status" => [
                    "type" => Type::int()
                ],
                "username" => [
                    "type" => Type::string()
                ],
                "name" => [
                    "type" => Type::string()
                ],
                "email" => [
                    "type" => Type::string(),
                    "resolve" => function($user) {
                        return Resolver::getEmail($user);
                    }
                ],
                "emailNotifications" => [
                    "type" => Type::boolean(),
                    "resolve" => function($user) {
                        return Resolver::getEmailNotifications($user);
                    }
                ],
                "getsNewsletter" => [
                    "type" => Type::boolean(),
                    "resolve" => function($user) {
                        return Resolver::getsNewsletter($user);
                    }
                ],
                "emailOverview" => [
                    "type" => $overviewEnum,
                    "resolve" => function($user) {
                        return Resolver::emailOverview($user);
                    }
                ],
                "profile" => [
                    "type" => Type::listOf($profileItem),
                    "resolve" => function($user) {
                        return Resolver::getProfile($user);
                    }
                ],
                "stats" => [
                    "type" => Type::listOf($statsItem),
                    "resolve" => function($user) {
                        return Resolver::getStats($user);
                    }
                ],
                "tags" => [
                    "type" => Type::listOf(Type::string())
                ],
                "icon" => [
                    "type" => Type::string()
                ],
                "url" => [
                    "type" => Type::string()
                ],
                "canEdit" => [
                    "type" => Type::boolean()
                ]
            ]
        ]);

        $userListType = new ObjectType([
            "name" => "UserList",
            "fields" => [
                "total" => [
                    "type" => Type::nonNull(Type::int())
                ],
                "edges" => [
                    "type" => Type::listOf($userType)
                ]
            ]
        ]);

        $attendeesListType = new ObjectType([
            "name" => "AttendeesList",
            "fields" => [
                "total" => [ "type" => Type::nonNull(Type::int()) ],
                "totalMaybe" => [ "type" => Type::nonNull(Type::int()) ],
                "totalReject" => [ "type" => Type::nonNull(Type::int()) ],
                "edges" => [ "type" => Type::listOf($userType) ]
            ]
        ]);

        $inviteType = new ObjectType([
            "name" => "Invite",
            "fields" => [
                "id" => [ "type" => Type::int() ],
                "timeCreated" => [ "type" => Type::string() ],
                "invited" => [ "type" => Type::nonNull(Type::boolean()) ],
                "user" => [ "type" => $userType ],
                "email" => [ "type" => Type::string() ]
            ]
        ]);

        $inviteListType = new ObjectType([
            "name" => "InviteList",
            "fields" => [
                "total" => [ "type" => Type::nonNull(Type::int()) ],
                "edges" => [ "type" => Type::listOf($inviteType) ]
            ]
        ]);

        $memberType = new ObjectType([
            "name" => "Member",
            "fields" => [
                "role" => [
                    "type" => $roleEnum
                ],
                "user" => [
                    "type" => $userType
                ],
                "email" => [
                    "type" => Type::string()
                ]
            ]
        ]);

        $memberListType = new ObjectType([
            "name" => "MemberList",
            "fields" => [
                "total" => [
                    "type" => Type::nonNull(Type::int())
                ],
                "edges" => [
                    "type" => Type::listOf($memberType)
                ]
            ]
        ]);

        $membershipEnum = new EnumType([
            "name" => "Membership",
            "description" => "The type of membership.",
            "values" => [
                "not_joined" => [
                    "value" => "not_joined"
                ],
                "requested" => [
                    "value" => "requested"
                ],
                "invited" => [
                    "value" => "invited"
                ],
                "joined" => [
                    "value" => "joined"
                ],
            ]
        ]);

        $pluginEnum = new EnumType([
            "name" => "Plugins",
            "description" => "The available plugins.",
            "values" => [
                "events" => [ "value" => "events" ],
                "blog" => [ "value" => "blog" ],
                "discussions" => [ "value" => "discussions" ],
                "questions" => [ "value" => "questions" ],
                "files" => [ "value" => "files" ],
                "wiki" => [ "value" => "wiki" ],
                "tasks" => [ "value" => "tasks" ]
            ]
        ]);

        $groupType = new ObjectType([
            "name" => "Group",
            "interfaces" => [$entityInterface],
            "fields" => [
                "guid" => [
                    "type" => Type::nonNull(Type::string())
                ],
                "status" => [
                    "type" => Type::int()
                ],
                "name" => [
                    "type" => Type::string()
                ],
                "description" => [
                    "type" => Type::string()
                ],
                "excerpt" => [
                    "type" => Type::string()
                ],
                "introduction" => [
                    "type" => Type::string()
                ],
                "icon" => [
                    "type" => Type::string()
                ],
                "featured" => [
                    "type" => $featured
                ],
                "url" => [
                    "type" => Type::string()
                ],
                "canEdit" => [
                    "type" => Type::boolean()
                ],
                "isClosed" => [
                    "type" => Type::boolean()
                ],
                "membership" => [
                    "type" => $membershipEnum
                ],
                "accessIds" => [
                    "type" => Type::listOf($accessIdType),
                    "resolve" => "Pleio\Resolver::getAccessIds"
                ],
                "defaultAccessId" => [
                    "type" => Type::int(),
                    "resolve" => "Pleio\Resolver::getDefaultAccessId"
                ],
                "tags" => [
                    "type" => Type::listOf(Type::string())
                ],
                "members" => [
                    "type" => $memberListType,
                    "args" => [
                        "q" => [
                            "type" => Type::string()
                        ],
                        "offset" => [
                            "type" => Type::int()
                        ],
                        "limit" => [
                            "type" => Type::int()
                        ]
                    ],
                    "resolve" => "Pleio\Resolver::getMembers"
                ],
                "invite" => [
                    "type" => $inviteListType,
                    "args" => [
                        "q" => [
                            "type" => Type::string()
                        ],
                        "offset" => [
                            "type" => Type::int()
                        ],
                        "limit" => [
                            "type" => Type::int()
                        ]
                    ],
                    "resolve" => "Pleio\Resolver::getInvite"
                ],
                "invited" => [
                    "type" => $inviteListType,
                    "args" => [
                        "q" => [
                            "type" => Type::string()
                        ],
                        "offset" => [
                            "type" => Type::int()
                        ],
                        "limit" => [
                            "type" => Type::int()
                        ]
                    ],
                    "resolve" => "Pleio\Resolver::getInvited"
                ],
                "plugins" => [
                    "type" => Type::listOf($pluginEnum)
                ]
            ]
        ]);

        $objectType = new ObjectType([
            "name" => "Object",
            "interfaces" => [$entityInterface],
            "fields" => [
                "guid" => [ "type" => Type::nonNull(Type::string()) ],
                "status" => [ "type" => Type::int() ],
                "subtype" => [ "type" => Type::string() ],
                "title" => [ "type" => Type::string() ],
                "description" => [ "type" => Type::string() ],
                "richDescription" => [ "type" => Type::string() ],
                "hasChildren" => [
                    "type" => Type::boolean(),
                    "resolve" => function($object) {
                        return Resolver::hasChildren($object);
                    }
                ],
                "inGroup" => [
                    "type" => Type::boolean(),
                    "resolve" => function($object) {
                        return Resolver::inGroup($object);
                    }
                ],
                "excerpt" => [ "type" => Type::string() ],
                "mimeType" => [ "type" => Type::string() ],
                "thumbnail" => [ "type" => Type::string() ],
                "url" => [ "type" => Type::string() ],
                "tags" => [ "type" => Type::listOf(Type::string()) ],
                "timeCreated" => [ "type" => Type::string() ],
                "timeUpdated" => [ "type" => Type::string() ],
                "startDate" => [ "type" => Type::string() ],
                "endDate" => [ "type" => Type::string() ],
                "source" => [ "type" => Type::string() ],
                "location" => [ "type" => Type::string() ],
                "rsvp" => [ "type" => Type::boolean() ],
                "isFeatured" => [ "type" => Type::boolean() ],
                "isHighlighted" => [ "type" => Type::boolean() ],
                "state" => [ "type" => Type::string() ],
                "isRecommended" => [
                    "type" => Type::boolean(),
                    "resolve" => function($object) {
                        return Resolver::isRecommended($object);
                    }
                ],
                "featured" => [ "type" => $featured ],
                "canEdit" => [ "type" => Type::boolean() ],
                "canComment" => [
                    "type" => Type::boolean(),
                    "resolve" => function($object) {
                        return Resolver::canComment($object);
                    }
                ],
                "canVote" => [
                    "type" => Type::boolean(),
                    "resolve" => function($object) {
                        return Resolver::canVote($object);
                    }
                ],
                "accessId" => [ "type" => Type::int() ],
                "writeAccessId" => [ "type" => Type::int() ],
                "isBookmarked" => [
                    "type" => Type::boolean(),
                    "resolve" => function($object) {
                        return Resolver::isBookmarked($object);
                    }
                ],
                "isFollowing" => [
                    "type" => Type::boolean(),
                    "resolve" => function($object) {
                        return Resolver::isFollowing($object);
                    }
                ],
                "canBookmark" => [
                    "type" => Type::boolean(),
                    "resolve" => function($object) {
                        return Resolver::canBookmark($object);
                    }
                ],
                "hasVoted" => [
                    "type" => Type::boolean(),
                    "resolve" => function($object) {
                        return Resolver::hasVoted($object);
                    }
                ],
                "votes" => [
                    "type" => Type::int(),
                    "resolve" => function($object) {
                        return Resolver::getVotes($object);
                    }
                ],
                "views" => [
                    "type" => Type::int(),
                    "resolve" => function($object) {
                        return Resolver::getViews($object);
                    }
                ],
                "owner" => [
                    "type" => $userType,
                    "resolve" => function($object) {
                        return Resolver::getUser($object["ownerGuid"]);
                    }
                ],
                "isAttending" => [
                    "type" => Type::string(),
                    "resolve" => "Pleio\Resolver::getAttending"
                ],
                "attendees" => [
                    "type" => $attendeesListType,
                    "args" => [
                        "offset" => [
                            "type" => Type::int()
                        ],
                        "limit" => [
                            "type" => Type::int()
                        ],
                        "state" => [
                            "type" => Type::string()
                        ]
                    ],
                    "resolve" => "Pleio\Resolver::getAttendees"
                ],
                "comments" => [
                    "type" => function() use (&$objectType) {
                        return Type::listOf($objectType);
                    },
                    "resolve" => function($object) {
                        return Resolver::getComments($object);
                    }
                ],
                "commentCount" => [
                    "type" => Type::int(),
                    "resolve" => function($object) {
                        return Resolver::countComments($object);
                    }
                ]
            ]
        ]);

        $searchTotalType = new ObjectType([
            "name" => "SearchTotal",
            "fields" => [
                "subtype" => [
                    "type" => Type::nonNull(Type::string())
                ],
                "total" => [
                    "type" => Type::nonNull(Type::int())
                ]
            ]
        ]);

        $searchListType = new ObjectType([
            "name" => "SearchList",
            "fields" => [
                "total" => [
                    "type" => Type::nonNull(Type::int())
                ],
                "totals" => [
                    "type" => Type::listOf($searchTotalType)
                ],
                "edges" => [
                    "type" => Type::listOf($entityInterface)
                ]
            ]
        ]);

        $entityListType = new ObjectType([
            "name" => "EntityList",
            "fields" => [
                "total" => [
                    "type" => Type::nonNull(Type::int())
                ],
                "canWrite" => [
                    "type" => Type::nonNull(Type::boolean())
                ],
                "edges" => [
                    "type" => Type::listOf($entityInterface)
                ]
            ]
        ]);

        $groupListType = new ObjectType([
            "name" => "GroupList",
            "fields" => [
                "total" => [
                    "type" => Type::nonNull(Type::int())
                ],
                "canWrite" => [
                    "type" => Type::nonNull(Type::boolean())
                ],
                "edges" => [
                    "type" => Type::listOf($groupType)
                ]
            ]
        ]);

        $eventListType = new ObjectType([
            "name" => "EventList",
            "fields" => [
                "total" => [
                    "type" => Type::nonNull(Type::int())
                ],
                "canWrite" => [
                    "type" => Type::nonNull(Type::boolean())
                ],
                "edges" => [
                    "type" => Type::listOf($objectType)
                ]
            ]
        ]);

        $viewerType = new ObjectType([
            "name" => "Viewer",
            "description" => "The current viewer",
            "fields" => [
                "guid" => [
                    "type" => Type::nonNull(Type::string())
                ],
                "loggedIn" => [
                    "type" => Type::nonNull(Type::boolean())
                ],
                "isAdmin" => [
                    "type" => Type::nonNull(Type::boolean())
                ],
                "tags" => [
                    "type" => Type::listOf(Type::string())
                ],
                "canWriteToContainer" => [
                    "type" => Type::nonNull(Type::boolean()),
                    "args" => [
                        "containerGuid" => [
                            "type" => Type::int()
                        ],
                        "type" => [
                            "type" => $typeEnum
                        ],
                        "subtype" => [
                            "type" => Type::string()
                        ]
                    ],
                    "resolve" => "Pleio\Resolver::canWriteToContainer"
                ],
                "user" => [
                    "type" => $userType,
                    "resolve" => function($viewer) {
                        $entity = elgg_get_logged_in_user_entity();
                        if ($entity) {
                            return Resolver::getUser($entity->guid);
                        }
                    }
                ]
            ]
        ]);

        $menuItemType = new ObjectType([
            "name" => "MenuItem",
            "fields" => [
                "title" => [
                    "type" => Type::nonNull(Type::string())
                ],
                "link" => [
                    "type" => Type::nonNull(Type::string())
                ]
            ]
        ]);

        $filterType = new ObjectType([
            "name" => "Filter",
            "fields" => [
                "name" => [
                    "type" => Type::nonNull(Type::string())
                ],
                "values" => [
                    "type" => Type::listOf(Type::string())
                ]
            ]
        ]);

        $activityTypeEnum = new EnumType([
            "name" => "ActivityType",
            "description" => "The type of activity",
            "values" => [
                "create" => [
                    "value" => "create"
                ],
                "update" => [
                    "value" => "update"
                ]
            ]
        ]);

        $activityType = new ObjectType([
            "name" => "Activity",
            "fields" => [
                "guid" => [
                    "type" => Type::nonNull(Type::string())
                ],
                "type" => [
                    "type" => Type::nonNull($activityTypeEnum),
                ],
                "object" => [
                    "type" => Type::nonNull($objectType),
                    "resolve" => function($activity) {
                        return Mapper::getObject($activity["object"], isset($activity["isHighlighted"]));
                    }
                ],
                "group" => [
                    "type" => $groupType,
                    "resolve" => function($activity) {
                        if (!$activity["object"]) {
                            return null;
                        }

                        $container = $activity["object"]->getContainerEntity();
                        if (!$container) {
                            return null;
                        }

                        if ($container instanceof \ElggGroup) {
                            return [
                                "guid" => $container->guid,
                                "name" => $container->name,
                                "url" => Helpers::getURL($container)
                            ];
                        }

                        return null;
                    }
                ]
            ]
        ]);

        $activityListType = new ObjectType([
            "name" => "ActivityList",
            "fields" => [
                "total" => [
                    "type" => Type::nonNull(Type::int())
                ],
                "edges" => [
                    "type" => Type::listOf($activityType)
                ]
            ]
        ]);

        $topType = new ObjectType([
            "name" => "TopList",
            "fields" => [
                "user" => [
                    "type" => $userType
                ],
                "likes" => [
                    "type" => Type::int()
                ]
            ]
        ]);

        $trendingType = new ObjectType([
            "name" => "TrendingList",
            "fields" => [
                "tag" => [
                    "type" => Type::string()
                ],
                "likes" => [
                    "type" => Type::int()
                ]
            ]
        ]);

        $styleType = new ObjectType([
            "name" => "StyleType",
            "fields" => [
                "colorPrimary" => [
                    "type" => Type::string()
                ],
                "colorSecondary" => [
                    "type" => Type::string()
                ],
                "colorTertiary" => [
                    "type" => Type::string()
                ],
                "colorQuaternary" => [
                    "type" => Type::string()
                ]
            ]
        ]);

        $notificationType = new ObjectType([
            "name" => "NotificationType",
            "fields" => [
                "id" => [ "type" => Type::int() ],
                "action" => [ "type" => Type::string() ],
                "performer" => [ "type" => $userType ],
                "entity" => [ "type" => $entityInterface ],
                "container" => [ "type" => $entityInterface ],
                "timeCreated" => [ "type" => Type::string() ],
                "isUnread" => [ "type" => Type::boolean() ]
            ]
        ]);

        $notificationsListType = new ObjectType([
            "name" => "NotificationsListType",
            "fields" => [
                "total" => [ "type" => Type::int() ],
                "totalUnread" => [ "type" => Type::int() ],
                "edges" => [ "type" => Type::listOf($notificationType) ]
            ]
        ]);

        $siteType = new ObjectType([
            "name" => "Site",
            "description" => "The current site",
            "fields" => [
                "guid" => [
                    "type" => Type::nonNull(Type::string())
                ],
                "name" => [
                    "type" => Type::nonNull(Type::string())
                ],
                "theme" => [
                    "type" => Type::nonNull(Type::string())
                ],
                "menu" => [
                    "type" => Type::listOf($menuItemType)
                ],
                "profile" => [
                    "type" => Type::listOf($profileItem)
                ],
                "footer" => [
                    "type" => Type::listOf($menuItemType)
                ],
                "accessIds" => [
                    "type" => Type::listOf($accessIdType)
                ],
                "defaultAccessId" => [
                    "type" => Type::nonNull(Type::int())
                ],
                "logo" => [
                    "type" => Type::nonNull(Type::string())
                ],
                "initiatorLink" => [
                    "type" => Type::string()
                ],
                "startpage" => [
                    "type" => Type::string()
                ],
                "showLogo" => [
                    "type" => Type::nonNull(Type::boolean())
                ],
                "showLeader" => [
                    "type" => Type::nonNull(Type::boolean())
                ],
                "showLeaderButtons" => [
                    "type" => Type::nonNull(Type::boolean())
                ],
                "subtitle" => [
                    "type" => Type::string()
                ],
                "leaderImage" => [
                    "type" => Type::string()
                ],
                "showInitiative" => [
                    "type" => Type::nonNull(Type::boolean())
                ],
                "style" => [
                    "type" => Type::nonNull($styleType)
                ],
                "filters" => [
                    "type" => Type::nonNull(Type::listOf($filterType))
                ],
                "usersOnline" => [
                    "type" => Type::nonNull(Type::int()),
                    "resolve" => "Pleio\Resolver::getUsersOnline"
                ]
            ]
        ]);

        $queryType = new ObjectType([
            "name" => "Query",
            "fields" => [
                "viewer" => [
                    "type" => $viewerType,
                    "resolve" => "Pleio\Resolver::getViewer"
                ],
                "entity" => [
                    "type" => $entityInterface,
                    "args" => [
                        "guid" => [
                            "type" => Type::int()
                        ],
                        "username" => [
                            "type" => Type::string()
                        ]
                    ],
                    "resolve" => "Pleio\Resolver::getEntity"
                ],
                "search" => [
                    "type" => $searchListType,
                    "args" => [
                        "q" => [
                            "type" => Type::nonNull(Type::string()),
                        ],
                        "containerGuid" => [
                            "type" => Type::string()
                        ],
                        "type" => [
                            "type" => $typeEnum
                        ],
                        "subtype" => [
                            "type" => Type::string()
                        ],
                        "offset" => [
                            "type" => Type::int()
                        ],
                        "limit" => [
                            "type" => Type::int()
                        ]
                    ],
                    "resolve" => "Pleio\Resolver::search"
                ],
                "recommended" => [
                    "type" => $entityListType,
                    "args" => [
                        "offset" => [
                            "type" => Type::int()
                        ],
                        "limit" => [
                            "type" => Type::int()
                        ]
                    ],
                    "resolve" => "Pleio\Resolver::getRecommended"
                ],
                "trending" => [
                    "type" => Type::listOf($trendingType),
                    "resolve" => "Pleio\Resolver::getTrending"
                ],
                "top" => [
                    "type" => Type::listOf($topType),
                    "resolve" => "Pleio\Resolver::getTop"
                ],
                "breadcrumb" => [
                    "type" => Type::listOf($objectType),
                    "args" => [
                        "guid" => [
                            "type" => Type::int()
                        ]
                    ],
                    "resolve" => "Pleio\Resolver::getBreadcrumb"  
                ],
                "files" => [
                    "type" => $entityListType,
                    "args" => [
                        "containerGuid" => [
                            "type" => Type::string()
                        ],
                        "filter" => [
                            "type" => Type::string()
                        ],
                        "orderBy" => [
                            "type" => Type::string()
                        ],
                        "direction" => [
                            "type" => Type::string()
                        ],
                        "offset" => [
                            "type" => Type::int()
                        ],
                        "limit" => [
                            "type" => Type::int()
                        ]
                    ],
                    "resolve" => "Pleio\Resolver::getFiles"
                ],
                "groups" => [
                    "type" => $groupListType,
                    "args" => [
                        "filter" => [
                            "type" => $groupFilterEnum
                        ],
                        "offset" => [
                            "type" => Type::int()
                        ],
                        "limit" => [
                            "type" => Type::int()
                        ]
                    ],
                    "resolve" => "Pleio\Resolver::getGroups"
                ],
                "events" => [
                    "type" => $eventListType,
                    "args" => [
                        "filter" => [
                            "type" => $eventFilterEnum
                        ],
                        "containerGuid" => [
                            "type" => Type::int()
                        ],
                        "offset" => [
                            "type" => Type::int()
                        ],
                        "limit" => [
                            "type" => Type::int()
                        ]
                    ],
                    "resolve" => "Pleio\Resolver::getEvents"
                ],
                "entities" => [
                    "type" => $entityListType,
                    "args" => [
                        "offset" => [
                            "type" => Type::int()
                        ],
                        "limit" => [
                            "type" => Type::int()
                        ],
                        "type" => [
                            "type" => $typeEnum
                        ],
                        "subtype" => [
                            "type" => Type::string()
                        ],
                        "containerGuid" => [
                            "type" => Type::int()
                        ],
                        "tags" => [
                            "type" => Type::listOf(Type::string())
                        ]
                    ],
                    "resolve" => "Pleio\Resolver::getEntities"
                ],
                "notifications" => [
                    "type" => $notificationsListType,
                    "args" => [
                        "offset" => [
                            "type" => Type::int()
                        ],
                        "limit" => [
                            "type" => Type::int()
                        ]
                    ],
                    "resolve" => "Pleio\Resolver::getNotifications"
                ],
                "activities" => [
                    "type" => $activityListType,
                    "args" => [
                        "containerGuid" => [
                            "type" => Type::int()
                        ],
                        "offset" => [
                            "type" => Type::int()
                        ],
                        "limit" => [
                            "type" => Type::int()
                        ],
                        "tags" => [
                            "type" => Type::listOf(Type::string())
                        ]
                    ],
                    "resolve" => "Pleio\Resolver::getActivities"
                ],
                "bookmarks" => [
                    "type" => $entityListType,
                    "args" => [
                        "offset" => [
                            "type" => Type::int()
                        ],
                        "limit" => [
                            "type" => Type::int()
                        ],
                        "subtype" => [
                            "type" => Type::string()
                        ],
                        "tags" => [
                            "type" => Type::listOf(Type::string())
                        ]
                    ],
                    "resolve" => "Pleio\Resolver::getBookmarks"
                ],
                "site" => [
                    "type" => $siteType,
                    "resolve" => "Pleio\Resolver::getSite"
                ]
            ]
        ]);

        $loginMutation = Relay::mutationWithClientMutationId([
            "name" => "login",
            "inputFields" => [
                "username" => [
                    "type" => Type::nonNull(Type::string())
                ],
                "password" => [
                    "type" => Type::nonNull(Type::string())
                ],
                "rememberMe" => [
                    "type" => Type::boolean()
                ]
            ],
            "outputFields" => [
                "viewer" => [
                    "type" => $viewerType,
                    "resolve" => "Pleio\Resolver::getViewer"
                ]
            ],
            "mutateAndGetPayload" => "Pleio\Mutations::login"
        ]);

        $logoutMutation = Relay::mutationWithClientMutationId([
            "name" => "logout",
            "inputFields" => [],
            "outputFields" => [
                "viewer" => [
                    "type" => $viewerType,
                    "resolve" => "Pleio\Resolver::getViewer"
                ]
            ],
            "mutateAndGetPayload" => "Pleio\Mutations::logout"
        ]);

        $registerMutation = Relay::mutationWithClientMutationId([
            "name" => "register",
            "inputFields" => [
                "name" => [
                    "type" => Type::nonNull(Type::string())
                ],
                "email" => [
                    "type" => Type::nonNull(Type::string())
                ],
                "password" => [
                    "type" => Type::nonNull(Type::string())
                ],
                "newsletter" => [
                    "type" => Type::boolean()
                ],
                "terms" => [
                    "type" => Type::boolean()
                ],
                "tags" => [
                    "type" => Type::listOf(Type::string())
                ]
            ],
            "outputFields" => [
                "viewer" => [
                    "type" => $viewerType,
                    "resolve" => "Pleio\Resolver::getViewer"
                ]
            ],
            "mutateAndGetPayload" => "Pleio\Mutations::register"
        ]);

        $forgotPasswordMutation = Relay::mutationWithClientMutationId([
            "name" => "forgotPassword",
            "inputFields" => [
                "username" => [
                    "type" => Type::nonNull(Type::string())
                ],
            ],
            "outputFields" => [
                "status" => [
                    "type" => Type::int(),
                    "resolve" => function($return) {
                        return $return["status"];
                    }
                ]
            ],
            "mutateAndGetPayload" => "Pleio\Mutations::forgotPassword"
        ]);

        $forgotPasswordConfirmMutation = Relay::mutationWithClientMutationId([
            "name" => "forgotPasswordConfirm",
            "inputFields" => [
                "userGuid" => [
                    "type" => Type::nonNull(Type::string())
                ],
                "code" => [
                    "type" => Type::nonNull(Type::string())
                ]
            ],
            "outputFields" => [
                "status" => [
                    "type" => Type::int(),
                    "resolve" => function($return) {
                        return $return["status"];
                    }
                ]
            ],
            "mutateAndGetPayload" => "Pleio\Mutations::forgotPasswordConfirm"
        ]);

        $subscribeNewsletterMutation = Relay::mutationWithClientMutationId([
            "name" => "subscribeNewsletter",
            "inputFields" => [
                "email" => [
                    "type" => Type::nonNull(Type::string())
                ]
            ],
            "outputFields" => [
                "viewer" => [
                    "type" => $viewerType,
                    "resolve" => "Pleio\Resolver::getViewer"
                ]
            ],
            "mutateAndGetPayload" => "Pleio\Mutations::subscribeNewsletter"
        ]);

        $addFileMutation = Relay::mutationWithClientMutationId([
            "name" => "addFile",
            "inputFields" => [
                "containerGuid" => [ "type" => Type::string() ],
                "file" => [ "type" => Type::string() ],
                "accessId" => [ "type" => Type::int() ],
                "writeAccessId" => [ "type" => Type::int() ],
            ],
            "outputFields" => [
                "entity" => [
                    "type" => $entityInterface,
                    "resolve" => function($entity) {
                        return Resolver::getEntity(null, $entity, null);
                    }
                ]
            ],
            "mutateAndGetPayload" => "Pleio\Mutations::addFile"
        ]);

        $editFileFolderMutation = Relay::mutationWithClientMutationId([
            "name" => "editFileFolder",
            "inputFields" => [
                "guid" => [ "type" => Type::string() ],
                "title" => [ "type" => Type::string() ],
                "file" => [ "type" => Type::string() ],
                "accessId" => [ "type" => Type::int() ],
                "writeAccessId" => [ "type" => Type::int() ],

            ],
            "outputFields" => [
                "entity" => [
                    "type" => $entityInterface,
                    "resolve" => function($entity) {
                        return Resolver::getEntity(null, $entity, null);
                    }
                ]
            ],
            "mutateAndGetPayload" => "Pleio\Mutations::editFileFolder"
        ]);

        $moveFileFolderMutation = Relay::mutationWithClientMutationId([
            "name" => "moveFileFolder",
            "inputFields" => [
                "guid" => [
                    "type" => Type::int()
                ],
                "containerGuid" => [
                    "type" => Type::int()
                ]
            ],
            "outputFields" => [
                "entity" => [
                    "type" => $entityInterface,
                    "resolve" => function($entity) {
                        return Resolver::getEntity(null, $entity, null);
                    }
                ]
            ],
            "mutateAndGetPayload" => "Pleio\Mutations::moveFileFolder"
        ]);

        $featuredInput = new InputObjectType([
            "name" => "FeaturedInput",
            "fields" => [
                "video" => [
                    "type" => Type::string()
                ],
                "image" => [
                    "type" => Type::string()
                ],
                "positionY" => [
                    "type" => Type::int()
                ]
            ]
        ]);

        $addEntityMutation = Relay::mutationWithClientMutationId([
            "name" => "addEntity",
            "inputFields" => [
                "type" => [ "type" => Type::nonNull($typeEnum) ],
                "subtype" => [ "type" => Type::nonNull(Type::string()) ],
                "title" => [ "type" => Type::string() ],
                "description" => [ "type" => Type::nonNull(Type::string()) ],
                "richDescription" => [ "type" => Type::string() ],
                "isRecommended" => [ "type" => Type::boolean() ],
                "isFeatured" => [ "type" => Type::boolean() ],
                "pageType" => [ "type" => Type::string() ],
                "featured" => [ "type" => $featuredInput ],
                "startDate" => [ "type" => Type::string() ],
                "endDate" => [ "type" => Type::string() ],
                "source" => [ "type" => Type::string() ],
                "location" => [ "type" => Type::string() ],
                "rsvp" => [ "type" => Type::boolean() ],
                "containerGuid" => [ "type" => Type::int() ],
                "accessId" => [ "type" => Type::int() ],
                "writeAccessId" => [ "type" => Type::int() ],
                "tags" => [ "type" => Type::listOf(Type::string()) ]
            ],
            "outputFields" => [
                "entity" => [
                    "type" => $entityInterface,
                    "resolve" => function($entity) {
                        return Resolver::getEntity(null, $entity, null);
                    }
                ]
            ],
            "mutateAndGetPayload" => "Pleio\Mutations::addEntity"
        ]);

        $editEntityMutation = Relay::mutationWithClientMutationId([
            "name" => "editEntity",
            "inputFields" => [
                "guid" => [ "type" => Type::nonNull(Type::string()) ],
                "title" => [ "type" => Type::string() ],
                "description" => [ "type" => Type::nonNull(Type::string()) ],
                "richDescription" => [ "type" => Type::string() ],
                "isRecommended" => [ "type" => Type::boolean() ],
                "isFeatured" => [ "type" => Type::boolean() ],
                "featured" => [ "type" => $featuredInput ],
                "startDate" => [ "type" => Type::string() ],
                "endDate" => [ "type" => Type::string() ],
                "source" => [ "type" => Type::string() ],
                "location" => [ "type" => Type::string() ],
                "rsvp" => [ "type" => Type::boolean() ],
                "accessId" => [ "type" => Type::int() ],
                "writeAccessId" => [ "type" => Type::int() ],
                "tags" => [ "type" => Type::listOf(Type::string()) ]
            ],
            "outputFields" => [
                "entity" => [
                    "type" => $entityInterface,
                    "resolve" => function($entity) {
                        return Resolver::getEntity(null, $entity, null);
                    }
                ]
            ],
            "mutateAndGetPayload" => "Pleio\Mutations::editEntity"
        ]);

        $addPageMutation = Relay::mutationWithClientMutationId([
            "name" => "addPage",
            "inputFields" => [
                "title" => [
                    "type" => Type::string()
                ],
                "accessId" => [
                    "type" => Type::int()
                ],
                "tags" => [
                    "type" => Type::listOf(Type::string())
                ]
            ],
            "outputFields" => [
                "entity" => [
                    "type" => $entityInterface,
                    "resolve" => function($entity) {
                        return Resolver::getEntity(null, $entity, null);
                    }
                ]
            ],
            "mutateAndGetPayload" => "Pleio\Mutations::addPage"
        ]);

        $editPageMutation = Relay::mutationWithClientMutationId([
            "name" => "editPage",
            "inputFields" => [
                "guid" => [
                    "type" => Type::nonNull(Type::string())
                ],
                "title" => [
                    "type" => Type::string()
                ],
                "accessId" => [
                    "type" => Type::int()
                ],
                "tags" => [
                    "type" => Type::listOf(Type::string())
                ]
            ],
            "outputFields" => [
                "entity" => [
                    "type" => $entityInterface,
                    "resolve" => function($entity) {
                        return Resolver::getEntity(null, $entity, null);
                    }
                ]
            ],
            "mutateAndGetPayload" => "Pleio\Mutations::addPage"
        ]);

        $addRowMutation = Relay::mutationWithClientMutationId([
            "name" => "addRow",
            "inputFields" => [
                "layout" => [ "type" => Type::string() ],
                "containerGuid" => [ "type" => Type::string() ]
            ],
            "outputFields" => [
                "entity" => [
                    "type" => $objectType,
                    "resolve" => function($entity) {
                        return Resolver::getEntity(null, $entity, null);
                    }
                ]
            ],
            "mutateAndGetPayload" => "Pleio\Mutations::addRow"
        ]);

        $widgetSettingInput = new InputObjectType([
            "name" => "WidgetSettingInput",
            "fields" => [
                "key" => [
                    "type" => Type::string()
                ],
                "value" => [
                    "type" => Type::string()
                ]
            ]
        ]);

        $addWidgetMutation = Relay::mutationWithClientMutationId([
            "name" => "addWidget",
            "inputFields" => [
                "rowGuid" => [
                    "type" => Type::nonNull(Type::string())
                ],
                "position" => [
                    "type" => Type::nonNull(Type::int())
                ],
                "type" => [
                    "type" => Type::nonNull(Type::string())
                ],
                "settings" => [
                    "type" => Type::listOf($widgetSettingInput)
                ]
            ],
            "outputFields" => [
                "entity" => [
                    "type" => $entityInterface,
                    "resolve" => function($entity) {
                        return Resolver::getEntity(null, $entity, null);
                    }
                ]
            ],
            "mutateAndGetPayload" => "Pleio\Mutations::addWidget"
        ]);

        $editWidgetMutation = Relay::mutationWithClientMutationId([
            "name" => "editWidget",
            "inputFields" => [
                "guid" => [
                    "type" => Type::nonNull(Type::string())
                ],
                "row" => [
                    "type" => Type::int()
                ],
                "col" => [
                    "type" => Type::int()
                ],
                "width" => [
                    "type" => Type::int()
                ],
                "settings" => [
                    "type" => Type::listOf($widgetSettingInput)
                ]
            ],
            "outputFields" => [
                "entity" => [
                    "type" => $widgetItem,
                    "resolve" => function($entity) {
                        return Resolver::getEntity(null, $entity, null);
                    }
                ]
            ],
            "mutateAndGetPayload" => "Pleio\Mutations::editWidget"
        ]);


        $deleteEntityMutation = Relay::mutationWithClientMutationId([
            "name" => "deleteEntity",
            "inputFields" => [
                "guid" => [
                    "type" => Type::nonNull(Type::string())
                ]
            ],
            "outputFields" => [
                "entity" => [
                    "type" => $entityInterface,
                    "resolve" => function($entity) {
                        return Resolver::getEntity(null, $entity, null);
                    }
                ]
            ],
            "mutateAndGetPayload" => "Pleio\Mutations::deleteEntity"
        ]);

        $bookmarkMutation = Relay::mutationWithClientMutationId([
            "name" => "bookmark",
            "inputFields" => [
                "guid" => [
                    "type" => Type::nonNull((Type::string())),
                    "description" => "The guid of the entity to bookmark."
                ],
                "isAdding" => [
                    "type" => Type::nonNull(Type::boolean()),
                    "description" => "True when adding, false when removing."
                ]
            ],
            "outputFields" => [
                "object" => [
                    "type" => Type::nonNull($objectType),
                    "resolve" => function($entity) {
                        return Resolver::getEntity(null, $entity, null);
                    }
                ]
            ],
            "mutateAndGetPayload" => "Pleio\Mutations::bookmark"
        ]);

        $voteMutation = Relay::mutationWithClientMutationId([
            "name" => "vote",
            "inputFields" => [
                "guid" => [
                    "type" => Type::nonNull((Type::string())),
                    "description" => "The guid of the entity to vote on."
                ],
                "score" => [
                    "type" => Type::nonNull(Type::int()),
                    "description" => "1 for upvote, -1 for downvote, 0 for deleting."
                ]
            ],
            "outputFields" => [
                "object" => [
                    "type" => Type::nonNull($objectType),
                    "resolve" => function($entity) {
                        return Resolver::getEntity(null, $entity, null);
                    }
                ]
            ],
            "mutateAndGetPayload" => "Pleio\Mutations::vote"
        ]);

        $followMutation = Relay::mutationWithClientMutationId([
            "name" => "follow",
            "inputFields" => [
                "guid" => [
                    "type" => Type::nonNull((Type::string())),
                    "description" => "The guid of the entity to follow."
                ],
                "isFollowing" => [
                    "type" => Type::nonNull(Type::boolean()),
                    "description" => "True for following, false for not following."
                ]
            ],
            "outputFields" => [
                "object" => [
                    "type" => Type::nonNull($objectType),
                    "resolve" => function($entity) {
                        return Resolver::getEntity(null, $entity, null);
                    }
                ]
            ],
            "mutateAndGetPayload" => "Pleio\Mutations::follow"
        ]);


        $editProfileFieldMutation = Relay::mutationWithClientMutationId([
            "name" => "editProfileField",
            "inputFields" => [
                "guid" => [
                    "type" => Type::string()
                ],
                "key" => [
                    "type" => Type::nonNull(Type::string())
                ],
                "value" => [
                    "type" => Type::nonNull(Type::string())
                ],
            ],
            "outputFields" => [
                "user" => [
                    "type" => $userType,
                    "resolve" => function($entity) {
                        return Resolver::getEntity(null, $entity, null);
                    }
                ]
            ],
            "mutateAndGetPayload" => "Pleio\Mutations::editProfileField"
        ]);

        $editAvatarMutation = Relay::mutationWithClientMutationId([
            "name" => "editAvatar",
            "inputFields" => [
                "guid" => [
                    "type" => Type::string()
                ],
                "avatar" => [
                    "type" => Type::string(),
                    "description" => "The string pointer to the file object."
                ],
            ],
            "outputFields" => [
                "user" => [
                    "type" => $userType,
                    "resolve" => function($entity) {
                        return Resolver::getEntity(null, $entity, null);
                    }
                ]
            ],
            "mutateAndGetPayload" => "Pleio\Mutations::editAvatar"
        ]);

        $editInterestsMutation = Relay::mutationWithClientMutationId([
            "name" => "editInterests",
            "inputFields" => [
                "guid" => [
                    "type" => Type::string()
                ],
                "tags" => [
                    "type" => Type::listOf(Type::string())
                ]
            ],
            "outputFields" => [
                "user" => [
                    "type" => $userType,
                    "resolve" => function($entity) {
                        return Resolver::getEntity(null, $entity, null);
                    }
                ]
            ],
            "mutateAndGetPayload" => "Pleio\Mutations::editInterests"
        ]);

        $editNotificationsMutation = Relay::mutationWithClientMutationId([
            "name" => "editNotifications",
            "inputFields" => [
                "guid" => [
                    "type" => Type::string()
                ],
                "emailNotifications" => [
                    "type" => Type::boolean()
                ],
                "newsletter" => [
                    "type" => Type::boolean()
                ]
            ],
            "outputFields" => [
                "user" => [
                    "type" => $userType,
                    "resolve" => function($entity) {
                        return Resolver::getEntity(null, $entity, null);
                    }
                ]
            ],
            "mutateAndGetPayload" => "Pleio\Mutations::editNotifications"
        ]);

        $editEmailOverviewMutation = Relay::mutationWithClientMutationId([
            "name" => "editEmailOverview",
            "inputFields" => [
                "guid" => [
                    "type" => Type::string()
                ],
                "overview" => [
                    "type" => $overviewEnum
                ]
            ],
            "outputFields" => [
                "user" => [
                    "type" => $userType,
                    "resolve" => function($entity) {
                        return Resolver::getEntity(null, $entity, null);
                    }
                ]
            ],
            "mutateAndGetPayload" => "Pleio\Mutations::editEmailOverview"
        ]);

        $editEmailMutation = Relay::mutationWithClientMutationId([
            "name" => "editEmail",
            "inputFields" => [
                "guid" => [
                    "type" => Type::string()
                ],
                "email" => [
                    "type" => Type::string()
                ]
            ],
            "outputFields" => [
                "user" => [
                    "type" => $userType,
                    "resolve" => function($entity) {
                        return Resolver::getEntity(null, $entity, null);
                    }
                ]
            ],
            "mutateAndGetPayload" => "Pleio\Mutations::editEmail"
        ]);

        $editPasswordMutation = Relay::mutationWithClientMutationId([
            "name" => "editPassword",
            "inputFields" => [
                "guid" => [
                    "type" => Type::string()
                ],
                "oldPassword" => [
                    "type" => Type::string()
                ],
                "newPassword" => [
                    "type" => Type::string()
                ]
            ],
            "outputFields" => [
                "user" => [
                    "type" => $userType,
                    "resolve" => function($entity) {
                        return Resolver::getEntity(null, $entity, null);
                    }
                ]
            ],
            "mutateAndGetPayload" => "Pleio\Mutations::editPassword"
        ]);

        $addImageMutation = Relay::mutationWithClientMutationId([
            "name" => "addImage",
            "inputFields" => [
                "image" => [
                    "type" => Type::string()
                ]
            ],
            "outputFields" => [
                "file" => [
                    "type" => $fileType,
                    "resolve" => function($file) {
                        return Resolver::getFile(null, $file, null);
                    }
                ]
            ],
            "mutateAndGetPayload" => "Pleio\Mutations::addImage"
        ]);

        $addGroupMutation = Relay::mutationWithClientMutationId([
            "name" => "addGroup",
            "inputFields" => [
                "name" => [ "type" => Type::string() ],
                "icon" => [ "type" => Type::string() ],
                "featured" => [
                    "type" => $featuredInput
                ],
                "isClosed" => [ "type" => Type::boolean() ],
                "description" => [ "type" => Type::string() ],
                "introduction" => [ "type" => Type::string() ],
                "tags" => [ "type" => Type::listOf(Type::string()) ],
                "plugins" => [ "type" => Type::listOf($pluginEnum) ]
            ],
            "outputFields" => [
                "group" => [
                    "type" => $groupType,
                    "resolve" => function($group) {
                        return Resolver::getEntity(null, $group, null);
                    }
                ]
            ],
            "mutateAndGetPayload" => "Pleio\Mutations::addGroup"
        ]);

        $editGroupMutation = Relay::mutationWithClientMutationId([
            "name" => "editGroup",
            "inputFields" => [
                "guid" => [ "type" => Type::string() ],
                "name" => [ "type" => Type::string() ],
                "icon" => [ "type" => Type::string() ],
                "featured" => [
                    "type" => $featuredInput
                ],
                "isClosed" => [
                    "type" => Type::boolean(),
                    "description" => "True when membership has to be requested by the user, False when every user can join the group."
                ],
                "description" => [ "type" => Type::string() ],
                "introduction" => [ "type" => Type::string() ],
                "tags" => [ "type" => Type::listOf(Type::string()) ],
                "plugins" => [ "type" => Type::listOf($pluginEnum) ]
            ],
            "outputFields" => [
                "group" => [
                    "type" => $groupType,
                    "resolve" => function($group) {
                        return Resolver::getEntity(null, $group, null);
                    }
                ]
            ],
            "mutateAndGetPayload" => "Pleio\Mutations::editGroup"
        ]);

        $joinGroupMutation = Relay::mutationWithClientMutationId([
            "name" => "joinGroup",
            "description" => "Join a group. In the case of a closed group a membership request will be send, in the case of an open group the user will be joined immediately.",
            "inputFields" => [
                "guid" => [
                    "type" => Type::string(),
                    "description" => "The guid of the group to join."
                ]
            ],
            "outputFields" => [
                "group" => [
                    "type" => $groupType,
                    "resolve" => function($group) {
                        return Resolver::getEntity(null, $group, null);
                    }
                ]
            ],
            "mutateAndGetPayload" => "Pleio\Mutations::joinGroup"
        ]);

        $leaveGroupMutation = Relay::mutationWithClientMutationId([
            "name" => "leaveGroup",
            "description" => "Leave a group.",
            "inputFields" => [
                "guid" => [
                    "type" => Type::string(),
                    "description" => "The guid of the group to leave."
                ],
            ],
            "outputFields" => [
                "group" => [
                    "type" => $groupType,
                    "resolve" => function($group) {
                        return Resolver::getEntity(null, $group, null);
                    }
                ]
            ],
            "mutateAndGetPayload" => "Pleio\Mutations::leaveGroup"
        ]);

        $inviteToGroupUserType = new InputObjectType([
            "name" => "InviteToGroupUser",
            "description" => "An object with either the guid or the e-mailaddress of a user.",
            "fields" => [
                "guid" => [
                    "type" => Type::string()
                ],
                "email" => [
                    "type" => Type::string()
                ]
            ]
        ]);

        $inviteToGroupMutation = Relay::mutationWithClientMutationId([
            "name" => "inviteToGroup",
            "description" => "Create an invitation to join a group.",
            "inputFields" => [
                "guid" => [
                    "type" => Type::string(),
                    "description" => "The guid of the group to invite to."
                ],
                "users" => [
                    "type" => Type::listOf($inviteToGroupUserType),
                    "description" => "A list of users to invite."
                ]
            ],
            "outputFields" => [
                "group" => [
                    "type" => $groupType,
                    "resolve" => function($group) {
                        return Resolver::getEntity(null, $group, null);
                    }
                ]
            ],
            "mutateAndGetPayload" => "Pleio\Mutations::inviteToGroup"
        ]);

        $resendGroupInvitationMutation = Relay::mutationWithClientMutationId([
            "name" => "resendGroupInvitation",
            "description" => "Resend an invitation to join a group.",
            "inputFields" => [
                "id" => [
                    "type" => Type::int(),
                    "description" => "The id of the invitation to resend."
                ]
            ],
            "outputFields" => [
                "group" => [
                    "type" => $groupType,
                    "resolve" => function($group) {
                        return Resolver::getEntity(null, $group, null);
                    }
                ]
            ],
            "mutateAndGetPayload" => "Pleio\Mutations::resendGroupInvitation"
        ]);

        $deleteGroupInvitationMutation = Relay::mutationWithClientMutationId([
            "name" => "deleteGroupInvitation",
            "description" => "Remove an invitation to join a group.",
            "inputFields" => [
                "id" => [
                    "type" => Type::int(),
                    "description" => "The id of the invitation to delete."
                ]
            ],
            "outputFields" => [
                "group" => [
                    "type" => $groupType,
                    "resolve" => function($group) {
                        return Resolver::getEntity(null, $group, null);
                    }
                ]
            ],
            "mutateAndGetPayload" => "Pleio\Mutations::deleteGroupInvitation"
        ]);

        $sendMessageToGroupMutation = Relay::mutationWithClientMutationId([
            "name" => "sendMessageToGroup",
            "description" => "Send a message to the group members.",
            "inputFields" => [
                "guid" => [
                    "type" => Type::string(),
                    "description" => "The guid of the group to send the message to."
                ],
                "subject" => [
                    "type" => Type::string(),
                    "description" => "The subject of the message."
                ],
                "message" => [
                    "type" => Type::string(),
                    "description" => "The message to send."
                ]
            ],
            "outputFields" => [
                "group" => [
                    "type" => $groupType,
                    "resolve" => function($group) {
                        return Resolver::getEntity(null, $group, null);
                    }
                ]
            ],
            "mutateAndGetPayload" => "Pleio\Mutations::sendMessageToGroup"
        ]);

        $acceptGroupInvitation = Relay::mutationWithClientMutationId([
            "name" => "acceptGroupInvitation",
            "description" => "Accept a group invitation.",
            "inputFields" => [
                "code" => [
                    "type" => Type::string(),
                    "description" => "The unique invite code."
                ]
            ],
            "outputFields" => [
                "group" => [
                    "type" => $groupType,
                    "resolve" => function($group) {
                        return Resolver::getEntity(null, $group, null);
                    }
                ]
            ],
            "mutateAndGetPayload" => "Pleio\Mutations::acceptGroupInvitation"
        ]);

        $changeGroupRoleMutation = Relay::mutationWithClientMutationId([
            "name" => "changeGroupRole",
            "description" => "Change the role of a user in a group.",
            "inputFields" => [
                "guid" => [
                    "type" => Type::string(),
                    "description" => "The group guid."
                ],
                "userGuid" => [
                    "type" => Type::string(),
                    "description" => "The user guid."
                ],
                "role" => [
                    "type" => $roleEnum,
                    "description" => "The new role for the user."
                ]
            ],
            "outputFields" => [
                "group" => [
                    "type" => $groupType,
                    "resolve" => function($group) {
                        return Resolver::getEntity(null, $group, null);
                    }
                ]
            ],
            "mutateAndGetPayload" => "Pleio\Mutations::changeGroupRoleMutation"
        ]);

        $editTaskMutation = Relay::mutationWithClientMutationId([
            "name" => "editTask",
            "inputFields" => [
                "guid" => [ "type" => Type::string() ],
                "state" => [ "type" => Type::string() ]
            ],
            "outputFields" => [
                "entity" => [
                    "type" => $objectType,
                    "resolve" => function($entity) {
                        return Resolver::getEntity(null, $entity, null);
                    }
                ]
            ],
            "mutateAndGetPayload" => "Pleio\Mutations::editTask"
        ]);

        $attendEventMutation = Relay::mutationWithClientMutationId([
            "name" => "attendEvent",
            "inputFields" => [
                "guid" => [ "type" => Type::string() ],
                "state" => [ "type" => Type::string() ]
            ],
            "outputFields" => [
                "entity" => [
                    "type" => $objectType,
                    "resolve" => function($entity) {
                        return Resolver::getEntity(null, $entity, null);
                    }
                ]
            ],
            "mutateAndGetPayload" => "Pleio\Mutations::attendEvent"
        ]);

        $markAsReadMutation = Relay::mutationWithClientMutationId([
            "name" => "markAsRead",
            "inputFields" => [
                "id" => [ "type" => Type::string() ]
            ],
            "outputFields" => [
                "success" => [ "type" => Type::boolean() ],
                "notification" => [ "type" => $notificationType ]
            ],
            "mutateAndGetPayload" => "Pleio\Mutations::markAsRead"
        ]);

        $markAllAsReadMutation = Relay::mutationWithClientMutationId([
            "name" => "markAllAsRead",
            "inputFields" => [
                "id" => [ "type" => Type::string() ]
            ],
            "outputFields" => [
                "success" => [ "type" => Type::boolean() ]
            ],
            "mutateAndGetPayload" => "Pleio\Mutations::markAllAsRead"
        ]);

        $mutationType = new ObjectType([
            "name" => "Mutation",
            "fields" => [
                    "login" => $loginMutation,
                    "logout" => $logoutMutation,
                    "register" => $registerMutation,
                    "forgotPassword" => $forgotPasswordMutation,
                    "forgotPasswordConfirm" => $forgotPasswordConfirmMutation,
                    "addEntity" => $addEntityMutation,
                    "editEntity" => $editEntityMutation,
                    "deleteEntity" => $deleteEntityMutation,
                    "addFile" => $addFileMutation,
                    "editFileFolder" => $editFileFolderMutation,
                    "moveFileFolder" => $moveFileFolderMutation,
                    "addPage" => $addPageMutation,
                    "editPage" => $editPageMutation,
                    "addRow" => $addRowMutation,
                    "addWidget" => $addWidgetMutation,
                    "editWidget" => $editWidgetMutation,
                    "subscribeNewsletter" => $subscribeNewsletterMutation,
                    "editInterests" => $editInterestsMutation,
                    "editNotifications" => $editNotificationsMutation,
                    "editEmailOverview" => $editEmailOverviewMutation,
                    "editEmail" => $editEmailMutation,
                    "editPassword" => $editPasswordMutation,
                    "bookmark" => $bookmarkMutation,
                    "vote" => $voteMutation,
                    "follow" => $followMutation,
                    "editAvatar" => $editAvatarMutation,
                    "editProfileField" => $editProfileFieldMutation,
                    "addImage" => $addImageMutation,
                    "addGroup" => $addGroupMutation,
                    "editGroup" => $editGroupMutation,
                    "joinGroup" => $joinGroupMutation,
                    "leaveGroup" => $leaveGroupMutation,
                    "inviteToGroup" => $inviteToGroupMutation,
                    "resendGroupInvitation" => $resendGroupInvitationMutation,
                    "deleteGroupInvitation" => $deleteGroupInvitationMutation,
                    "sendMessageToGroup" => $sendMessageToGroupMutation,
                    "acceptGroupInvitation" => $acceptGroupInvitation,
                    "changeGroupRole" => $changeGroupRoleMutation,
                    "editTask" => $editTaskMutation,
                    "attendEvent" => $attendEventMutation,
                    "markAsRead" => $markAsReadMutation,
                    "markAllAsRead" => $markAllAsReadMutation
            ]
        ]);

        $schema = new Schema($queryType, $mutationType);
        return $schema;
   }
}