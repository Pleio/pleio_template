import React from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import AccountPassword from "./components/AccountPassword"
import AccountEmail from "./components/AccountEmail"

class Account extends React.Component {
    render() {
        const { entity } = this.props.data

        if (!entity || !entity.canEdit) {
            return (
                <div></div>
            )
        }

        return (
            <section className="section ___grey ___grow">
                <div className="container">
                    <AccountPassword entity={entity} />
                    <AccountEmail entity={entity} />
                </div>
            </section>
        )
    }
}

const Query = gql`
    query ProfileAccount($username: String!) {
        entity(username: $username) {
            guid
            status
            ... on User {
                canEdit
                email
                tags
            }
        }
    }
`;

const withQuery = graphql(Query, {
    options: (ownProps) => {
        return {
            variables: {
                username: ownProps.params.username
            }
        }
    }
})

export default withQuery(Account)