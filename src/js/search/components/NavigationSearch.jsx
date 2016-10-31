import React from "react"
import { connect } from "react-redux"
import { search } from "../../lib/actions"

let autocompleteTimer

class NavigationSearch extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            q: ""
        }

        this.onChange = this.onChange.bind(this)
    }


    onChange(e) {
        this.setState({
            q: e.target.value
        })

        if (autocompleteTimer) {
            clearTimeout(autocompleteTimer)
        }

        autocompleteTimer = setTimeout(() => {
            this.onAutocomplete()
        }, 250)
    }

    onAutocomplete() {
        this.props.dispatch(search(this.state.q))
    }

    onSubmit() {

    }

    onClose() {
        document.body.classList.toggle("navigation-search-open")
    }

    render() {
        return (
            <form onSubmit={this.onSubmit} className="navigation-search">
                <div className="container">
                    <label htmlFor="search">Zoeken</label><span className="navigation-search__icon"></span>
                    <input id="search" name="q" type="text" maxLength="60" autoComplete="off" className="navigation-search__input" onChange={this.onChange} value={this.state.q} />
                    <a className="navigation-search__close" onClick={this.onClose}>
                        Sluiten
                    </a>
                </div>
            </form>
        )
    }
}

export default connect()(NavigationSearch)