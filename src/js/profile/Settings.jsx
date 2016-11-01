import React from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import SettingsInterests from "./components/SettingsInterests"
import SettingsNotifications from "./components/SettingsNotifications"

class Settings extends React.Component {
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
                    <SettingsInterests entity={entity} />
                    <SettingsNotifications entity={entity} />
                </div>
            </section>
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
                getsNotificationOnReply
                getsNewsletter
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

export default withQuery(Settings)