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
                    owner {
                        name
                    }
                    ... on Object {
                        title
                        url
                        subtype
                        tags
                    }
                }
            }
        }
    }
`

const withQuery = graphql(Query)
export default withQuery(InfiniteList)