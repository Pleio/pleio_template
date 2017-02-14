import React from "react"
import Card from "./components/Card"
import Document from "../core/components/Document"
import ResultList from "./containers/ResultList"
import Header from "./containers/Header"

export default class Results extends React.Component {
    render() {
        const { query } = this.props.location

        return (
            <div className="page-container">
                <Document title="Zoeken" />
                <Header q={query.q} type={query.type} subtype={query.subtype} />
                <section className="section ___grey ___grow">
                    <ResultList childClass={Card} q={query.q} type={query.type} subtype={query.subtype} offset={query.offset || 0} limit={query.limit || 20} />
                </section>
            </div>
        )
    }
}