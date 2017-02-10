import React from "react"
import Filter from "./components/Filter"
import { List } from "immutable"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

class Filters extends React.Component {
    constructor(props) {
        super(props)

        this.addFilter = this.addFilter.bind(this)
        this.removeFilter = this.removeFilter.bind(this)

        this.state = {
            filters: List()
        }
    }

    componentWillReceiveProps(nextProps) {
        const { data } = nextProps

        if (!data.site || this.props.data === nextProps.data) {
            return
        }

        this.setState({
            filters: List(data.site.filters)
        })
    }

    addFilter(e) {
        e.preventDefault()

        this.setState({
            filters: this.state.filters.push({
                name: "Nieuwe naam",
                values: List()
            })
        })
    }

    changeFilter(i, e) {
        e.preventDefault()

        this.setState({
            filters: this.state.filters.set(i, Object.assign({}, this.state.filters[i], {
                name: e.target.value
            }))
        })
    }

    removeFilter(i, e) {
        e.preventDefault()

        this.setState({
            filters: this.state.filters.delete(i)
        })
    }

    render() {
        const filters = this.state.filters.map((filter, i) => {
            return (
                <Filter key={i} id={i} name={filter.name} values={filter.values} onChangeFilter={(e) => this.changeFilter(i, e)} onRemove={(e) => this.removeFilter(i, e)} />
            )
        })

        return (
            <div>
                <div>
                    <button className="elgg-button elgg-button-submit" onClick={this.addFilter}>
                        Filter toevoegen
                    </button>
                </div>
                {filters}
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

export default graphql(Query)(Filters)