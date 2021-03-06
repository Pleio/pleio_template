import React from "react"
import { Link } from "react-router-dom"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import { showShortDate } from "../../lib/showDate"
import InfiniteList from "../../core/components/InfiniteList"

const Query = gql`
    query ResultList($q: String!, $containerGuid: String, $type: Type, $subtype: String, $offset: Int, $limit: Int) {
        search(q: $q, containerGuid: $containerGuid, offset: $offset, limit: $limit, type: $type, subtype: $subtype) {
            total
            totals {
                subtype
                total
            }
            edges {
                guid
                ... on User {
                    name
                    url
                    icon
                }
                ... on Group {
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
                ... on Object {
                    title
                    url
                    featured {
                        image
                        video
                        positionY
                    }
                    subtype
                    tags
                    excerpt
                    timeCreated
                    startDate
                    endDate
                    location
                    isBookmarked
                    canBookmark
                    commentCount
                    hasVoted
                    votes
                    owner {
                        guid
                        username
                        name
                        icon
                        url
                    }
                }
            }
        }
    }
`;

export default graphql(Query)(InfiniteList);