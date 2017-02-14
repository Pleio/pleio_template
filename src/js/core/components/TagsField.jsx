import React from "react"
import classnames from "classnames"
import Validator from "validatorjs"
import { Set } from "immutable"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import { sectorOptions, categoryOptions } from "../../lib/filters"

const suggestions = Set()

class TagsField extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            value: Set(this.props.value),
            inputValue: ""
        }

        this.onChangeInput = (e) => this.setState({inputValue: e.target.value})
        this.onKeyPress = this.onKeyPress.bind(this)
        this.addTag = this.addTag.bind(this)
        this.removeTag = this.removeTag.bind(this)
    }

    componentWillMount() {
        if (this.context.attachToForm) {
            this.context.attachToForm(this)
        }
    }

    componentWillUnmount() {
        if (this.context.detachFromForm) {
            this.context.detachFromForm(this)
        }
    }

    onKeyPress(e) {
        const keyCode = e.keyCode ? e.keyCode : e.which
        if (keyCode !== 13) { // Enter button
            return
        }

        e.preventDefault()
        this.addTag(this.state.inputValue)
    }

    addTag(name) {
        let tagName
        if (name) {
            tagName = name
        } else {
            tagName = this.refs.input.value
        }

        if (!tagName) {
            return
        }

        this.setState({
            value: this.state.value.add(tagName),
            showSuggestions: false,
            inputValue: ""
        })

        if (this.props.onChange) {
            this.props.onChange()
        }

        this.refs.input.focus()
    }

    removeTag(tag) {
        this.setState({
            value: this.state.value.delete(tag)
        })
    }

    isValid() {
        return true
    }

    getIgnoredTags() {
        const { site } = this.props.data
        let returnValue = Set()

        if (site) {
            site.filters.forEach((filter) => {
                returnValue = returnValue.merge(filter.values)
            })
        }

        return returnValue
    }

    getValue() {
        const value = this.state.value.subtract(this.getIgnoredTags())
        return value.toJS()
    }

    clearValue() {
        this.setState({
            value: new Set(),
            inputValue: ""
        })
    }

    render() {
        const regex = new RegExp(this.state.inputValue, 'i')
        const hits = this.state.inputValue ? suggestions.filter((item) => (item.search(regex) > -1)) : new Set()

        const showSuggestions = hits.map((hit, i) => (
            <li key={i} onClick={() => this.addTag(hit)}>{hit}</li>
        ))

        const value = this.state.value.subtract(this.getIgnoredTags())

        const showTags = value.map((tag, i) => (
            <div key={i} className="tag">
                {tag}
                <div className="tag__remove" onClick={() => this.removeTag(tag)} />
            </div>
        ))

        let label
        if (this.props.label) {
            label = (
                <label className="form__label">{this.props.label}</label>
            )
        }

        return (
            <div>
                {label}
                <div className={classnames({"autosuggest": true, "___is-visible": (hits.size > 0)})}>
                    <input
                        ref="input"
                        name={this.props.name}
                        type={this.props.type}
                        className={this.props.className}
                        placeholder="Voeg tags toe door op enter te drukken"
                        autoComplete="off"
                        onKeyPress={this.onKeyPress}
                        onChange={this.onChangeInput}
                        value={this.state.inputValue}
                    />
                    <ul className="autosuggest__list">
                        {showSuggestions}
                    </ul>
                </div>
                <div className="tags">{showTags}</div>
            </div>
        )
    }
}

TagsField.contextTypes = {
    attachToForm: React.PropTypes.func,
    detachFromForm: React.PropTypes.func
}

const Query = gql`
    query tagsField {
        site {
            guid
            filters {
                name
                values
            }
        }
    }
`

export default graphql(Query)(TagsField)