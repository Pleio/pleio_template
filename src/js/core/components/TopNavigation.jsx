import React from "react"
import { Link, withRouter } from "react-router-dom"

class TopNavigation extends React.Component {
    render() {
        const { location } = this.props
        const { viewer } = this.props.data

        let userMenu
        if (viewer.loggedIn) {
            userMenu = (
                <Link to={`/profile/${viewer.user.username}`} title={viewer.user.name} className="top-navigation__link ___right">
                    <img src={viewer.user.icon} alt={viewer.user.name} title={viewer.user.name} />
                    {viewer.user.name}
                </Link>
            )
        } else {
            userMenu = (
                <Link to={{pathname: "/login", state: { next: location.pathname }}} title="Inloggen" className="top-navigation__link ___right">
                    Inloggen
                </Link>
            )
        }

        return (
            <div className="top-navigation">
                <div className="container">
                    <div className="dropdown ___left">
                        <a href="https://www.pleio.nl" title="Pleio" className="top-navigation__link ___pleio">
                            Pleio
                        </a>
                    </div>
                    {userMenu}
                </div>
            </div>
        )
    }
}

export default withRouter(TopNavigation)