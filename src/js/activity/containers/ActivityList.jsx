import React from 'react'
import InfiniteList from "../components/InfiniteList"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

const Query = gql`
    query InfiniteList($offset: Int!, $limit: Int!, $tags: [String!]) {
        activities(offset: $offset, limit: $limit, tags: $tags) {
            total
            entities {
                guid
                timeCreated
                subject {
                    guid
                    name
                    icon
                }
                object {
                    guid
                    ... on Object {
                        title
                        url
                        subtype
                    }
                }
            }
        }
    }
`

const withQuery = graphql(Query)
export default withQuery(InfiniteList)