import React from "react"
import InfiniteList from "../../core/components/InfiniteList"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

const Query = gql`
    query InfiniteList($offset: Int!, $limit: Int!, $tags: [String!]) {
        activities(offset: $offset, limit: $limit, tags: $tags) {
            total
            edges {
                guid
                type
                object {
                    guid
                    ... on Object {
                        title
                        url
                        excerpt
                        description
                        richDescription
                        isHighlighted
                        featured {
                            image
                            video
                            positionY
                        }
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
                group {
                    guid
                    ... on Group {
                        name
                        url
                    }
                }
            }
        }
    }
`

export default graphql(Query)(InfiniteList)