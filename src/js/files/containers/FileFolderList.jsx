import React from "react"
import InfiniteList from "../../core/components/InfiniteList"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

const Query = gql`
    query FilesList($type: Type!, $subtype: String, $containerGuid: Int, $offset: Int!, $limit: Int!) {
        entities(type: $type, subtype: $subtype, containerGuid: $containerGuid, offset: $offset, limit: $limit) {
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