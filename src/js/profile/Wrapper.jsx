import React from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import ContentHeader from "../core/components/ContentHeader"
import TabMenu from "../core/components/TabMenu"
import { Link } from "react-router"

class Wrapper extends React.Component {
    render() {
        if (!this.props.data.entity) {
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

        return (
            <div className="page-layout">
                <ContentHeader className="___no-padding-bottom">
                    <div className="row">
                        <div className="col-sm-6 middle-sm">
                            <h3 className="main__title ___no-margin">
                                {this.props.data.entity.name}
                            </h3>
                        </div>
                        <div className="col-sm-6 end-sm">
                            <a href="https://www.pleio.nl" target="_blank" className="button ___large ___line ___margin-right ___pleio">
                                Pleio
                            </a>
                            <Link to="/logout" className="button ___large ___logout">
                                <span>Uitloggen</span>
                            </Link>
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
        entity(username: $username) {
            guid
            ... on User {
                guid
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