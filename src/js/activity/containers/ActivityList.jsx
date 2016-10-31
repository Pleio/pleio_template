import React from 'react'
import InfiniteList from "../components/InfiniteList"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

const Query = gql`
    query InfiniteList($offset: Int!, $limit: Int!, $tags: [String!]) {
        activities(offset: $offset, limit: $limit, tags: $tags) {
            total
            activities {
                guid
                type
                object {
                    guid
                    ... on Object {
                        guid
                        title
                        url
                        featuredImage
                        subtype
                        tags
                        timeCreated
                        isBookmarked
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

const withQuery = graphql(Query)
export default withQuery(InfiniteList)