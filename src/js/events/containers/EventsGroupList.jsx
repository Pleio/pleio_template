import React from "react"
import InfiniteList from "../../core/components/InfiniteList"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

const Query = gql`
    query EventsList($filter: EventFilter, $containerGuid: Int, $offset: Int, $limit: Int) {
        events(filter: $filter, containerGuid: $containerGuid, offset: $offset, limit: $limit) {
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
                    inGroup
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