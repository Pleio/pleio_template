import React from "react"
import InfiniteList from "../../core/components/InfiniteList"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

const Query = gql`
    query PageList($offset: Int!, $limit: Int!, $tags: [String!], $subtype: String!) {
        entities(offset: $offset, limit: $limit, tags: $tags, subtype: $subtype) {
            total
            canWrite
            edges {
                guid
                ... on Page {
                    guid
                    title
                    url
                }
            }
        }
    }
`

const withQuery = graphql(Query)
export default withQuery(InfiniteList)