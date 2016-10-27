import React from "react"

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

        if (!this.props.data.activities) {
            return;
        }

        if (this.props.data.activities.activities.length >= this.props.data.activities.activities.total) {
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

                previousResult.activities = Object.assign({}, previousResult.activities, {
                    activities: [...previousResult.activities.activities, ...fetchMoreResult.data.activities.activities]
                })

                return previousResult;
            }
        })
    }

    refetch() {
        this.setState({offset: 0})
    }

    render() {
        let children = [];
        if (this.props.data.activities) {
            children = this.props.data.activities.activities.map((child, i) => (
                <this.props.childClass key={i} entity={child} />
            ))
        }

        let noItems = ""
        if (this.props.data.activities && this.props.data.activities.activities.length === 0) {
            noItems = "Er zijn geen items in deze categorie."
        }

        return (
            <div ref="infiniteScroll" className={this.props.className}>
                    {noItems}
                    {children}
            </div>
        )
    }
}

export default InfiniteList;