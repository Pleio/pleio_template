import React from "react"

export default class NavigationSearch extends React.Component {
    onClose() {
        document.body.classList.toggle("navigation-search-open")
    }

    render() {
        return (
            <form action="#" className="navigation-search">
                <div className="container">
                    <label htmlFor="search">Zoeken</label><span className="navigation-search__icon"></span>
                    <input id="search" name="s" type="text" maxLength="60" autoComplete="off" data-search-input="" className="navigation-search__input" />
                    <a className="navigation-search__close" onClick={this.onClose}>
                        Sluiten
                    </a>
                </div>
            </form>
        )
    }
}