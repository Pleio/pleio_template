import React from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import AccountPassword from "./components/AccountPassword"
import AccountEmail from "./components/AccountEmail"
import Wrapper from "./components/Wrapper"

class Account extends React.Component {
    render() {
        const { entity } = this.props.data

        if (!entity || !entity.canEdit) {
            return (
                <div></div>
            )
        }

        return (
            <Wrapper match={this.props.match}>
                <section className="section ___grey ___grow">
                    <div className="container">
                        <AccountPassword entity={entity} />
                        <AccountEmail entity={entity} />
                    </div>
                </section>
            </Wrapper>
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
                username: ownProps.match.params.username
            }
        }
    }
})

export default withQuery(Account)