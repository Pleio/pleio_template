import React from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

class UsersOnline extends React.Component {
    render() {
        const { site } = this.props.data

        if (!site) {
            return (
                <div></div>
            )
        }

        return (
            <div className="col-sm-4 col-lg-3 col-lg-offset-3 end-lg middle-lg">
                <div className="users-online ___grey">
                    <span>
                        {site.usersOnline} {site.usersOnline == 1 ? "leraar" : "leraren"} online
                    </span>
                </div>
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