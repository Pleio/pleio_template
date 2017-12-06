import React from "react"
import { Link } from "react-router-dom"
import { graphql, gql } from "react-apollo"
import classnames from "classnames"
import Notification from "./Notification"
import autobind from "autobind-decorator"

class NotificationsList extends React.Component {
    @autobind
    markAllAsRead(e) {
        this.props.mutate({
            variables: {
                input: { clientMutationId: "1" }
            },
            refetchQueries: ["NotificationsList"]
        })
    }

    render() {
        const { notifications, viewer } = this.props.data

        if (!notifications || !viewer) {
            return (
                <div />
            )
        }

        const list = notifications.notifications.map((notification, i) => (
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
                <div className="navigation__badge">{notifications.totalUnread }</div>
            )
        }

        return (
            <div className="navigation__action ___notifications" title="Meldingen">
                {badge}
                <span>Meldingen</span>
                <div className="tooltip">
                    <div className="notifications__header">
                        <div className="flexer ___space-between">
                            <div className="notifications__title">Meldingen</div>
                            <div className="flexer">
                                {markAll}
                                <Link to={`/profile/${viewer.user.username}/interests`} className="button__icon ___settings" />
                            </div>
                        </div>
                    </div>
                    <div className="notifications__scroll">
                        {placeholder}
                        {list}
                    </div>
                </div>
            </div>
        )
    }
}

const Query = gql`
    query NotificationsList {
        viewer {
            guid
            user {
                guid
                username
            }
        }
        notifications {
            total
            totalUnread
            notifications {
                id
                action
                performer {
                    guid
                    name
                    icon
                }
                entity {
                    guid
                    ... on Object {
                        title
                        url
                    }
                }
                isUnread
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

export default graphql(Query, {
    options: {
        pollInterval: 5*60*1000
    }
})(graphql(Mutation)(NotificationsList))