import React from "react"
import InfiniteList from "../../core/components/InfiniteList"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

const Query = gql`
    query GroupsList($filter: GroupFilter, $offset: Int, $limit: Int) {
        groups(filter: $filter, offset: $offset, limit: $limit) {
            total
            canWrite
            edges {
                guid
                name
                canEdit
                excerpt
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
`

export default graphql(Query)(InfiniteList)