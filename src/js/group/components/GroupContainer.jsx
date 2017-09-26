import React from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import { Link } from "react-router-dom"
import Featured from "../../core/components/Featured"
import Menu from "./Menu"
import MoreInfoModal from "./MoreInfoModal"
import LeaveGroupModal from "./LeaveGroupModal"
import InviteModal from "./InviteModal"
import JoinGroupButton from "./JoinGroupButton"

class GroupContainer extends React.Component {
    render() {
        const { entity, viewer } = this.props.data

        if (!entity) {
            // Loading...
            return (
                <div></div>
            )
        }

        if (entity.status == 404) {
            return (
                <NotFound />
            )
        }

        let icon
        if (!entity.featured.image && !entity.featured.video) {
            icon = (
                <div className="picture" style={{backgroundImage: `url(${entity.icon})`}} />
            )
        }

        let join, leave, edit, invite
        if (((viewer.loggedIn && !entity.isClosed) || entity.canEdit) && entity.membership === "not_joined") {
            join = (
                <JoinGroupButton entity={entity} />
            )
        }

        if (!entity.canEdit && entity.membership === "joined") {
            leave = (
                <div className="button" onClick={() => this.refs.leaveGroupModal.toggle()}>Verlaat groep</div>
            )
        }

        if (entity.canEdit) {
            edit = (
                <Link to={`/groups/edit/${entity.guid}`} >
                    <div className="button ___large">
                        <span>Groep bewerken</span>
                    </div>
                </Link>
            )
        }

        if (entity.membership === "joined" && entity.canEdit) {
            invite = (
                <div className="button ___large" onClick={() => this.refs.inviteModal.toggle()}>
                    Leden uitnodigen
                </div>
            )
        }

        let buttons = this.props.buttons
        if (!buttons) {
            buttons = (
                <div className="flexer ___gutter ___top">
                    {join}
                    {leave}
                    {edit}
                    {invite}
                </div>
            )
        }

        return (
            <div className="page-container">
                <Featured entity={entity} group showEmpty>
                    <h1 className="lead__title" onClick={() => this.refs.moreInfoModal.toggle()}>
                        {icon}
                        <span>{entity.name}</span>
                    </h1>
                    <div className="button ___options"></div>
                    {buttons}
                </Featured>
                <div className="container">
                    <Menu entity={entity} />
                </div>
                {this.props.children}
                <MoreInfoModal ref="moreInfoModal" entity={entity} />
                <LeaveGroupModal ref="leaveGroupModal" entity={entity} />
                <InviteModal ref="inviteModal" entity={entity} />
            </div>
        )
    }
}

const Query = gql`
    query GroupItem($guid: String!) {
        viewer {
            guid
            loggedIn
            user {
                guid
                name
                icon
                url
            }
        }
        entity(guid: $guid) {
            guid
            status
            ... on Group {
                name
                plugins
                description
                icon
                featured {
                    video
                    image
                    positionY
                }
                isClosed
                canEdit
                membership
                members(limit: 5) {
                    total
                    edges {
                        role
                        email
                        user {
                            guid
                            username
                            url
                            name
                            icon
                        }
                    }
                }
            }
        }
    }
`

const Settings = {
    options: (ownProps) => {
        return {
            variables: {
                guid: ownProps.match.params.groupGuid
            }
        }
    }
}

export default graphql(Query, Settings)(GroupContainer)