import React from "react"
import { graphql } from "react-apollo"
import { NavLink, withRouter } from "react-router-dom"
import NotificationsTop from "../../notifications/components/NotificationsTop"
import Tooltip from "../../core/components/Tooltip"
import autobind from "autobind-decorator"

class UserMenu extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            q: "",
            isVisible: false
        }

        this.onChange = (e) => this.setState({ q: e.target.value })
    }

    @autobind
    toggleVisibility(e) {
        this.setState({ isVisible: !this.state.isVisible })
    }

    @autobind
    onBlur(e) {
        this.setState({ isVisible: false })
    }

    @autobind
    onSearch(e) {
        e.preventDefault()

        const { history } = this.props
        history.push(`/search/results?q=${this.state.q}`)
    }

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
                [
                    { title: "Naar Pleio.nl", link: `https://www.pleio.nl`, external:true },
                    { title: "Uitloggen", link: "/logout" }
                ]
            ]

            return (
                <div className="navigation__actions">
                    <form className="navigation__search" onSubmit={this.onSearch}>
                        <div className="search-bar">
                            <input name="q" onChange={this.onChange} value={this.state.q} placeholder="Zoeken" />
                            <div className="search-bar__button" />
                        </div>
                    </form>
                    <NotificationsTop />
                    <div tabIndex="0" className="navigation__action ___account" onClick={this.toggleVisibility} onBlur={this.onBlur}>
                        <div style={{backgroundImage: "url('" + viewer.user.icon + "')"}} className="navigation__picture"></div>
                        <span>{viewer.user.name}</span>
                        <Tooltip lists={userMenu} isVisible={this.state.isVisible} />
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