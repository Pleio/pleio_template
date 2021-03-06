import React from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import SettingsInterests from "./components/SettingsInterests"
import SettingsNotifications from "./components/SettingsNotifications"
import SettingsGroupNotifications from "./components/SettingsGroupNotifications"
import SettingsEmailOverview from "./components/SettingsEmailOverview"
import Wrapper from "./components/Wrapper"

class Interests extends React.Component {
    render() {
        const { entity, groups, site } = this.props.data

        if (!entity || !entity.canEdit) {
            return (
                <div />
            )
        }

        let interests
        if (site.filters.length > 0) {
            interests = (
                <SettingsInterests entity={entity} />
            )
        }

        return (
            <Wrapper match={this.props.match}>
                <section className="section ___grey ___grow">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-8">
                                {interests}
                                <SettingsNotifications entity={entity} />
                                <SettingsGroupNotifications entity={entity} groups={groups} />
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
    query ProfileSettings($username: String!, $filter: GroupFilter) {
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
        groups(filter: $filter, limit: 50) {
            total
            edges {
                guid
                name
                getsNotifications
            }
        }
        site {
            guid
            filters {
                name
                values
            }
        }
    }
`

const Settings = {
    options: (ownProps) => {
        return {
            variables: {
                username: ownProps.match.params.username,
                filter: "mine"
            }
        }
    }
}



export default graphql(Query, Settings)(Interests)