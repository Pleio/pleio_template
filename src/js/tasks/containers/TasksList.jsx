import React from "react"
import TasksList from "../components/TasksList"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

const Query = gql`
    query TasksList($type: Type!, $subtype: String!, $containerGuid: Int!, $offset: Int!, $limit: Int!) {
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
export default withQuery(TasksList)