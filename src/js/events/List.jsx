import React from "react"
import { Link } from "react-router-dom"
import ContentHeader from "../core/components/ContentHeader"
import EventsList from "./containers/EventsList"
import Card from "./components/Card"
import ContentFilters from "../core/containers/ContentFilters"
import AddButton from "../core/containers/AddButton"
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
        return (
            <div className="page-container">
                <Document title="Evenementen" />
                <ContentHeader>
                    <h3 className="main__title">
                        Agenda
                    </h3>
                    <ContentFilters page="events" onChange={this.onChangeFilter} value={this.state.tags} selectClassName="selector ___margin-bottom-mobile ___filter">
                        <Link to="/events/add" className="right-lg">
                            <AddButton subtype="event" />
                        </Link>
                    </ContentFilters>
                </ContentHeader>
                <section className="section ___grey ___grow">
                    <EventsList childClass={Card} subtype="event" offset={0} limit={20} tags={this.state.tags} />
                </section>
            </div>
        )
    }
}

export default List