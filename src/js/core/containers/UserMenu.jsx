import React from "react"
import { graphql } from "react-apollo"
import { NavLink } from "react-router-dom"

class UserMenu extends React.Component {
    render() {
        if (!this.props.viewer) {
            return (
                <div></div>
            )
        }

        let userMenu = (<ul className="navigation__actions"></ul>);

        if (this.props.viewer.loggedIn) {
            return (
                <ul className="navigation__actions">
                    <li>
                        <NavLink to="/bookmarks" onClick={this.props.onClick} title="Bewaard" className="navigation__action ___bookmarks">
                            <span>Bewaard</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/search" title="Zoeken" className="navigation__action ___search" />
                    </li>
                    <li>
                        <NavLink to={"/profile/" + this.props.viewer.user.username} onClick={this.props.onClick} title="Account" className="navigation__action ___account">
                            <div style={{backgroundImage: "url('" + this.props.viewer.user.icon + "')"}} className="navigation__picture"></div>
                            <span>{this.props.viewer.user.name}</span>
                        </NavLink>
                    </li>
                </ul>
            )
        } else {
            return (
                <ul className="navigation__actions">
                    <li>
                        <NavLink to="/search" title="Zoeken" className="navigation__action ___search" />
                    </li>
                    <li>
                        <NavLink to="/login" title="Inloggen" className="navigation__action ___login">
                            Inloggen
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/register" title="Registeren" className="navigation__action ___register">
                            Registeren
                        </NavLink>
                    </li>
                </ul>
            )
        }
    }
}

export default UserMenu