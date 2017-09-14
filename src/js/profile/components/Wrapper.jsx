import React from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import ContentHeader from "../../core/components/ContentHeader"
import TabMenu from "../../core/components/TabMenu"
import { Link } from "react-router-dom"
import ProfileField from "./ProfileField"
import classnames from "classnames"

class Wrapper extends React.Component {
    render() {
        let { viewer, entity } = this.props.data

        if (!entity) {
            // Loading...
            return (
                <div className="page-container"></div>
            )
        }

        let baseLink = "/profile/" + this.props.match.params.username

        let options = [
            {title: "Profiel", link: baseLink},
            {title: "Interesses", link: baseLink + "/interests"},
            {title: "Instellingen", link: baseLink + "/settings"}
        ]

        let menu
        if (entity.canEdit) {
            menu = (
                <TabMenu options={options} />
            )
        }

        let logout
        if (viewer.loggedIn) {
            logout = (
                <Link to="/logout" className="button ___large ___logout">
                    <span>Uitloggen</span>
                </Link>
            )
        }

        return (
            <div className="page-container">
                <ContentHeader className={classnames({"___no-padding-bottom":entity.canEdit})}>
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
                    {menu}
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
                username: ownProps.match.params.username
            }
        }
    }
})(Wrapper);