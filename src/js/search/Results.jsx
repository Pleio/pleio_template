import React from "react"
import ResultList from "./containers/ResultList"
import Card from "./components/Card"

export default class Results extends React.Component {
    render() {
        const { query } = this.props.location

        return (
            <ResultList childClass={Card} q={query.q} type={query.type} subtype={query.subtype} offset={query.offset || 0} limit={query.limit || 40} />
        )
    }
}