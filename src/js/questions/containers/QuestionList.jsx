import React from "react"
import InfiniteList from "../../core/components/InfiniteList"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

const Query = gql`
    query QuestionList($containerGuid: Int, $offset: Int!, $limit: Int!, $tags: [String!], $subtype: String!) {
        entities(containerGuid: $containerGuid, offset: $offset, limit: $limit, tags: $tags, subtype: $subtype) {
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
                    isFeatured
                    featuredImage
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