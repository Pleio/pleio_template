import React from "react"

class InfiniteList extends React.Component {
    constructor(props) {
        super(props)

        this.onScroll = this.onScroll.bind(this)
        this.fetchMore = this.fetchMore.bind(this)

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
                offset: 0
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

        if (!this.props.data.bookmarks) {
            return;
        }

        if (this.props.data.bookmarks.entities.length >= this.props.data.bookmarks.entities.total) {
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

                previousResult.entities = Object.assign({}, previousResult.bookmarks, {
                    entities: [...previousResult.bookmarks.entities, ...fetchMoreResult.data.bookmarks.entities]
                })

                return previousResult;
            }
        })
    }

    render() {
        let children = [];
        if (this.props.data.bookmarks) {
            children = this.props.data.bookmarks.entities.map((child, i) => (
                <this.props.childClass key={i} subtype={this.props.subtype} entity={child} />
            ))
        }

        let noItems = ""
        if (this.props.data.bookmarks && this.props.data.bookmarks.entities.length === 0) {
            noItems = "Er zijn geen items in deze categorie."
        }

        return (
            <div ref="infiniteScroll">
                {noItems}
                {children}
            </div>
        )
    }
}

export default InfiniteList;