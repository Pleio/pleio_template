import React from "react"
import { Link } from "react-router"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import UserMenu from "./UserMenu"
import UserMobileMenu from "./UserMobileMenu"

class TopMenu extends React.Component {
    constructor(props) {
        super(props)

        this.onMobileMenuToggle = (e) => {
            document.body.classList.toggle('mobile-nav-open')
            document.body.classList.toggle('mega-nav-open')
        }
    }

    render() {
        let menuItems = "";
        if (this.props.data.site) {
            menuItems = this.props.data.site.menu.map((item) => {
                if (item.js) {
                    return (
                        <li key={item.guid}>
                            <Link to={item.link} title={item.title} className="navigation__link" activeClassName="___is-active">
                                {item.title}
                            </Link>
                        </li>
                    )
                } else {
                    return (
                        <li key={item.guid}>
                            <a href={item.link} title={item.title} className="navigation__link">
                                {item.title}
                            </a>
                        </li>
                    )
                }
            })
        }

        return (
            <nav className="navigation">
                <div className="container">
                    <div className="navigation__wrapper">
                        <div className="mobile-navigation__close" onClick={this.onMobileMenuToggle}>
                            <span className="icon icon-cross"></span>
                        </div>
                        <div className="mobile-navigation__search">
                            <form action="#">
                                <label htmlFor="mobile-navigation-search">Zoeken</label>
                                <input id="mobile-navigation-search" placeholder="Zoeken" name="searchQuery" />
                            </form>
                        </div>
                        <a href="#skip-navigation" title="Volg deze link om de navigatie over te slaan" className="skip-navigation__link">
                            Rechtstreeks naar content
                        </a>
                        <ul className="navigation__links">
                            <li>
                                <Link to="/" title="Home" className="navigation__link ___home" activeClassName="___is-active">Home</Link>
                            </li>
                            {menuItems}
                            <li className="navigation__dropdown ___mobile"><a href="#" title="Meer" className="navigation__link ___dropdown">Meer</a>
                                <div className="submenu ___dropdown">
                                    <div data-nav-back className="submenu__back">Terug</div>
                                    <ul className="submenu__list">
                                        <li className="submenu__list-subject submenu__list-item">
                                            <a href="#" title="Over">Over</a>
                                            <a href="#" title="Spelregels">Spelregels</a>
                                            <a href="#" title="Algemene voorwaarden">Algemene voorwaarden</a>
                                            <a href="#" title="Privacy">Privacy</a>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                        </ul>
                        <UserMenu viewer={this.props.data.viewer} />
                        <a href="https://www.pleio.nl" title="Pleio" className="navigation__link ___pleio">
                            Pleio
                        </a>
                    </div>
                    <div className="mobile-navigation__bar">
                        <div className="mobile-navigation__trigger" onClick={this.onMobileMenuToggle}>
                        </div>
                        <a href="/" className="mobile-navigation__home"></a>
                        <UserMobileMenu viewer={this.props.data.viewer} k/>
                    </div>
                </div>
            </nav>
        )
    }
}

const WithQuery = gql`
    query TopMenu {
        site {
            menu {
                guid
                title
                link
                js
            }
        }
        viewer {
            guid
            loggedIn
            user {
                guid
                username
                name
                icon
            }
        }
    }
`;

export default graphql(WithQuery)(TopMenu);