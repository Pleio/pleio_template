import React from "react"
import { graphql } from "react-apollo"
import { connect } from "react-redux"
import { showModal } from "../../lib/actions"
import { Link } from "react-router"

class UserMenu extends React.Component {
    constructor(props) {
        super(props)

        this.showModal = (id) => {
            this.props.dispatch(showModal(id))
        }
    }

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
                    <li><Link to="/bookmarks" title="Bookmarks" className="navigation__action ___bookmarks"><span>Bookmarks</span></Link></li>
                    <li><a href="#" title="Zoeken" data-search-trigger className="navigation__action ___search"></a></li>
                    <li>
                        <Link to={"/profile/" + this.props.viewer.username} title="Account" className="navigation__action ___account">
                            <div style={{backgroundImage: "url('" + this.props.viewer.icon + "')"}} className="navigation__picture"></div>
                            <span>{this.props.viewer.name}</span>
                        </Link>
                    </li>
                </ul>
            )
        } else {
            return (
                <ul className="navigation__actions">
                    <li><a href="#" title="Zoeken" data-search-trigger className="navigation__action ___search"></a></li>
                    <li>
                        <a href="#" onClick={() => this.showModal('login')} title="Inloggen" className="navigation__action ___login">
                            Inloggen
                        </a>
                    </li>
                    <li>
                        <a href="#" onClick={() => this.showModal('register')} title="Registeren" className="navigation__action ___register">
                            Registeren
                        </a>
                    </li>
                </ul>
            )
        }
    }
}

const stateToProps = (state) => {
    return {
        modal: state.modal
    }
}

export default connect(stateToProps)(UserMenu)