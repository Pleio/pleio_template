import React from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import Card from "./Card"

class InfiniteList extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            loading: false,
            offset: this.props.offset || 0,
            limit: this.props.limit || 20
        }

        this.onScroll = this.onScroll.bind(this)
        this.fetchMore = this.fetchMore.bind(this)
    }

    componentDidMount() {
        window.addEventListener("scroll", this.onScroll)
        window.addEventListener("touchmove", this.onScroll)
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.onScroll)
        window.removeEventListener("touchmove", this.onScroll)
    }

    onScroll(e) {
        let currentOffset = document.body.scrollTop + window.innerHeight;
        let containerOffset = this.refs["infiniteScroll"].offsetHeight + this.refs["infiniteScroll"].offsetTop;

        if (currentOffset >= containerOffset && !this.props.data.loading && this.props.data.entities.entities.length < this.props.data.entities.total) {
            this.fetchMore()
        }
    }

    fetchMore() {
        let offset = this.state.offset + this.state.limit

        this.setState({
            offset
        })

        this.props.data.fetchMore({
            variables: {
                offset
            },
            updateQuery: (previousResult, { fetchMoreResult }) => {
                if (!fetchMoreResult.data) { return previousResult }

                previousResult.entities = Object.assign({}, previousResult.entities, {
                    entities: [...previousResult.entities.entities, ...fetchMoreResult.data.entities.entities]
                })

                return previousResult;
            }
        })
    }

    render() {
        let children = [];
        if (this.props.data.entities) {
            children = this.props.data.entities.entities.map((child) => (
                <Card key={child.guid} subtype={this.props.subtype} {...child} />
            ))
        }

        return (
            <div className="container" ref="infiniteScroll">
                <div className="row">
                    {children}
                </div>
            </div>
        )
    }
}

const WithQuery = gql`
    query WithQuery($offset: Int!, $limit: Int!) {
        entities(offset: $offset, limit: $limit) {
            total
            entities {
                guid
                title
            }
        }
    }
`;

export default graphql(WithQuery)(InfiniteList);