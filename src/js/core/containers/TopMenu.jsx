import React from "react"
import { NavLink, withRouter } from "react-router-dom"
import UserMenu from "./UserMenu"
import UserMobileMenu from "./UserMobileMenu"
import classnames from "classnames"
import EditPencil from "../../admin/components/EditPencil"
import Modal from "../../core/components/NewModal"
import Form from "../../core/components/Form"
import Errors from "../../core/components/Errors"
import InputField from "../../core/components/InputField"
import SelectField from "../../core/components/SelectField"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import autobind from "autobind-decorator"
class TopMenu extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            submenuIsOpen: false,
            q: "",
            menu: [
                {
                    label: "Yolo",
                    link: "/yolo"
                },
                {
                    label: "Nieuw",
                    link: "/nieuw"
                }
            ]
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

    @autobind
    onDragEnd(result) {
        if (!result.destination) {
            return
        }

        // const sourceRemoved = this.state.menu.splice(result.source.index, 1)
        // const newMenu = sourceRemoved.splice(result.destination.index, 0, this.state.menu.get(result.source.index))

        // this.setState({ menu: newMenu })
    }

    @autobind    
    addSubpage() {
        this.setState({
            menu: [...this.state.menu,
                {
                    label: "",
                    link: ""
                }
            ],
        })
    }

    @autobind    
    deleteSubpage(index) {
        this.setState((prevState) => ({
            menu: prevState.menu.filter((_, i) => i !== index)
        }))
    }

    render() {
        const { site, viewer } = this.props.data
        let menuItems, footerItems, home, mobileHome, userMenu, pleio, search

        const { editModeEnabled } = this.props

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
                {editModeEnabled &&
                    <div className="cms-overlay">
                        <div className="cms-overlay__actions">
                        <div className="cms-overlay__buttons">
                            <button className="___edit" onClick={(e) => this.refs.editPageModal.toggle()} />
                        </div>
                        </div>
                    </div>
                }
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
                <UserMenu onClick={this.closeMobileMenu} viewer={viewer} />
            )
        } else {
            search = (
                <form className="navigation__search" onSubmit={this.onSearch}>
                    <input onChange={this.changeSearchField} value={this.state.q} placeholder="Zoeken" name="q" />
                    <button type="submit" />
                </form>
            )
        }

        const subpages = this.state.menu.map((subpage, i) => {
            return (
                <Draggable key={i} draggableId={i.toString()} index={i}>
                {(provided, snapshot) => (
                    <div>
                        <div className="form__item" ref={provided.innerRef} {...provided.draggableProps}>
                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="flexer ___gutter-small">
                                        <button type="button" className="button__icon ___move ___is-grabbable" {...provided.dragHandleProps} />
                                        <InputField value={subpage.label} name={subpage.label.toLowerCase()} type="text" placeholder="Voeg een titel toe" className="form__input" rules="required" autofocus />
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="flexer ___gutter-small">
                                        <InputField value={subpage.link} name={subpage.link.toLowerCase()} type="text" placeholder="Voeg een URL toe" className="form__input" rules="required" />
                                        <button type="button" className="button__icon ___delete" onClick={() => this.deleteSubpage(i)} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {provided.placeholder}                        
                    </div>
                    )}
                </Draggable>
            )
        })

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
                            {editModeEnabled &&
                                <button className="navigation__add-page" onClick={(e) => this.refs.addPageModal.toggle()}/>
                            }
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
                        {search}
                        {userMenu}
                    </div>
                    <div className="mobile-navigation__bar">
                        <div className="mobile-navigation__trigger" onClick={this.toggleMobileMenu} />
                        {mobileHome}
                        <UserMobileMenu onClick={this.closeMobileMenu} viewer={this.props.data.viewer} />
                    </div>
                </div>
                    <Modal
                        ref="addPageModal"
                        title="Hoofdpagina toevoegen"
                    >
                        <form className="form" ref="form" onSubmit={this.onSubmit}>
                            <div className="form__item">
                                <div className="row">
                                    <div className="col-sm-6">
                                        <InputField name="title" type="text" placeholder="Voeg een titel toe" className="form__input" rules="required" autofocus />
                                    </div>
                                    <div className="col-sm-6">
                                        <InputField name="url" type="text" placeholder="Voeg een URL toe" className="form__input" rules="required" disabled />
                                    </div>
                                </div>
                            </div>
                            <div className="title">Subpagina's</div>
                            <DragDropContext onDragEnd={this.onDragEnd}>
                                <Droppable droppableId="droppable-1">
                                    {(provided, snapshot) => (
                                        <div ref={provided.innerRef}>
                                            {subpages}
                                            {provided.placeholder}                                            
                                        </div>
                                    )}
                                </Droppable>
                            </DragDropContext>
                            
                            <button type="button" className="button ___add ___line" onClick={() => this.addSubpage()}>Subpagina</button>
                            <div className="flexer ___end">
                                <button className="button" onClick={this.onSubmit}>
                                    Toevoegen
                                </button>
                            </div>
                        </form>
                    </Modal>
                
                {editModeEnabled &&                
                    <Modal
                        ref="editPageModal"
                        title="Hoofdpagina bewerken"
                    >
                        <Form className="form" ref="form" onSubmit={this.onSubmit}>
                            <div className="form__item">
                                <div className="row">
                                    <div className="col-sm-6">
                                        <InputField value="Hoofdpagina" name="title" type="text" placeholder="Voeg een titel toe" className="form__input" rules="required" autofocus />
                                    </div>
                                    <div className="col-sm-6">
                                        <InputField value="/link" name="url" type="text" placeholder="Voeg een URL toe" className="form__input" rules="required" disabled />
                                    </div>
                                </div>
                            </div>
                            <div className="title">Subpagina's</div>
                            {/* {subpages} */}
                            <button type="button" className="button ___add ___line">Subpagina</button>
                            <div className="flexer ___end">
                                <button className="button" onClick={this.onSubmit}>
                                    Toevoegen
                                </button>
                            </div>
                        </Form>
                    </Modal>
                }
            </nav>        
        )
    }
}

export default withRouter(TopMenu)