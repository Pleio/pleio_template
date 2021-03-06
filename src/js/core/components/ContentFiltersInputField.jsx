import React from "react"
import Switches from "./Switches"
import { Set } from "immutable"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import PropTypes from "prop-types"

class ContentFiltersInputField extends React.Component {
    constructor(props) {
        super(props)

        this.onChange = this.onChange.bind(this)

        this.state = {
            value: Set(this.props.value)
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!(new Set(nextProps.value).equals(new Set(this.props.value)))) {
            this.setState({
                value: Set(nextProps.value)
            })
        }
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

    onChange(name, adding) {
        let newState

        if (adding) {
            newState = this.state.value.add(name)
        } else {
            newState = this.state.value.delete(name)
        }

        this.setState({
            value: newState
        })

        if (this.props.onChange) {
            this.props.onChange(name, newState)
        }
    }

    isValid() {
        return true
    }

    getValidTags() {
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
        // only return valid tags
        const value = this.state.value.intersect(this.getValidTags())
        return value.toJS()
    }

    clearValue() {
        this.setState({
            value: Set()
        })
    }

    render() {
        const { site } = this.props.data
        if (!site || !site.filters || site.filters.length === 0) {
            return (
                <div />
            )
        }

        const filters = site.filters.map((filter, i) => (
            <div key={i} className="col-sm-8 col-lg-6">
                <div key={i} className="form__item">
                    <div className="form__label">{filter.name}</div>
                    <Switches options={filter.values} onChange={this.onChange} value={this.props.value} />
                </div>
            </div>
        ))

        let label
        if (this.props.label) {
            label = (
                <p>{this.props.label}</p>
            )
        }

        return (
            <div>
                {label}
                <div className="row">
                    {filters}
                </div>
            </div>
        )
    }
}

const Query = gql`
    query contentFiltersInputField {
        site {
            guid
            filters {
                name
                values
            }
        }
    }
`

ContentFiltersInputField.contextTypes = {
    attachToForm: PropTypes.func,
    detachFromForm: PropTypes.func
}

export default graphql(Query)(ContentFiltersInputField)