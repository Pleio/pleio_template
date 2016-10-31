import React from "react"
import ResultList from "./containers/ResultList"

export default class Results extends React.Component {
    render() {
        const { query } = this.props.location

        return (
            <ResultList q={query.q} type={query.type} subtype={query.subtype} offset={query.offset || 0} limit={query.limit || 20} />
        )
    }
}