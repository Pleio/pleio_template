import React from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import classnames from "classnames"

class UsersOnline extends React.Component {
    render() {
        const { site } = this.props.data

        if (!site) {
            return (
                <div></div>
            )
        }

        return (
            <div className={classnames({"users-online":true, "___grey":this.props.isGrey})}>
                <span>
                    {site.usersOnline} {site.usersOnline == 1 ? "persoon" : "personen"} online
                </span>
            </div>
        )
    }
}

const Query = gql`
    query UsersOnline {
        site {
            guid
            usersOnline
        }
    }
`

const withQuery = graphql(Query)
export default withQuery(UsersOnline)