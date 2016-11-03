import React from "react"
import InfiniteList from "../components/InfiniteList"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

const Query = gql`
    query BookmarkList($offset: Int!, $limit: Int!, $tags: [String], $subtype: String) {
        bookmarks(offset: $offset, limit: $limit, tags: $tags, subtype: $subtype) {
            total
            entities {
                guid
                ... on Object {
                    guid
                    title
                    subtype
                    excerpt
                    votes
                    hasVoted
                    isBookmarked
                    canBookmark
                    tags
                    isFeatured
                    featuredImage
                    timeCreated
                    views
                    commentCount
                    owner {
                        guid
                        name
                        icon
                    }
                }
            }
        }
    }
`

const withQuery = graphql(Query)
export default withQuery(InfiniteList)