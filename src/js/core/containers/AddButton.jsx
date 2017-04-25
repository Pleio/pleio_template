import React from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import AddButton from "../components/AddButton"

const Query = gql`
    query AddButton($containerGuid: String, $subtype: String!) {
        viewer {
            guid
            canWriteToContainer(containerGuid: $containerGuid, subtype: $subtype)
        }
    }
`

const withQuery = graphql(Query)
export default withQuery(AddButton)