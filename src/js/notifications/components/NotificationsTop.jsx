import React from "react"
import { Link } from "react-router-dom"
import { graphql, gql } from "react-apollo"
import classnames from "classnames"

class NotificationsList extends React.Component {
    render() {
        const { notifications, viewer } = this.props.data

        if (!notifications || !viewer) {
            return (
                <div />
            )
        }

        const list = notifications.notifications.map((notification, i) => (
            <div className={classnames({notification:true, "___is-unread": true})}>
                <div className="face" style={{backgroundImage: `url()`}} />
                <div>
                    <strong>Piet</strong> heeft iets gedaan
                    <span className="___greyed">1 uur geleden</span>
                </div>
            </div>
        ))

        let placeholder, markAll, badge
        if (list.length !== 0) {
            markAll = (
                <div className="button__text ___grey">Alles gelezen</div>
            )
            badge = (
                <div className="navigation__badge">{list.length}</div>
            )
        } else {
            placeholder = (
                <div className="notification">Er zijn momenteel geen meldingen.</div>
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
            notifications {
                type
            }
        }
    }
`

export default graphql(Query)(NotificationsList)