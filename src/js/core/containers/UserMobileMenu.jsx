import React from "react"
import { NavLink } from "react-router-dom"

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
                        <NavLink to="/bookmarks" onClick={this.props.onClick} title="Bewaard" className="mobile-navigation__action ___bookmarks" activeClassName="___is_active" />
                    </li>
                    <li>
                        <NavLink to="/search" title="Zoeken" className="mobile-navigation__action ___search" />
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
                        <a href="#" onClick={this.toggleSearch} title="Zoeken" className="mobile-navigation__action ___search" />
                    </li>
                    <li>
                        <a href="#" onClick={this.props.onClick} title="Inloggen" className="mobile-navigation__action ___login">
                            Inloggen
                        </a>
                    </li>
                    <li>
                        <a href="#" onClick={this.props.onClick} title="Registreren" className="mobile-navigation__action ___register">
                            Registreren
                        </a>
                    </li>
                </ul>
            )
        }

        return menuItems
    }
}