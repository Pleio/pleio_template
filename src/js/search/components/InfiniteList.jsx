import React from "react"
import Header from "./Header"

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

        if (!this.props.data.search) {
            return;
        }

        if (this.props.data.search.entities.length >= this.props.data.search.total) {
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

                previousResult.search = Object.assign({}, previousResult.search, {
                    entities: [...previousResult.search.entities, ...fetchMoreResult.data.search.entities]
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
        if (this.props.data.search) {
            children = this.props.data.search.entities.map((child, i) => (
                <this.props.childClass key={i} entity={child} />
            ))
        }

        let noItems = ""
        if (this.props.data.search && this.props.data.search.entities.length === 0) {
            noItems = "Er zijn geen items in deze categorie."
        }

        let totals = []
        if (this.props.data.search) {
            totals = this.props.data.search.totals
        }


        return (
            <div className="page-layout">
                <Header q={this.props.q} type={this.props.type} subtype={this.props.subtype} totals={totals} />
                <section className="section ___grey ___grow">
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-12 col-lg-8" ref="infiniteScroll">
                                {noItems}
                                {children}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}

export default InfiniteList;