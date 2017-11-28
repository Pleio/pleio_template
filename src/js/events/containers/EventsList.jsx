import React from "react"
import InfiniteList from "../../core/components/InfiniteList"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

const Query = gql`
    query EventsList($filter: EventFilter, $offset: Int, $limit: Int) {
        events(filter: $filter, offset: $offset, limit: $limit) {
            total
            canWrite
            edges {
                guid
                ... on Object {
                    guid
                    title
                    url
                    excerpt
                    votes
                    hasVoted
                    isBookmarked
                    inGroup
                    canBookmark
                    tags
                    isFeatured
                    featured {
                        image
                        video
                        positionY
                    }
                    startDate
                    endDate
                    timeCreated
                    owner {
                        guid
                        username
                        name
                        url
                        icon
                    }
                    attendees(limit: 5) {
                        total
                        edges {
                            guid
                            username
                            name
                            icon
                        }
                    }
                }
            }
        }
    }
`

const withQuery = graphql(Query)
export default withQuery(InfiniteList)