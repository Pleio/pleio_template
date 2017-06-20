import React from "react"
import { withRouter } from "react-router-dom"
import autobind from "autobind-decorator"

class NavigationSearch extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            q: ""
        }
    }

    componentDidMount() {
        setTimeout(() => {
            this.refs.q.focus()
        }, 100)
    }

    @autobind
    onChange(e) {
        const q = e.target.value

        this.setState({ q })

        if (this.autocompleteTimer) {
            clearTimeout(this.autocompleteTimer)
        }

        this.autocompleteTimer = setTimeout(() => {
            this.props.onChange(q)
        }, 250)
    }

    @autobind
    onSubmit(e) {
        e.preventDefault()

        const { history } = this.props
        history.push(`/search/results?q=${this.state.q}`)
    }

    @autobind
    onClose() {
        const { history } = this.props
        history.goBack()
    }

    render() {
        return (
            <form onSubmit={this.onSubmit} className="navigation-search">
                <div className="container">
                        <label htmlFor="search">Zoeken</label><span className="navigation-search__icon"></span>
                        <input ref="q" name="q" type="text" maxLength="60" autoComplete="off" className="navigation-search__input" onChange={this.onChange} value={this.state.q} />
                        <a className="navigation-search__close" onClick={this.onClose}>
                            Sluiten
                        </a>
                </div>
            </form>
        )
    }
}

export default withRouter(NavigationSearch)