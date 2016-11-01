import React from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import ContentHeader from "../../core/components/ContentHeader"
import TabMenu from "../../core/components/TabMenu"
import { Link } from "react-router"
import ProfileField from "./ProfileField"

class Wrapper extends React.Component {
    render() {
        let { viewer, entity } = this.props.data

        if (!entity) {
            // Loading...
            return (
                <div className="page-layout"></div>
            )
        }

        let baseLink = "/profile/" + this.props.params.username

        let options = [
            {title: "Profiel", link: baseLink},
            {title: "Instellingen", link: baseLink + "/settings"},
            {title: "Account", link: baseLink + "/account"}
        ]

        let logout
        if (viewer.loggedIn) {
            logout = (
                <Link to="/logout" className="button ___large ___logout">
                    <span>Uitloggen</span>
                </Link>
            )
        }

        return (
            <div className="page-layout">
                <ContentHeader className="___no-padding-bottom">
                    <div className="row">
                        <div className="col-sm-6 middle-sm">
                            <ProfileField type="h3" entity={entity} canEdit={entity.canEdit} dataKey="name" name="Naam" value={entity.name} />
                        </div>
                        <div className="col-sm-6 end-sm">
                            <a href="https://www.pleio.nl" target="_blank" className="button ___large ___line ___margin-right ___pleio">
                                Pleio
                            </a>
                            {logout}
                        </div>
                    </div>
                    <TabMenu options={options} />
                </ContentHeader>
                {this.props.children}
            </div>
        )
    }
}

const query = gql`
    query ProfileWrapper($username: String!) {
        viewer {
            guid
            loggedIn
        }
        entity(username: $username) {
            guid
            ... on User {
                name
                canEdit
                icon
            }
        }
    }
`;

export default graphql(query, {
    options: (ownProps) => {
        return {
            variables: {
                username: ownProps.params.username
            }
        }
    }
})(Wrapper);