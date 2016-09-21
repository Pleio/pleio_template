import React from "react"
import { graphql } from "react-apollo"
import { connect } from "react-redux"
import { showModal } from "../lib/actions"
import { browserHistory } from "react-router"
import gql from "graphql-tag"
import client from "../lib/client"

class UserMenu extends React.Component {
    constructor(props) {
        super(props)

        this.onLogin = this.onLogin.bind(this)
        this.onLogout = this.onLogout.bind(this)
    }

    onLogin(e) {
        e.preventDefault()
        this.props.dispatch(showModal('login'))
    }

    onLogout(e) {
        e.preventDefault()
        this.props.mutate({
            variables: {
                input: {
                    clientMutationId: 1
                }
            }
        }).then(({data}) => {
            if (data.logout.viewer.loggedIn === false) {
                browserHistory.push("/")
                client.resetStore()
            }
        }).catch((errors) => {

        })
    }

    render() {
        let userMenu = (<ul className="navigation__actions"></ul>);

        if (this.props.viewer && this.props.viewer.loggedIn) {
            userMenu = (
                <ul className="navigation__actions">
                    <li><a href="#" title="Bookmarks" className="navigation__action ___bookmarks"><span>Bookmarks</span></a></li>
                    <li><a href="#" title="Zoeken" data-search-trigger className="navigation__action ___search"></a></li>
                    <li>
                        <a href="#" title="Account" className="navigation__action ___account">
                            <span>Sarah Hendriks</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" onClick={this.onLogout}>Logout</a>
                    </li>
                </ul>
            )
        }

        if (this.props.viewer && !this.props.viewer.loggedIn) {
            userMenu = (
                <ul className="navigation__actions">
                    <li><a href="#" title="Zoeken" data-search-trigger className="navigation__action ___search"></a></li>
                    <li>
                        <a href="#" onClick={this.onLogin}>Login</a>
                    </li>
                </ul>
            )
        }

        return userMenu;
    }
}

const stateToProps = (state) => {
    return {
        modal: state.modal
    }
}

const LOGOUT = gql`
    mutation logout($input: logoutInput!) {
        logout(input: $input) {
            viewer {
                loggedIn
            }
        }
    }
`
const withLogout = graphql(LOGOUT)

export default connect(stateToProps)(withLogout(UserMenu))