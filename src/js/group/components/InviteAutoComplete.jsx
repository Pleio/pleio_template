import React from "react"
import InviteAutoCompleteList from "./InviteAutoCompleteList"
import autobind from "autobind-decorator"

export default class InviteAutoComplete extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            q: "",
            search: ""
        }
    }

    @autobind
    onChange(e) {
        const q = e.target.value

        this.setState({ q })

        if (this.changeTimeout) {
            clearTimeout(this.changeTimeout)
        }

        this.changeTimeout = setTimeout(() => {
            this.setState({ search: q })
        }, 100)
    }

    @autobind
    onSelect(user) {
        this.setState({ q: "", search: "" })
        this.props.onSelect(user)
    }

    render() {
        const { group } = this.props

        let results
        if (this.state.q) {
            results = (
                <div className="search-bar__results">
                    <InviteAutoCompleteList group={group} q={this.state.search} onSelect={this.onSelect} />
                </div>
            )
        }

        return (
            <div className="invite-autocomplete">
                <div className="search-bar ___margin-bottom">
                    <input type="text" name="q" onChange={this.onChange} placeholder="Zoek op naam of e-mail..." autoComplete="off" value={this.state.q} />
                    <div className="search-bar__button" />
                </div>
                {results}
            </div>
        )
    }
}