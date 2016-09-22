import React from "react"
import { graphql } from "react-apollo"
import { createFragment } from "apollo-client"
import gql from "graphql-tag"
import { connect } from "react-redux"
import { showModal } from "../lib/actions"

import ContentHeader from "../components/ContentHeader"
import InfiniteList from "../components/InfiniteList"
import AddModal from "../views/AddModal"

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
                <InfiniteListWithData ref="infiniteList" subtype="news" offset={0} limit={20} tags={this.state.tags} />
                <AddModal title="Nieuws toevoegen" />
            </div>
        )
    }
}

const headerQuery = gql`
    query NewsHeader {
        entities {
            canWrite
        }
    }
`

const listQuery = gql`
    query NewsList($offset: Int!, $limit: Int!, $tags: [String!]) {
        entities(offset: $offset, limit: $limit, tags: $tags, subtype: "news") {
            total
            entities {
                ...objectFragment
            }
        }
    }

    fragment objectFragment on Object {
        guid
        title
        tags
    }
`

const ContentHeaderWithData = graphql(headerQuery)(ContentHeader)
const InfiniteListWithData = graphql(listQuery, {withRef: true})(InfiniteList)

export default connect()(NewsList)