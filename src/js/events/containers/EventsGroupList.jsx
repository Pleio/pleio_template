import React from "react"
import InfiniteList from "../../core/components/InfiniteList"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

const Query = gql`
    query EventsList($type: Type!, $subtype: String!, $containerGuid: Int!, $offset: Int!, $limit: Int!) {
        entities(type: $type, subtype: $subtype, containerGuid: $containerGuid, offset: $offset, limit: $limit) {
            total
            canWrite
            edges {
                guid
                ... on Object {
                    guid
                    title
                    startDate
                    endDate
                    url
                    excerpt
                    featured {
                        image
                        video
                        positionY
                    }
                }
            }
        }
    }
`

export default graphql(Query)(InfiniteList)