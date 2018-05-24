import React from "react"
import { NavLink, withRouter } from "react-router-dom"

class UserMobileMenu extends React.Component {
    render () {
        let menuItems = ""

        if (!this.props.viewer) {
            return (
                <div></div>
            )
        }

        if (this.props.viewer.loggedIn) {
            menuItems = (
                <ul className="mobile-navigation__actions">
                    <li>
                        <NavLink to="/search" title="Zoeken" className="mobile-navigation__action ___search" />
                    </li>
                    <li>
                        <NavLink to="/saved" onClick={this.props.onClick} title="Bewaard" className="mobile-navigation__action ___bookmarks" activeClassName="___is_active" />
                    </li>
                    <li>
                        <NavLink to={"/profile/" + this.props.viewer.user.username} onClick={this.props.onClick} title="Account" className="mobile-navigation__action ___account" activeClassName="___is_active">
                            <div style={{backgroundImage: "url('" + this.props.viewer.user.icon + "')"}} className="mobile-navigation__picture"></div>
                        </NavLink>
                    </li>
                </ul>
            )
        } else {
            menuItems = (
                <ul className="mobile-navigation__actions">
                    <li>
                        <NavLink to="/search" title="Zoeken" className="mobile-navigation__action ___search" />
                    </li>
                    <li>
                        <NavLink to={{pathname: "/login", state: { next: location.pathname }}} title="Inloggen" className="mobile-navigation__action ___login">
                            Inloggen
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/register" title="Registreren" className="mobile-navigation__action ___register">
                            Registreren
                        </NavLink>
                    </li>
                </ul>
            )
        }

        return menuItems
    }
}

export default withRouter(UserMobileMenu)