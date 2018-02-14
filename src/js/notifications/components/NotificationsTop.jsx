import React from "react"
import { Link } from "react-router-dom"
import { graphql, gql } from "react-apollo"
import classnames from "classnames"
import Notification from "./Notification"
import autobind from "autobind-decorator"

let isFetchingMore = false

class NotificationsList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            offset: 0,
            isVisible: false
        }
    }

    @autobind
    toggleVisiblity(e) {
        this.setState({ isVisible: !this.state.isVisible })
    }

    @autobind
    markAllAsRead(e) {
        this.props.mutate({
            variables: {
                input: { clientMutationId: "1" }
            },
            refetchQueries: ["NotificationsList"]
        })
    }

    @autobind
    onScroll(e) {
        if (!this.refs.list) {
            return
        }

        if (this.props.data.loading || isFetchingMore) {
            return
        }

        if (this.props.data.notifications.total === 0) {
            return
        }

        if (this.props.data.notifications.total === this.props.data.notifications.edges.length) {
            return
        }

        if ((e.target.scrollHeight - (e.target.scrollTop + e.target.offsetHeight)) > 200) {
            return
        }

        isFetchingMore = true
        this.fetchMore()
    }

    @autobind
    fetchMore() {
        let offset = this.state.offset + 20

        this.setState({
            offset
        })

        this.props.data.fetchMore({
            variables: { offset },
            updateQuery: (previousResult, { fetchMoreResult }) => {
                isFetchingMore = false

                return Object.assign({}, previousResult, {
                    notifications: Object.assign({}, previousResult.notifications, {
                        edges: [...previousResult.notifications.edges, ...fetchMoreResult.notifications.edges]
                    })
                });
            }
        })

    }

    render() {
        const { notifications, viewer } = this.props.data

        if (!notifications || !viewer) {
            return (
                <div />
            )
        }

        const list = notifications.edges.map((notification, i) => (
            <Notification key={i} notification={notification} />
        ))

        let placeholder
        if (notifications.total === 0) {
            placeholder = (
                <div className="notification">Er zijn momenteel geen meldingen.</div>
            )
        }

        let markAll, badge
        if (notifications.totalUnread !== 0) {
            markAll = (
                <div className="button__text ___grey" onClick={this.markAllAsRead}>Alles gelezen</div>
            )
            badge = (
                <div className="navigation__badge">{notifications.totalUnread}</div>
            )
        }

        return (
            <div tabIndex="0" className="navigation__action ___notifications" title="Meldingen" onClick={this.toggleVisiblity}>
                {badge}
                <span>Meldingen</span>
                <div className={classnames({"tooltip": true, "___is-visible": this.state.isVisible})}>
                    <div className="notifications__header">
                        <div className="flexer ___space-between">
                            <div className="notifications__title">Meldingen</div>
                            <div className="flexer">
                                {markAll}
                                <Link to={`/profile/${viewer.user.username}/interests`} className="button__icon ___settings" />
                            </div>
                        </div>
                    </div>
                    <div ref="list" className="notifications__scroll" onScroll={this.onScroll}>
                        {placeholder}
                        {list}
                    </div>
                </div>
            </div>
        )
    }
}

const Query = gql`
    query NotificationsList($offset: Int) {
        viewer {
            guid
            user {
                guid
                username
            }
        }
        notifications(offset: $offset, limit: 20) {
            total
            totalUnread
            edges {
                id
                action
                performer {
                    guid
                    name
                    username
                    icon
                }
                entity {
                    guid
                    ... on Object {
                        title
                        url
                    }
                }
                container {
                    guid
                    ... on Group {
                        name
                    }
                }
                isUnread
                timeCreated
            }
        }
    }
`

const Mutation = gql`
    mutation NotificationsTop($input: markAllAsReadInput!) {
        markAllAsRead(input: $input) {
            success
        }
    }
`

export default graphql(Query, { options: { pollInterval: 5*60*1000 } })(graphql(Mutation)(NotificationsList))