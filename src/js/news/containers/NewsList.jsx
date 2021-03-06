import React from "react"
import InfiniteList from "../../core/components/InfiniteList"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

const Query = gql`
    query NewsList($offset: Int!, $limit: Int!, $tags: [String!], $subtype: String!) {
        entities(offset: $offset, limit: $limit, tags: $tags, subtype: $subtype) {
            total
            canWrite
            edges {
                guid
                ... on Object {
                    guid
                    title
                    url
                    excerpt
                    votes
                    hasVoted
                    isBookmarked
                    canBookmark
                    tags
                    isHighlighted
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
                        url
                        icon
                    }
                }
            }
        }
    }
`

const withQuery = graphql(Query)
export default withQuery(InfiniteList)