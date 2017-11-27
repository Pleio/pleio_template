import React from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import { Link } from "react-router-dom"
import ContentHeader from "../core/components/ContentHeader"
import EventsList from "./containers/EventsList"
import Card from "./components/Card"
import ContentFilters from "../core/containers/ContentFilters"
import Document from "../core/components/Document"
import Add from "../core/Add"

class List extends React.Component {
    constructor(props) {
        super(props)

        this.onChangeCanWrite = (canWrite) => this.setState({canWrite})
        this.onChangeFilter = (tags) => this.setState({ tags })

        this.state = {
            tags: []
        }
    }

    render() {
        const { viewer } = this.props.data

        let add
        if (viewer && viewer.canWriteToContainer) {
            add = (
                <div className="col-right">
                    <Link to={`events/add`} className="button ___large ___add">
                        <span>Nieuw agenda-item</span>
                    </Link>
                </div>
            )
        }

        return (
            <div className="page-container">
                <Document title="Agenda" />
                <ContentHeader>
                    <h3 className="main__title">Agenda</h3>
                    <ContentFilters page="events" onChange={this.onChangeFilter} value={this.state.tags}>
                        {add}
                    </ContentFilters>
                </ContentHeader>
                <section className="section ___grey ___grow">
                    <EventsList childClass={Card} subtype="event" offset={0} limit={20} tags={this.state.tags} />
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