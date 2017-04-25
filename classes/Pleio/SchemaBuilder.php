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
                "row" => [
                    "type" => Type::nonNull(Type::int())
                ],
                "settings" => [
                    "type" => Type::listOf($widgetSetting)
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
                "url" => [
                    "type" => Type::string()
                ],
                "timeCreated" => [
                    "type" => Type::string()
                ],
                "timeUpdated" => [
                    "type" => Type::string()
                ],
                "widgets" => [
                    "type" => Type::listOf($widgetItem)
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
                "getsNotificationOnReply" => [
                    "type" => Type::boolean(),
                    "resolve" => function($user) {
                        return Resolver::getsNotificationOnReply($user);
                    }
                ],
                "getsNewsletter" => [
                    "type" => Type::boolean(),
                    "resolve" => function($user) {
                        return Resolver::getsNewsletter($user);
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

        $inviteType = new ObjectType([
            "name" => "Invite",
            "fields" => [
                "invited" => [
                    "type" => Type::nonNull(Type::boolean())
                ],
                "user" => [
                    "type" => Type::nonNull($userType)
                ]
            ]
        ]);

        $inviteListType = new ObjectType([
            "name" => "InviteList",
            "fields" => [
                "total" => [
                    "type" => Type::nonNull(Type::int())
                ],
                "edges" => [
                    "type" => Type::listOf($inviteType)
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
                "icon" => [
                    "type" => Type::string()
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
                "defaultAccessId" => [
                    "type" => Type::int()
                ],
                "tags" => [
                    "type" => Type::listOf(Type::string())
                ],
                "members" => [
                    "type" => $userListType,
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
                ]
            ]
        ]);

        $objectType = new ObjectType([
            "name" => "Object",
            "interfaces" => [$entityInterface],
            "fields" => [
                "guid" => [
                    "type" => Type::nonNull(Type::string())
                ],
                "status" => [
                    "type" => Type::int()
                ],
                "subtype" => [
                    "type" => Type::string()
                ],
                "title" => [
                    "type" => Type::string()
                ],
                "description" => [
                    "type" => Type::string()
                ],
                "richDescription" => [
                    "type" => Type::string()
                ],
                "excerpt" => [
                    "type" => Type::string()
                ],
                "url" => [
                    "type" => Type::string()
                ],
                "tags" => [
                    "type" => Type::listOf(Type::string())
                ],
                "timeCreated" => [
                    "type" => Type::string()
                ],
                "timeUpdated" => [
                    "type" => Type::string()
                ],
                "startDate" => [
                    "type" => Type::string()
                ],
                "endDate" => [
                    "type" => Type::string()
                ],
                "source" => [
                    "type" => Type::string()
                ],
                "isFeatured" => [
                    "type" => Type::boolean()
                ],
                "isRecommended" => [
                    "type" => Type::boolean(),
                    "resolve" => function($object) {
                        return Resolver::isRecommended($object);
                    }
                ],
                "featuredImage" => [
                    "type" => Type::string()
                ],
                "canEdit" => [
                    "type" => Type::boolean()
                ],
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
                "accessId" => [
                    "type" => Type::int()
                ],
                "isBookmarked" => [
                    "type" => Type::boolean(),
                    "resolve" => function($object) {
                        return Resolver::isBookmarked($object);
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
                            "type" => Type::string()
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
                        return Resolver::getEntity(null, ["guid" => $activity["object_guid"]], null);
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
                "footer" => [
                    "type" => Type::listOf($menuItemType)  
                ],
                "accessIds" => [
                    "type" => Type::listOf($accessIdType)
                ],
                "logo" => [
                    "type" => Type::nonNull(Type::string())
                ],
                "showLogo" => [
                    "type" => Type::nonNull(Type::boolean())
                ],
                "showLeader" => [
                    "type" => Type::nonNull(Type::boolean())
                ],
                "showInitiative" => [
                    "type" => Type::nonNull(Type::boolean())
                ],
                "filters" => [
                    "type" => Type::nonNull(Type::listOf($filterType))
                ],
                "usersOnline" => [
                    "type" => Type::nonNull(Type::int()),
                    "resolve" => "Pleio\Resolver::getUsersOnline"
                ],
                "defaultAccessId" => [
                    "type" => Type::nonNull(Type::int())
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
                            "type" => Type::string()
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
                "containerGuid" => [
                    "type" => Type::string()
                ],
                "file" => [
                    "type" => Type::string()
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
            "mutateAndGetPayload" => "Pleio\Mutations::addFile"
        ]);

        $editFileFolderMutation = Relay::mutationWithClientMutationId([
            "name" => "editFileFolder",
            "inputFields" => [
                "guid" => [
                    "type" => Type::string()
                ],
                "title" => [
                    "type" => Type::string()
                ],
                "file" => [
                    "type" => Type::string()
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
            "mutateAndGetPayload" => "Pleio\Mutations::editFileFolder"
        ]);

        $addEntityMutation = Relay::mutationWithClientMutationId([
            "name" => "addEntity",
            "inputFields" => [
                "type" => [
                    "type" => Type::nonNull($typeEnum)
                ],
                "subtype" => [
                    "type" => Type::nonNull(Type::string())
                ],
                "title" => [
                    "type" => Type::string()
                ],
                "description" => [
                    "type" => Type::nonNull(Type::string())
                ],
                "richDescription" => [
                    "type" => Type::string()
                ],
                "isRecommended" => [
                    "type" => Type::boolean()
                ],
                "isFeatured" => [
                    "type" => Type::boolean()
                ],
                "featuredImage" => [
                    "type" => Type::string()
                ],
                "startDate" => [
                    "type" => Type::string()
                ],
                "endDate" => [
                    "type" => Type::string()
                ],
                "source" => [
                    "type" => Type::string()
                ],
                "containerGuid" => [
                    "type" => Type::int()
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
            "mutateAndGetPayload" => "Pleio\Mutations::addEntity"
        ]);

        $editEntityMutation = Relay::mutationWithClientMutationId([
            "name" => "editEntity",
            "inputFields" => [
                "guid" => [
                    "type" => Type::nonNull(Type::string())
                ],
                "title" => [
                    "type" => Type::string()
                ],
                "description" => [
                    "type" => Type::nonNull(Type::string())
                ],
                "richDescription" => [
                    "type" => Type::string()
                ],
                "isRecommended" => [
                    "type" => Type::boolean()
                ],
                "isFeatured" => [
                    "type" => Type::boolean()
                ],
                "featuredImage" => [
                    "type" => Type::string()
                ],
                "startDate" => [
                    "type" => Type::string()
                ],
                "endDate" => [
                    "type" => Type::string()
                ],
                "source" => [
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
                "pageGuid" => [
                    "type" => Type::nonNull(Type::string())
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
                    "type" => Type::nonNull(Type::int())
                ],
                "col" => [
                    "type" => Type::nonNull(Type::int())
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
                "notificationOnReply" => [
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
                "isClosed" => [ "type" => Type::boolean() ],
                "description" => [ "type" => Type::string() ],
                "tags" => [ "type" => Type::listOf(Type::string()) ]
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
                "isClosed" => [
                    "type" => Type::boolean(),
                    "description" => "True when membership has to be requested by the user, False when every user can join the group."
                ],
                "description" => [ "type" => Type::string() ],
                "tags" => [ "type" => Type::listOf(Type::string()) ]
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

        $inviteToGroupMutation = Relay::mutationWithClientMutationId([
            "name" => "inviteToGroup",
            "description" => "Create an invitation to join a group.",
            "inputFields" => [
                "guid" => [
                    "type" => Type::string(),
                    "description" => "The guid of the group to invite to."
                ],
                "userGuidOrEmail" => [
                    "type" => Type::string(),
                    "description" => "The guid or e-mail address of the user to invite."
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
                    "addPage" => $addPageMutation,
                    "editPage" => $editPageMutation,
                    "addWidget" => $addWidgetMutation,
                    "editWidget" => $editWidgetMutation,
                    "subscribeNewsletter" => $subscribeNewsletterMutation,
                    "editInterests" => $editInterestsMutation,
                    "editNotifications" => $editNotificationsMutation,
                    "editEmail" => $editEmailMutation,
                    "editPassword" => $editPasswordMutation,
                    "bookmark" => $bookmarkMutation,
                    "vote" => $voteMutation,
                    "editAvatar" => $editAvatarMutation,
                    "editProfileField" => $editProfileFieldMutation,
                    "addImage" => $addImageMutation,
                    "addGroup" => $addGroupMutation,
                    "editGroup" => $editGroupMutation,
                    "joinGroup" => $joinGroupMutation,
                    "leaveGroup" => $leaveGroupMutation,
                    "inviteToGroup" => $inviteToGroupMutation
            ]
        ]);

        $schema = new Schema($queryType, $mutationType);
        return $schema;
   }
}