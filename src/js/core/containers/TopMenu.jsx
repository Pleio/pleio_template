import React from "react"
import { NavLink, withRouter } from "react-router-dom"
import UserMenu from "./UserMenu"
import UserMobileMenu from "./UserMobileMenu"
import classnames from "classnames"
import EditPencil from "../../admin/components/EditPencil"

class TopMenu extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            submenuIsOpen: false,
            q: ""
        }

        this.changeSearchField = (e) => this.setState({q: e.target.value})
        this.toggleSubmenu = (e) => this.setState({submenuIsOpen: !this.state.submenuIsOpen})
        this.onSearch = this.onSearch.bind(this)
    }

    toggleMobileMenu(e) {
        document.body.classList.toggle("mobile-nav-open")
        document.body.classList.toggle("mega-nav-open")
    }

    closeMobileMenu(e) {
        document.body.classList.remove("mobile-nav-open")
        document.body.classList.remove("mega-nav-open")
    }

    onSearch(e) {
        e.preventDefault()
        const { history } = this.props

        this.closeMobileMenu()
        history.push(`/search/results?q=${this.state.q}`)
    }

    render() {
        const { site, viewer } = this.props.data
        let menuItems, footerItems, home, mobileHome, userMenu, pleio

        if (!site) {
            return (
                <div></div>
            )
        }

        menuItems = site.menu.map((item, i) => (
            <li key={i}>
                <NavLink to={item.link} onClick={this.closeMobileMenu} title={item.title} className="navigation__link" activeClassName="___is-active">
                    {item.title}
                </NavLink>
            </li>
        ))

        footerItems = site.footer.map((item, i) => (
            <NavLink key={i} to={item.link} onClick={this.closeMobileMenu} title={item.title} activeClassName="___is-active">{item.title}</NavLink>
        ))

        if (site.showLogo) {
            home = (
                <li>
                    <NavLink exact to="/" onClick={this.closeMobileMenu} title="Home" className="navigation__link ___home" activeClassName="___is-active">Home</NavLink>
                </li>
            )
            mobileHome = (
                <NavLink exact to="/" onClick={this.closeMobileMenu} className="mobile-navigation__home" />
            )
        } else {
            home = (
                <li>
                    <NavLink exact to="/" onClick={this.closeMobileMenu} title="Home" className="navigation__link" activeClassName="___is-active">Home</NavLink>
                </li>
            )
        }

        if (site.theme === "leraar") {
            userMenu = (
                <UserMenu onClick={this.closeMobileMenu} viewer={this.props.data.viewer} />
            )
        }

        return (
            <nav className={"navigation " + (this.props.className || "") + " " + classnames({"nav-level-one": this.state.submenuIsOpen})}>
                <div className="container">
                    <div className="navigation__wrapper">
                        <div className="mobile-navigation__close" onClick={this.toggleMobileMenu}>
                            <span className="icon icon-cross"></span>
                        </div>
                        <div className="mobile-navigation__search">
                            <form onSubmit={this.onSearch}>
                                <label htmlFor="mobile-navigation-search">Zoeken</label>
                                <input id="mobile-navigation-search" placeholder="Zoeken" name="q" onChange={this.changeSearchField} value={this.state.q} />
                            </form>
                        </div>
                        <ul className="navigation__links">
                            {home}
                            {menuItems}
                            <li className="navigation__dropdown ___mobile">
                                <a href="#" title="Meer" className="navigation__link ___dropdown" onClick={this.toggleSubmenu}>Meer</a>
                                <div className={classnames({"submenu ___dropdown":true, "___open": this.state.submenuIsOpen})}>
                                    <div className="submenu__back" onClick={this.toggleSubmenu}>Terug</div>
                                    <ul className="submenu__list">
                                        <li className="submenu__list-item">
                                            {footerItems}
                                        </li>
                                    </ul>
                                </div>
                            </li>
                        </ul>
                        {userMenu}
                    </div>
                    <div className="mobile-navigation__bar">
                        <div className="mobile-navigation__trigger" onClick={this.toggleMobileMenu} />
                        {mobileHome}
                        <UserMobileMenu onClick={this.closeMobileMenu} viewer={this.props.data.viewer} />
                    </div>
                </div>
                <EditPencil viewer={viewer} />
            </nav>
        )
    }
}

export default withRouter(TopMenu)