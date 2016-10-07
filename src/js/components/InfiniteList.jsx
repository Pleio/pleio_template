import React from "react"
import Card from "./Card"
import ContentHeader from '../components/ContentHeader'

class InfiniteList extends React.Component {
    constructor(props) {
        super(props)

        this.onScroll = this.onScroll.bind(this)
        this.fetchMore = this.fetchMore.bind(this)
        this.refetch = this.refetch.bind(this)

        this.state = {
            offset: 0
        }
    }

    componentDidMount() {
        window.addEventListener("scroll", this.onScroll)
        window.addEventListener("touchmove", this.onScroll)
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.onScroll)
        window.removeEventListener("touchmove", this.onScroll)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.tags !== this.props.tags) {
            this.setState({
                offset: nextProps.offset
            })
        }
    }

    onScroll(e) {
        let currentOffset = document.body.scrollTop + window.innerHeight;
        let containerOffset = this.refs["infiniteScroll"].offsetHeight + this.refs["infiniteScroll"].offsetTop;

        if (this.props.data.loading) {
            return;
        }

        if (currentOffset < containerOffset) {
            return;
        }

        if (!this.props.data.entities) {
            return;
        }

        if (this.props.data.entities.entities.length >= this.props.data.entities.entities.total) {
            return;
        }

        this.fetchMore()
    }

    fetchMore() {
        let offset = this.state.offset + this.props.limit

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

    refetch() {
        this.setState({offset: 0})
        //this.props.data.refetch()
    }

    render() {
        let children = [];
        if (this.props.data.entities) {
            children = this.props.data.entities.entities.map((child) => (
                <Card key={child.guid} subtype={this.props.subtype} {...child} />
            ))
        }

        let noItems = ""
        if (this.props.data.entities && this.props.data.entities.entities.length === 0) {
            noItems = "Er zijn geen items in deze categorie."
        }

        return (
            <section className="section ___grey ___grow">
                <div className="container" ref="infiniteScroll">
                    <div className="row">
                        {noItems}
                        {children}
                    </div>
                </div>
            </section>
        )
    }
}

export default InfiniteList;