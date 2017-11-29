import React from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import SettingsInterests from "./components/SettingsInterests"
import SettingsNotifications from "./components/SettingsNotifications"
import SettingsEmailOverview from "./components/SettingsEmailOverview"
import Wrapper from "./components/Wrapper"

class Settings extends React.Component {
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
                        <div className="row">
                            <div className="col-md-8">
                                <SettingsInterests entity={entity} />
                                <SettingsNotifications entity={entity} />
                            </div>
                            <div className="col-md-4">
                                <SettingsEmailOverview entity={entity} />
                            </div>
                        </div>
                    </div>
                </section>
            </Wrapper>
        )
    }
}

const Query = gql`
    query ProfileSettings($username: String!) {
        entity(username: $username) {
            guid
            status
            ... on User {
                canEdit
                emailNotifications
                getsNewsletter
                emailOverview
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