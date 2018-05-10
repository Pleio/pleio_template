import React from "react"
import { Link } from "react-router-dom"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import ContentHeader from "../core/components/ContentHeader"
import ContentFilters from "../core/containers/ContentFilters"
import DiscussionList from "./containers/DiscussionList"
import Document from "../core/components/Document"
import Card from "./components/Card"

class DiscussionCard extends React.Component {
    render() {
        return (
            <div className="col-lg-6">
                <Card {...this.props} />
            </div>
        )
    }
}

class List extends React.Component {
    constructor(props) {
        super(props)

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
                <Link to={`discussion/add`} className="button ___large ___add ___stick">
                    <span>Start een discussie</span>
                </Link>
            )
        }

        return (
            <div>
                <Document title="Discussies" />
                <ContentHeader>
                    <div className="row">
                        <div className="col-sm-6">
                            <h3 className="main__title">Discussies</h3>
                        </div>
                        <div className="col-sm-6 end-sm">
                            {add}
                        </div>
                    </div>
                    <ContentFilters page="discussions" onClickAdd={this.onClickAdd} onChange={this.onChangeFilter} value={this.state.tags} />
                </ContentHeader>
                <section className="section ___grey ___grow">
                    <DiscussionList childClass={DiscussionCard} subtype="discussion" offset={0} limit={20} tags={this.state.tags} hasRows />
                </section>
            </div>
        )
    }
}

const Query = gql`
    query DiscussionList {
        viewer {
            guid
            loggedIn
            canWriteToContainer(type: object, subtype: "discussion")
        }
    }
`

export default graphql(Query)(List)