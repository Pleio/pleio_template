import React from "react"
import { graphql } from "react-apollo"
import { Link } from "react-router-dom"

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
                        <Link to="/bookmarks" onClick={this.props.onClick} title="Bewaard" className="navigation__action ___bookmarks">
                            <span>Bewaard</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/search" title="Zoeken" className="navigation__action ___search" />
                    </li>
                    <li>
                        <Link to={"/profile/" + this.props.viewer.user.username} onClick={this.props.onClick} title="Account" className="navigation__action ___account">
                            <div style={{backgroundImage: "url('" + this.props.viewer.user.icon + "')"}} className="navigation__picture"></div>
                            <span>{this.props.viewer.user.name}</span>
                        </Link>
                    </li>
                </ul>
            )
        } else {
            return (
                <ul className="navigation__actions">
                    <li>
                        <a onClick={this.toggleSearch} title="Zoeken" className="navigation__action ___search"></a>
                    </li>
                    <li>
                        <Link to="/login" title="Inloggen" className="navigation__action ___login">
                            Inloggen
                        </Link>
                    </li>
                    <li>
                        <Link to="/register" title="Registeren" className="navigation__action ___register">
                            Registeren
                        </Link>
                    </li>
                </ul>
            )
        }
    }
}

export default UserMenu