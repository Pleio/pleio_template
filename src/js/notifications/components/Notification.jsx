import React from "react"
import { Link } from "react-router-dom"
import { graphql, gql, withApollo } from "react-apollo"
import classnames from "classnames"
import autobind from "autobind-decorator"
import { withRouter } from "react-router-dom"
import { timeSince } from "../../lib/showDate"

class Notification extends React.Component {
    @autobind
    navigateTo(e, url) {
        e.preventDefault()

        const { notification, client } = this.props

        if (notification.isUnread) {
            this.props.mutate({
                variables: {
                    input: {
                        clientMutationId: "1",
                        id: notification.id
                    }
                }
            }).then(() => {
                window.location = url
            })
        } else {
            this.props.history.push(url)
        }
    }

    render() {
        const { notification } = this.props

        let url, message
        switch (notification.action) {
            case "commented":
                url = notification.entity.url
                message = (
                    <div>
                        <strong>{notification.performer.name}</strong>
                        &nbsp;heeft gereageerd op&nbsp;
                        {notification.entity.title || notification.entity.name}
                        <span className="___greyed">&nbsp;{timeSince(notification.timeCreated)}</span>
                    </div>
                )
                break
            case "created":
                url = notification.entity.url
                message = (
                    <div>
                        <strong>{notification.performer.name}</strong>
                        &nbsp;heeft een nieuw item geplaatst&nbsp;
                        {notification.entity.title || notification.entity.name}
                        &nbsp;in&nbsp;
                        <strong>{notification.container.name}</strong>
                        <span className="___greyed">&nbsp;{timeSince(notification.timeCreated)}</span>
                    </div>
                )
                break
            case "welcome":
                url = `/profile/${notification.performer.username}/interests`
                message = "Welkom op deze site. Klik hier om je meldingen in te stellen."
                break
        }

        return (
            <a onClick={(e) => this.navigateTo(e, url)} href={url}>
                <div className={classnames({ notification: true, "___is-unread": notification.isUnread })}>
                    <div className="face" style={{ backgroundImage: `url('${notification.performer.icon}')` }} />
                    {message}
                </div>
            </a>
        )
    }
}

const Mutation = gql`
    mutation Notification($input: markAsReadInput!) {
        markAsRead(input: $input) {
            success
            notification {
                id
                isUnread
            }
        }
    }
`

export default graphql(Mutation)(withRouter(withApollo(Notification)))