import React from "react"
import Card from "./components/Card"
import Document from "../core/components/Document"
import ResultList from "./containers/ResultList"
import Header from "./containers/Header"
import { getQueryVariable } from "../lib/helpers"

export default class Results extends React.Component {
    render() {
        return (
            <div>
                <Document title="Zoeken" />
                <Header q={getQueryVariable("q")} type={getQueryVariable("type")} subtype={getQueryVariable("subtype")} history={this.props.history} />
                <section className="section ___grey ___grow">
                    <ResultList childClass={Card} q={getQueryVariable("q")} type={getQueryVariable("type")} subtype={getQueryVariable("subtype")} offset={getQueryVariable("offset") || 0} limit={getQueryVariable("limit") || 10} />
                </section>
            </div>
        )
    }
}