import React from "react"
import Select from "../components/NewSelect"
import { List } from "immutable"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

class ContentFilters extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            filters: {}
        }

        this.onChangeFilter = this.onChangeFilter.bind(this)
    }

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

    render() {
        const { site, viewer } = this.props.data

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

            if (viewer.loggedIn) {
                options["mine"] = `Mijn ${filter.name}`
            }

            options["all"] = `Alle ${filter.name}`

            let selectClassName = this.props.selectClassName

            if (this.props.onActivity) {
                if (i === 0) {
                    selectClassName = "___margin-top ___margin-bottom ___margin-bottom-mobile ___filter"
                } else {
                    selectClassName = "___margin-top ___margin-bottom ___no-margin-top-mobile ___filter"
                }
            } else {
                if (i !== (site.filters.length - 1)) {
                    selectClassName = "___margin-bottom-mobile ___filter"
                } else {
                    selectClassName = "___filter"
                }
            }

            let value = this.state.filters[i] || "all"
            if (!this.state.filters[i] && this.props.onActivity && viewer.loggedIn) {
                value = "mine"
            }

            return (
                <div key={i} className="col-sm-4 col-lg-3">
                    <Select name={filter.name} className={selectClassName} options={options} onChange={(value) => this.onChangeFilter(i, value)} value={value} />
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
        viewer {
            guid
            loggedIn
        }
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