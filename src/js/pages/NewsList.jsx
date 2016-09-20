import React from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import { connect } from "react-redux"
import { showModal } from "../lib/actions"

import ContentHeader from "../elements/ContentHeader"
import InfiniteList from "../elements/InfiniteList"
import AddModal from "../pages/AddModal"

class NewsList extends React.Component {
    constructor(props) {
        super(props)

        this.onFilter = this.onFilter.bind(this)
        this.onClickAdd = this.onClickAdd.bind(this)

        this.state = {
            tags: []
        }
    }

    onFilter(tags) {
        this.setState({
            tags
        })
    }

    onClickAdd(e) {
        this.props.dispatch(showModal('add'))
    }

    render() {
        return (
            <div>
                <ContentHeaderWithData subtype="news" title="Nieuws" onFilter={this.onFilter} onClickAdd={this.onClickAdd} />
                <InfiniteListWithData subtype="news" offset={0} limit={20} tags={this.state.tags} />
                <AddModal title="Nieuws toevoegen" />
            </div>
        )
    }
}

const HEADER_QUERY = gql`
    query NewsHeader {
        entities {
            canWrite
        }
    }
`
const LIST_QUERY = gql`
    query NewsList($offset: Int!, $limit: Int!, $tags: [String!]) {
        entities(offset: $offset, limit: $limit, tags: $tags) {
            total
            entities {
                guid
                title
                tags
            }
        }
    }
`

const ContentHeaderWithData = graphql(HEADER_QUERY)(ContentHeader)
const InfiniteListWithData = graphql(LIST_QUERY)(InfiniteList)

export default connect()(NewsList)