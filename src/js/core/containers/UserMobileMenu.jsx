import React from "react"
import { Link } from "react-router"

export default class UserMobileMenu extends React.Component {
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
                        <Link to="/bookmarks" title="Bewaard" className="mobile-navigation__action ___bookmarks" activeClassName="___is_active" />
                    </li>
                    <li>
                        <Link to="/search" title="Zoeken" className="mobile-navigation__action ___search" activeClassName="___is_active" />
                    </li>
                    <li>
                        <Link to={"/profile/" + this.props.viewer.user.username} title="Account" className="mobile-navigation__action ___account" activeClassName="___is_active">
                            <div style={{backgroundImage: "url('" + this.props.viewer.user.icon + "')"}} className="mobile-navigation__picture"></div>
                        </Link>
                    </li>
                </ul>
            )
        } else {
            menuItems = (
                <ul className="mobile-navigation__actions">
                    <li>
                        <Link to="/search" title="Zoeken" className="mobile-navigation__action ___search" activeClassName="___is_active" />
                    </li>
                    <li>
                        <Link to="/login" title="Inloggen" className="mobile-navigation__action ___login" activeClassName="___is_active">
                            Inloggen
                        </Link>
                    </li>
                    <li>
                        <Link to="/register" title="Registreren" className="mobile-navigation__action ___register" activeClassName="___is_active">
                            Registreren
                        </Link>
                    </li>
                </ul>
            )
        }

        return menuItems
    }
}