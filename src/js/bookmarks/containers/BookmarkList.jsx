import React from "react"
import InfiniteList from "../../core/components/InfiniteList"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

const Query = gql`
    query BookmarkList($offset: Int!, $limit: Int!, $tags: [String], $subtype: String) {
        bookmarks(offset: $offset, limit: $limit, tags: $tags, subtype: $subtype) {
            total
            edges {
                guid
                ... on Object {
                    guid
                    title
                    subtype
                    url
                    excerpt
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