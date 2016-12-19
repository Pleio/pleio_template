import React from "react"
import { Link } from "react-router"
import NavigationSearch from "../../search/components/NavigationSearch"

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
                        <Link to="/bookmarks" onClick={this.props.onClick} title="Bewaard" className="mobile-navigation__action ___bookmarks" activeClassName="___is_active" />
                    </li>
                    <li>
                        <a href="#" onClick={() => document.body.classList.toggle("navigation-search-open")} title="Zoeken" className="mobile-navigation__action ___search" />
                        <NavigationSearch />
                    </li>
                    <li>
                        <Link to={"/profile/" + this.props.viewer.user.username} onClick={this.props.onClick} title="Account" className="mobile-navigation__action ___account" activeClassName="___is_active">
                            <div style={{backgroundImage: "url('" + this.props.viewer.user.icon + "')"}} className="mobile-navigation__picture"></div>
                        </Link>
                    </li>
                </ul>
            )
        } else {
            menuItems = (
                <ul className="mobile-navigation__actions">
                    <li>
                        <a href="#" onClick={() => document.body.classList.toggle("navigation-search-open")} title="Zoeken" className="mobile-navigation__action ___search" />
                        <NavigationSearch />
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