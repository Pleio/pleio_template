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
        $userInterface = new ObjectType([
            "name" => "User",
            "fields" => [
                "guid" => [
                    "type" => Type::nonNull(Type::string())
                ],
                "name" => [
                    "type" => Type::nonNull(Type::string())
                ],
                "icon" => [
                    "type" => Type::nonNull(Type::string())
                ]
            ]
        ]);

        $commentInterface = new ObjectType([
            "name" => "Comment",
            "fields" => [
                "guid" => [
                    "type" => Type::nonNull(Type::string()),
                ],
                "description" => [
                    "type" => Type::nonNull(Type::string())
                ],
                "timeCreated" => [
                    "type" => Type::nonNull(Type::string())
                ],
                "timeUpdated" => [
                    "type" => Type::nonNull(Type::string())
                ],
                "owner" => [
                    "type" => $userInterface
                ]
            ]
        ]);

        $objectInterface = new ObjectType([
            'name' => 'Object',
            'fields' => [
                'guid' => [
                    'type' => Type::nonNull(Type::string())
                ],
                'title' => [
                    'type' => Type::nonNull(Type::string())
                ],
                'description' => [
                    'type' => Type::nonNull(Type::string())
                ],
                'url' => [
                    'type' => Type::nonNull(Type::string())
                ],
                'tags' => [
                    'type' => Type::listOf(Type::string())
                ],
                "timeCreated" => [
                    "type" => Type::nonNull(Type::string())
                ],
                "timeUpdated" => [
                    "type" => Type::nonNull(Type::string())
                ],
                "owner" => [
                    "type" => $userInterface,
                    "resolve" => function($object) {
                        return Resolver::getUser($object);
                    }
                ],
                "comments" => [
                    "type" => Type::listOf($commentInterface),
                    "resolve" => function($object) {
                        return Resolver::getComments($object);
                    }
                ]
            ]
        ]);

        $menuItemInterface = new ObjectType([
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

        $searchInterface = new ObjectType([
            'name' => 'Search',
            'fields' => [
                'total' => [
                    'type' => Type::nonNull(Type::int())
                ],
                'results' => [
                    'type' => Type::listOf($objectInterface)
                ]
            ]
        ]);

        $entitiesInterface = new ObjectType([
            'name' => 'EntitiesList',
            'fields' => [
                'total' => [
                    'type' => Type::nonNull(Type::int())
                ],
                'entities' => [
                    'type' => Type::listOf($objectInterface)
                ]
            ]
        ]);

        $viewerInterface = new ObjectType([
            'name' => 'Viewer',
            'description' => 'The current site viewer',
            'fields' => [
                'id' => [
                    'type' => Type::nonNull(Type::string())
                ],
                'loggedIn' => [
                    'type' => Type::nonNull(Type::boolean())
                ],
                'username' => [
                    'type' => Type::string()
                ],
                'name' => [
                    'type' => Type::string()
                ]
            ]
        ]);

        $siteInterface = new ObjectType([
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
                    "type" => Type::listOf($menuItemInterface)
                ]
            ]
        ]);

        $queryType = new ObjectType([
            'name' => 'Query',
            'fields' => [
                'viewer' => [
                    'type' => $viewerInterface,
                    'resolve' => 'Pleio\Resolver::getViewer'
                ],
                'node' => [
                    'type' => $objectInterface,
                    'args' => [
                        "guid" => [
                            "type" => Type::nonNull(Type::string())
                        ]
                    ],
                    'resolve' => 'Pleio\Resolver::getNode'
                ],
                'search' => [
                    'type' => $searchInterface,
                    'args' => [
                        'q' => [
                            'type' => Type::nonNull(Type::string()),
                        ],
                        'offset' => [
                            'type' => Type::int()
                        ],
                        'limit' => [
                            'type' => Type::int()
                        ]
                    ],
                    'resolve' => 'Pleio\Resolver::search'
                ],
                'entities' => [
                    'type' => $entitiesInterface,
                    'args' => [
                        'offset' => [
                            'type' => Type::int()
                        ],
                        'limit' => [
                            'type' => Type::int()
                        ]
                    ],
                    'resolve' => 'Pleio\Resolver::getEntities'
                ],
                'site' => [
                    'type' => $siteInterface,
                    'resolve' => 'Pleio\Resolver::site'
                ]
            ]
        ]);

        $loginMutation = Relay::mutationWithClientMutationId([
            'name' => 'login',
            'inputFields' => [
                'username' => [
                    'type' => Type::nonNull(Type::string())
                ],
                'password' => [
                    'type' => Type::nonNull(Type::string())
                ],
                'rememberMe' => [
                    'type' => Type::boolean()
                ]
            ],
            'outputFields' => [
                'viewer' => [
                    'type' => $viewerInterface,
                    'resolve' => 'Pleio\Resolver::getViewer'
                ]
            ],
            'mutateAndGetPayload' => 'Pleio\Mutations::login'
        ]);

        $registerMutation = Relay::mutationWithClientMutationId([
            'name' => 'register',
            'inputFields' => [
                'name' => [
                    'type' => Type::nonNull(Type::string())
                ],
                'email' => [
                    'type' => Type::nonNull(Type::string())
                ],
                'password' => [
                    'type' => Type::nonNull(Type::string())
                ],
                'newsletter' => [
                    'type' => Type::boolean()
                ],
                'terms' => [
                    'type' => Type::boolean()
                ]
            ],
            'outputFields' => [
                'viewer' => [
                    'type' => $viewerInterface,
                    'resolve' => 'Pleio\Resolver::getViewer'
                ]
            ],
            'mutateAndGetPayload' => 'Pleio\Mutations::register'
        ]);

        $subscribeNewsletterMutation = Relay::mutationWithClientMutationId([
            'name' => 'subscribeNewsletter',
            'inputFields' => [
                'email' => [
                    'type' => Type::nonNull(Type::string())
                ]
            ],
            'outputFields' => [
                'viewer' => [
                    'type' => $viewerInterface,
                    'resolve' => 'Pleio\Resolver::getViewer'
                ]
            ],
            'mutateAndGetPayload' => 'Pleio\Mutations::subscribeNewsletter'
        ]);

        $mutationType = new ObjectType([
            'name' => "Mutation",
            'fields' => function() use ($loginMutation, $registerMutation, $subscribeNewsletterMutation) {
                return [
                    'login' => $loginMutation,
                    'register' => $registerMutation,
                    'subscribeNewsletter' => $subscribeNewsletterMutation
                ];
            }
        ]);

        $schema = new Schema($queryType, $mutationType);
        return $schema;
   }
}