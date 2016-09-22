<?php
namespace Pleio;

use GraphQL\Type\Definition\EnumType;
use GraphQL\Type\Definition\InterfaceType;
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
                ]
            ]
        ]);

        $entityInterface = new InterfaceType([
            "name" => "Entity",
            "fields" => [
                "guid" => [
                    "type" => Type::nonNull(Type::string())
                ]
            ],
            "resolveType" => function($object) use (&$userType, &$objectType, &$groupType) {
                switch ($object["type"]) {
                    case "user":
                        return $userType;
                    case "object":
                        return $objectType;
                    case "group":
                        return $groupType;
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

        $userType = new ObjectType([
            "name" => "User",
            "interfaces" => [$entityInterface],
            "fields" => [
                "guid" => [
                    "type" => Type::nonNull(Type::string())
                ],
                "name" => [
                    "type" => Type::nonNull(Type::string())
                ],
                "icon" => [
                    "type" => Type::nonNull(Type::string())
                ],
                "url" => [
                    "type" => Type::nonNull(Type::string())
                ]
            ]
        ]);

        $groupType = new ObjectType([
            "name" => "Group",
            "interfaces" => [$entityInterface],
            "fields" => [
                "guid" => [
                    "type" => Type::nonNull(Type::string())
                ],
                "name" => [
                    "type" => Type::nonNull(Type::string())
                ],
                "icon" => [
                    "type" => Type::nonNull(Type::string())
                ],
                "canEdit" => [
                    "type" => Type::nonNull(Type::boolean())
                ],
                "isClosed" => [
                    "type" => Type::nonNull(Type::boolean())
                ],
                "canJoin" => [
                    "type" => Type::nonNull(Type::boolean())
                ],
                "defaultAccessId" => [
                    "type" => Type::nonNull(Type::int())
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
                "title" => [
                    "type" => Type::nonNull(Type::string())
                ],
                "description" => [
                    "type" => Type::nonNull(Type::string())
                ],
                "url" => [
                    "type" => Type::nonNull(Type::string())
                ],
                "tags" => [
                    "type" => Type::listOf(Type::string())
                ],
                "timeCreated" => [
                    "type" => Type::nonNull(Type::string())
                ],
                "timeUpdated" => [
                    "type" => Type::nonNull(Type::string())
                ],
                "canEdit" => [
                    "type" => Type::nonNull(Type::boolean())
                ],
                "canComment" => [
                    "type" => Type::nonNull(Type::boolean())
                ],
                "accessId" => [
                    "type" => Type::nonNull(Type::int())
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
                ]
            ]
        ]);

        $searchListType = new ObjectType([
            "name" => "Search",
            "fields" => [
                "total" => [
                    "type" => Type::nonNull(Type::int())
                ],
                "results" => [
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
                "entities" => [
                    "type" => Type::listOf($entityInterface)
                ]
            ]
        ]);

        $viewerType = new ObjectType([
            "name" => "Viewer",
            "description" => "The current site viewer",
            "fields" => [
                "id" => [
                    "type" => Type::nonNull(Type::string())
                ],
                "loggedIn" => [
                    "type" => Type::nonNull(Type::boolean())
                ],
                "username" => [
                    "type" => Type::string()
                ],
                "name" => [
                    "type" => Type::string()
                ],
                "icon" => [
                    "type" => Type::string()
                ],
                "url" => [
                    "type" => Type::string()
                ]
            ]
        ]);

        $menuItemType = new ObjectType([
            "name" => "MenuItem",
            "fields" => [
                "guid" => [
                    "type" => Type::nonNull(Type::string())
                ],
                "title" => [
                    "type" => Type::nonNull(Type::string())
                ],
                "link" => [
                    "type" => Type::nonNull(Type::string())
                ],
                "js" => [
                    "type" => Type::nonNull(Type::boolean())
                ]
            ]
        ]);

        $siteType = new ObjectType([
            "name" => "Site",
            "description" => "The current site",
            "fields" => [
                "id" => [
                    "type" => Type::nonNull(Type::string())
                ],
                "title" => [
                    "type" => Type::nonNull(Type::string())
                ],
                "menu" => [
                    "type" => Type::listOf($menuItemType)
                ],
                "accessIds" => [
                    "type" => Type::listOf($accessIdType)
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
                            "type" => Type::nonNull(Type::string())
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
                        "offset" => [
                            "type" => Type::int()
                        ],
                        "limit" => [
                            "type" => Type::int()
                        ]
                    ],
                    "resolve" => "Pleio\Resolver::search"
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
                "username" => [
                    "type" => $viewerType,
                    "resolve" => function($username) {
                        return ["username" => $username];
                    }
                ]
            ],
            "mutateAndGetPayload" => "Pleio\Mutations::register"
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
                    "resolve" => function($guid) {
                        return Resolver::getEntity(null, ["guid" => $guid], null);
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
                    "resolve" => function($guid) {
                        return Resolver::getEntity(null, ["guid" => $guid], null);
                    }
                ]
            ],
            "mutateAndGetPayload" => "Pleio\Mutations::editEntity"
        ]);

        $deleteEntityMutation = Relay::mutationWithClientMutationId([
            "name" => "deleteEntity",
            "inputFields" => [
                "guid" => [
                    "type" => Type::nonNull(Type::string())
                ]
            ],
            "outputFields" => [
                "result" => [
                    "type" => Type::nonNull(Type::boolean()),
                    "resolve" => function($result) {
                        return $result;
                    }
                ]
            ],
            "mutateAndGetPayload" => "Pleio\Mutations::deleteEntity"
        ]);

        $mutationType = new ObjectType([
            "name" => "Mutation",
            "fields" => [
                    "login" => $loginMutation,
                    "logout" => $logoutMutation,
                    "register" => $registerMutation,
                    "forgotPassword" => $forgotPasswordMutation,
                    "addEntity" => $addEntityMutation,
                    "editEntity" => $editEntityMutation,
                    "deleteEntity" => $deleteEntityMutation,
                    "subscribeNewsletter" => $subscribeNewsletterMutation
            ]
        ]);

        $schema = new Schema($queryType, $mutationType);
        return $schema;
   }
}