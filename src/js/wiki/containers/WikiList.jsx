import React from "react"
import InfiniteList from "../../core/components/InfiniteList"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

const Query = gql`
    query PagesList($type: Type!, $subtype: String!, $containerGuid: Int!, $offset: Int!, $limit: Int!) {
        entities(type: $type, subtype: $subtype, containerGuid: $containerGuid, offset: $offset, limit: $limit) {
            total
            canWrite
            edges {
                guid
                ... on Object {
                    guid
                    title
                    excerpt
                }
            }
        }
    }
`

const withQuery = graphql(Query)
export default withQuery(InfiniteList)