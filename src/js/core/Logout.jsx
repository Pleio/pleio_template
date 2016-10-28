import React from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import client from "../lib/client"
import { browserHistory } from "react-router"

class Logout extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.props.mutate({
            variables: {
                input: {
                    clientMutationId: 1
                }
            }
        }).then(({data}) => {
            if (data.logout.viewer.loggedIn === false) {
                window.location.href = '/'
            }
        })
    }

    render() {
        return (
            <div></div>
        )
    }
}

const query = gql`
    mutation logout($input: logoutInput!) {
        logout(input: $input) {
            viewer {
                guid
                loggedIn
            }
        }
    }
`
const withQuery = graphql(query)
export default withQuery(Logout)
