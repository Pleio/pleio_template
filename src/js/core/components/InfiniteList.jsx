import React from "react"
import { getAttribute } from "../../lib/helpers"

let isFetchingMore = false

class InfiniteList extends React.Component {
    constructor(props) {
        super(props)

        this.onScroll = this.onScroll.bind(this)
        this.fetchMore = this.fetchMore.bind(this)
        this.refetch = this.refetch.bind(this)

        this.state = {
            offset: 0,
            loading: false
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
        if (nextProps !== this.props) {
            if (nextProps.onChange) {
                nextProps.onChange()
            }
        }

        if (nextProps.tags !== this.props.tags) {
            this.setState({
                offset: 0
            })
        }
    }

    getRootFieldName() {
        const { data } = this.props

        if (data.entities) { return "entities" }
        if (data.groups) { return "groups" }
        if (data.events) { return "events" }
        if (data.files) { return "files" }
        if (data.activities) { return "activities" }
        if (data.bookmarks) { return "bookmarks" }
        if (data.search) { return "search" }
    }

    onScroll(e) {
        if (!this.refs.infiniteScroll) {
            // the infinite scroll component is not rendered yet
            return
        }

        let scrollTop = document.body.scrollTop ? document.body.scrollTop : (document.documentElement.scrollTop)
        let currentOffset = scrollTop + window.innerHeight;
        let containerOffset = this.refs.infiniteScroll.offsetHeight + this.refs.infiniteScroll.offsetTop;

        if (this.props.data.loading) {
            // the infinite scroll component is rendering the first items
            return
        }

        if (currentOffset < containerOffset) {
            return
        }

        const rootFieldName = this.getRootFieldName()

        if (!this.props.data[rootFieldName]) {
            return
        }

        if (this.props.data[rootFieldName].edges.length >= this.props.data[rootFieldName].total) {
            return
        }

        if (isFetchingMore) {
            return
        }

        isFetchingMore = true
        this.fetchMore()
    }

    fetchMore() {
        let offset = this.state.offset + this.props.limit

        this.setState({
            loading: true,
            offset
        })

        this.props.data.fetchMore({
            variables: {
                offset
            },
            updateQuery: (previousResult, { fetchMoreResult }) => {
                isFetchingMore = false

                const rootFieldName = this.getRootFieldName(fetchMoreResult)

                this.setState({
                    loading: false
                })

                return Object.assign({}, previousResult, {
                    [rootFieldName]: Object.assign({}, previousResult[rootFieldName], {
                        edges: [...previousResult[rootFieldName].edges, ...fetchMoreResult[rootFieldName].edges]
                    })
                });
            }
        })
    }

    refetch() {
        this.setState({offset: 0})
    }

    render() {
        const rootFieldName = this.getRootFieldName()
        const { data } = this.props

        if (!data[rootFieldName]) {
            return (
                <div />
            )
        }

        if (data[rootFieldName] && data[rootFieldName].edges.length === 0) {
            if (this.props.inTable) {
                return (
                    <tr>
                        <td></td>
                        <td></td>
                        <td>Er zijn geen items in deze categorie.</td>
                    </tr>
                )
            } else {
                return (
                    <div className={getAttribute("containerClassName", this.props, "container")} ref="infiniteScroll">
                        <div className={getAttribute("rowClassName", this.props, "row fill")}>
                            <div className="col-sm-12">
                                Er zijn geen items in deze categorie.
                            </div>
                        </div>
                    </div>
                )
            }
        }

        let loading
        if (this.state.loading) {
            loading = (
                <div className="infinite-scroll__spinner">
                    <img src="/mod/pleio_template/src/images/spinner.svg" />
                </div>
            )
        }

        const items = data[rootFieldName].edges.map((item, i) => (
            <this.props.childClass key={i} subtype={this.props.subtype} entity={item} {...this.props} />
        ))

        if (this.props.hasRows) {
            return (
                <div className={getAttribute("containerClassName", this.props, "container")} ref="infiniteScroll">
                    <div className={getAttribute("rowClassName", this.props, "row fill")}>
                        {items}
                        {loading}
                    </div>
                </div>
            )
        } else if (this.props.inTable) {
            return (
                <tbody ref="infiniteScroll">
                    {items}
                    {loading}
                </tbody>
            )
        } else {
            return (
                <div className={getAttribute("containerClassName", this.props, "container")} ref="infiniteScroll">
                    {items}
                    {loading}
                </div>
            )
        }
    }
}

export default InfiniteList;