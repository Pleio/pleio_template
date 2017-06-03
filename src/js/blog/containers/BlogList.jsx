import React from "react"
import InfiniteList from "../../core/components/InfiniteList"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

const Query = gql`
    query BlogList($containerGuid: Int, $offset: Int, $limit: Int, $tags: [String!], $subtype: String) {
        entities(containerGuid: $containerGuid, offset: $offset, limit: $limit, tags: $tags, subtype: $subtype) {
            total
            canWrite
            edges {
                guid
                ... on Object {
                    guid
                    title
                    excerpt
                    url
                    votes
                    hasVoted
                    isBookmarked
                    canBookmark
                    tags
                    isFeatured
                    featured {
                        image
                        video
                        positionY
                    }
                    timeCreated
                    views
                    commentCount
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
`

const withQuery = graphql(Query)
export default withQuery(InfiniteList)