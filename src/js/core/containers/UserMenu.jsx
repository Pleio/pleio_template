import React from "react"
import { graphql } from "react-apollo"
import { NavLink, withRouter } from "react-router-dom"
import NotificationsTop from "../../notifications/components/NotificationsTop"
import Tooltip from "../../core/components/Tooltip"

class UserMenu extends React.Component {
    render() {
        const { viewer } = this.props

        if (!viewer) {
            return (
                <div></div>
            )
        }

        if (viewer.loggedIn) {
            const userMenu = [
                [ { title: "Bewaard", link: "/bookmarks", className: "___bookmarks" }, ],
                [
                    { title: "Profiel", link: `/profile/${viewer.user.username}` },
                    { title: "Interesses", link: `/profile/${viewer.user.username}/interests` },
                    { title: "Instellingen", link: `/profile/${viewer.user.username}/settings` }
                ],
                [ { title: "Uitloggen", link: "/logout" } ]
            ]

            return (
                <div className="navigation__actions">
                    <NavLink to="/search" title="Zoeken" className="navigation__action ___search" />
                    <NotificationsTop />
                    <div className="navigation__action ___account">
                        <div style={{backgroundImage: "url('" + viewer.user.icon + "')"}} className="navigation__picture"></div>
                        <span>{viewer.user.name}</span>
                        <Tooltip lists={userMenu} />
                    </div>
                </div>
            )
        } else {
            return (
                <ul className="navigation__actions">
                    <li>
                        <NavLink to="/search" title="Zoeken" className="navigation__action ___search" />
                    </li>
                    <li>
                        <NavLink to={{pathname: "/login", state: { next: location.pathname }}} title="Inloggen" className="navigation__action ___login">
                            Inloggen
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/register" title="Registeren" className="navigation__action ___register">
                            Registreren
                        </NavLink>
                    </li>
                </ul>
            )
        }
    }
}

export default withRouter(UserMenu)