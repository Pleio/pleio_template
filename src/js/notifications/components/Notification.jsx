import React from "react"
import { Link } from "react-router-dom"
import { graphql, gql, withApollo } from "react-apollo"
import classnames from "classnames"
import autobind from "autobind-decorator"
import { withRouter } from "react-router-dom"

class Notification extends React.Component {
    @autobind
    navigateTo(e) {
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
                window.location = notification.entity.url
            })
        } else {
            this.props.history.push(notification.entity.url)
        }
    }

    render() {
        const { notification } = this.props

        let message
        switch (notification.action) {
            case "commented":
                message = "heeft gereageerd op"
                break
        }

        return (
            <a onClick={this.navigateTo} href={notification.entity.url}>
                <div className={classnames({ notification: true, "___is-unread": notification.isUnread })}>
                    <div className="face" style={{ backgroundImage: `url('${notification.performer.icon}')` }} />
                    <div>
                        <strong>{notification.performer.name}</strong>
                        &nbsp;{message}&nbsp;
                            {notification.entity.title || notification.entity.name}
                        <span className="___greyed">&nbsp;{notification.timeCreated}</span>
                    </div>
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