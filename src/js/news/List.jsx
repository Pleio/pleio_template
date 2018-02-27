import React from "react"
import { Link } from "react-router-dom"
import { graphql, gql } from "react-apollo"
import ContentHeader from "../core/components/ContentHeader"
import NewsList from "./containers/NewsList"
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
                <Link to={`news/add`} className="button ___large ___add ___stick">
                    <span>Nieuws toevoegen</span>
                </Link>
            )
        }

        return (
            <div>
                <Document title="Nieuws" />
                <ContentHeader>
                    <div className="row">
                        <div className="col-sm-6">
                            <h3 className="main__title">Nieuws</h3>
                        </div>
                        <div className="col-sm-6 end-sm">
                            {add}
                        </div>
                    </div>
                    <ContentFilters page="news" onChange={this.onChangeFilter} value={this.state.tags} />
                </ContentHeader>
                <section className="section ___grey ___grow">
                    <NewsList childClass={Card} subtype="news" offset={0} limit={20} tags={this.state.tags} hasRows />
                </section>
            </div>
        )
    }
}

const Query = gql`
    query NewsList {
        viewer {
            guid
            loggedIn
            canWriteToContainer(type: object, subtype: "news")
        }
    }
`

export default graphql(Query)(List)