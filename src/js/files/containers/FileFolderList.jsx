import React from "react"
import InfiniteList from "../../core/components/InfiniteList"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

const Query = gql`
    query FilesList($containerGuid: String!, $filter: String, $offset: Int!, $limit: Int!, $orderBy: String, $direction: String) {
        files(containerGuid: $containerGuid, filter: $filter, offset: $offset, limit: $limit, orderBy: $orderBy, direction: $direction) {
            total
            canWrite
            edges {
                guid
                ... on Object {
                    subtype
                    title
                    url
                    timeCreated
                    mimeType
                    canEdit
                    thumbnail
                    accessId
                    writeAccessId
                    owner {
                        guid
                        name
                    }
                }
            }
        }
    }
`

export default graphql(Query)(InfiniteList)