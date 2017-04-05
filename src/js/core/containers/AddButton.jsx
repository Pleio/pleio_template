import React from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import AddButton from "../components/AddButton"

const Query = gql`
    query AddButton($containerGuid: Int, $subtype: String!) {
        entities(containerGuid: $containerGuid, subtype: $subtype) {
            canWrite
        }
    }
`

const withQuery = graphql(Query)
export default withQuery(AddButton)