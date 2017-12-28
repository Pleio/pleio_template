import React from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import autobind from "autobind-decorator"
import { Link } from "react-router-dom"
import ContentHeader from "../core/components/ContentHeader"
import EventsList from "./containers/EventsList"
import Card from "./components/Card"
import ContentFilters from "../core/containers/ContentFilters"
import Document from "../core/components/Document"
import Select from "../core/components/NewSelect"
import Add from "../core/Add"

class List extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            filter: "upcoming"
        }
    }

    @autobind
    onChange(value) {
        this.setState ({ filter: value })
    }

    render() {
        const { viewer } = this.props.data

        let add
        if (viewer && viewer.canWriteToContainer) {
            add = (
                <Link to={`events/add`} className="button ___large ___add ___stick">
                    <span>Nieuw agenda-item</span>
                </Link>
            )
        }

        return (
            <div className="page-container">
                <Document title="Agenda" />
                <ContentHeader>
                    <div className="row">
                        <div className="col-sm-6">
                            <h3 className="main__title">Agenda</h3>
                        </div>
                        <div className="col-sm-6 end-sm">
                            {add}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-4 col-lg-3">
                            <Select name="filter" options={{upcoming: "Aankomend", previous: "Afgelopen"}} onChange={this.onChange} value={this.state.filter} />
                        </div>
                    </div>
                </ContentHeader>
                <section className="section ___grey ___grow">
                    <EventsList childClass={Card} filter={this.state.filter} offset={0} limit={20} />
                </section>
            </div>
        )
    }
}

const Query = gql`
    query EventsList {
        viewer {
            guid
            loggedIn
            canWriteToContainer(type: group)
        }
    }
`

export default graphql(Query)(List)