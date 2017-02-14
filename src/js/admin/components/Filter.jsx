import React from "react"
import { List } from "immutable"

export default class Filter extends React.Component {
    constructor(props) {
        super(props)

        this.addValue = this.addValue.bind(this)
        this.removeValue = this.removeValue.bind(this)

        this.state = {
            values: List(this.props.values)
        }
    }

    addValue(e) {
        e.preventDefault()
        this.setState({
            values: this.state.values.push("Nieuwe waarde")
        })
    }

    changeValue(i, e) {
        e.preventDefault()
        this.setState({
            values: this.state.values.set(i, e.target.value)
        })
    }

    removeValue(i) {
        this.setState({
            values: this.state.values.remove(i)
        })
    }

    render() {
        const values = this.state.values.map((value, i) => (
            <li key={i}>
                <input type="text" name={"filterValues[" + this.props.id + "][]"} value={value} onChange={(e) => this.changeValue(i, e)} />
                <span className="elgg-icon elgg-icon-delete" title="Verwijder" onClick={() => this.removeValue(i)}></span>
            </li>
        ))

        return (
            <div className="elgg-module elgg-module-inline">
                <div className="elgg-head">
                    <input type="text" name={"filterName[" + this.props.id + "]"} onChange={this.props.onChangeFilter} value={this.props.name} />
                    <div className="elgg-menu-title">
                        <button className="elgg-button elgg-button-submit" onClick={this.addValue}>Waarde toevoegen</button>
                        <button className="elgg-button elgg-button-submit" onClick={this.props.onRemove}>Filter verwijderen</button>
                    </div>
                </div>
                <div className="elgg-body">
                    <ul>{values}</ul>
                </div>
            </div>
        )
    }
}