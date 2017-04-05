import React from "react"
import InfiniteList from "../../core/components/InfiniteList"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

const Query = gql`
    query InfiniteList($containerGuid: Int, $offset: Int!, $limit: Int!, $tags: [String!]) {
        activities(containerGuid: $containerGuid, offset: $offset, limit: $limit, tags: $tags) {
            total
            edges {
                guid
                type
                object {
                    guid
                    ... on Object {
                        guid
                        title
                        url
                        excerpt
                        featuredImage
                        subtype
                        tags
                        timeCreated
                        isBookmarked
                        canBookmark
                        commentCount
                        hasVoted
                        votes
                        owner {
                            guid
                            username
                            name
                            icon
                            url
                        }
                    }
                }
            }
        }
    }
`

export default graphql(Query)(InfiniteList)