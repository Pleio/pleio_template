import React from "react"
import InfiniteList from "../../core/components/InfiniteList"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

const Query = gql`
    query GroupsList($type: Type!, $offset: Int!, $limit: Int!) {
        entities(type: $type, offset: $offset, limit: $limit) {
            total
            canWrite
            edges {
                guid
                ... on Group {
                    guid
                    name
                    description
                    isClosed
                    membership
                    members {
                        total
                    }
                    icon
                    url
                }
            }
        }
    }
`

const withQuery = graphql(Query)
export default withQuery(InfiniteList)