import React from "react"
import Select from "../components/NewSelect"
import autobind from "autobind-decorator"
import { List } from "immutable"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

class ContentFilters extends React.Component {
    constructor(props) {
        super(props)

        const localStorage = this.getLocalStorage()

        this.state = {
            filters: localStorage ? localStorage : {}
        }

        this.initialized = false
    }

    componentDidUpdate() {
        const { site } = this.props.data

        if (!site) {
            return
        }

        if (this.initialized) {
            return
        }

        this.initialized = true

        const localStorage = this.getLocalStorage()

        if (localStorage) {
            let isValid = true

            Object.keys(localStorage).forEach((i) => {
                if (!site.filters[i]) {
                    isValid = false
                }

                if (site.filters[i].values.indexOf(localStorage[i]) === -1) {
                    isValid = false
                }
            })

            if (isValid) {
                this.props.onChange(localStorage)
            }
        }
    }

    @autobind
    onChangeFilter(i, value) {
        const { site } = this.props.data
        const filters = Object.assign({}, this.state.filters, {
            [i]: value
        })

        this.setState({
            filters
        })

        const selectedTags = Object.keys(filters).map((i) => filters[i]).filter((i) => i !== "all")
        this.props.onChange(selectedTags)
    }

    componentWillUpdate(nextProps, nextState) {
        this.setLocalStorage(nextState)
    }

    @autobind
    getLocalStorage() {
        if (!localStorage) {
            return
        }

        try {
            return localStorage.getItem("contentFilters") ? JSON.parse(localStorage.getItem("contentFilters")) : null
        } catch(e) {
            return null
        }
    }

    @autobind
    setLocalStorage(nextState) {
        if (!localStorage) {
            return
        }

        localStorage.setItem("contentFilters", JSON.stringify(nextState.filters))
    }

    render() {
        const { site } = this.props.data

        if (!site) {
            return (
                <div className="row" />
            )
        }

        const filters = site.filters.map((filter, i) => {
            let options = {}

            filter.values.forEach((value) => {
                options[value] = value
            })

            if (i === (site.filters.length - 1)) {
                options["mine"] = `Mijn ${filter.name}`
            }

            options["all"] = `Alle ${filter.name}`

            return (
                <div key={i} className="col-sm-4 col-lg-3">
                    <Select name={filter.name} className={this.props.selectClassName} options={options} onChange={(value) => this.onChangeFilter(i, value)} value={this.state.filters[i] || "all"} />
                </div>
            )
        })

        return (
            <div className="row">
                {filters}
                {this.props.children}
            </div>
        )
    }
}

const Query = gql`
    query Filters {
        site {
            guid
            filters {
                name
                values
            }
        }
    }
`

export default graphql(Query)(ContentFilters)