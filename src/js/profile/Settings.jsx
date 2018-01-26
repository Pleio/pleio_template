import React from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import AccountPassword from "./components/AccountPassword"
import AccountEmail from "./components/AccountEmail"
import Wrapper from "./components/Wrapper"

class Settings extends React.Component {
    render() {
        const { entity } = this.props.data

        if (window.__SETTINGS__['externalLogin']) {
            return (
                <Wrapper match={this.props.match}>
                    <section className="section ___grey ___grow">
                        <div className="container">
                            <div className="card-profile">
                                <h3 className="card-profile__title">Instellingen</h3>
                                <p>Voor het wijzigen van je wachtwoord en e-mailadres ga je naar Pleio.</p>
                                <a href="https://www.pleio.nl/dashboard" className="button ___large" target="_blank">Ga naar Pleio</a>
                            </div>
                        </div>
                    </section>
                </Wrapper>
            )
        }


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

export default withQuery(Settings)