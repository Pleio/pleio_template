import React from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import { Link, withRouter } from "react-router-dom"
import Featured from "../../core/components/Featured"
import DropdownButton from "../../core/components/DropdownButton"
import Menu from "./Menu"
import MoreInfoModal from "./MoreInfoModal"
import LeaveGroupModal from "./LeaveGroupModal"
import InviteModal from "./InviteModal"
import MembershipRequestsModal from "./MembershipRequestsModal"
import SendMessageModal from "./SendMessageModal"
import SubgroupsModal from "./SubgroupsModal"
import JoinGroupButton from "./JoinGroupButton"

class GroupContainer extends React.Component {
    componentWillReceiveProps(nextProps) {
        const { entity } = nextProps.data
        const { history } = nextProps

        if (!entity) {
            return
        }

        if (entity.isClosed && (!entity.canEdit && entity.membership !== "joined")) {
            history.push(`/groups/info/${entity.guid}`)
        }
    }

    render() {
        const { match, history } = this.props
        const { entity, viewer } = this.props.data

        if (!entity) {
            return (
                <div />
            )
        }

        if (entity.status == 404) {
            return (
                <NotFound />
            )
        }

        if (entity.isClosed && (!entity.canEdit && entity.membership !== "joined")) {
            return (
                <div />
            )
        }

        let icon
        if (!entity.featured.image && !entity.featured.video) {
            icon = (
                <div className="picture" style={{backgroundImage: `url(${entity.icon})`}} />
            )
        }

        let join
        if (((viewer.loggedIn && !entity.isClosed) || entity.canEdit) && entity.membership === "not_joined") {
            join = (
                <JoinGroupButton entity={entity} />
            )
        }

        let leave
        if (!entity.canEdit && entity.membership === "joined") {
            leave = (
                <div className="button" onClick={() => this.refs.leaveGroupModal.toggle()}>Uitschrijven groep</div>
            )
        }

        let edit, modals
        if (entity.canEdit) {
            const options = [
                { to: `/groups/edit/${entity.guid}`, name: "Groep bewerken" },
                { onClick: () => this.refs.inviteModal.toggle(), name: "Leden uitnodigen" },
                { onClick: () => this.refs.membershipRequestsModal.toggle(), name: "Toegangsaanvragen" },
                { onClick: () => this.refs.sendMessageModal.toggle(), name: "E-mail versturen" },
                { onClick: () => this.refs.subgroupsModal.toggle(), name: "Subgroepen" },
            ]

            if (window.__SETTINGS__['groupMemberExport']) {
                options.push({ href: `/csv-export/group/${entity.guid}`, name: "Ledenlijst exporteren" })
            }

            edit = (
                <DropdownButton options={options} name="Beheer" line colored />
            )

            modals  = (
                <div>
                    <InviteModal ref="inviteModal" entity={entity} />
                    <MembershipRequestsModal ref="membershipRequestsModal" entity={entity} />
                    <SendMessageModal ref="sendMessageModal" entity={entity} viewer={viewer} />
                    <SubgroupsModal ref="subgroupsModal" entity={entity} viewer={viewer} />
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
                    {buttons}
                </Featured>
                <div className="container">
                    <Menu entity={entity} />
                </div>
                {this.props.children}
                <MoreInfoModal ref="moreInfoModal" entity={entity} />
                <LeaveGroupModal ref="leaveGroupModal" entity={entity} />
                {modals}
            </div>
        )
    }
}

const Query = gql`
    query GroupItem($guid: Int!) {
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
                defaultAccessId
                accessIds {
                    id
                    description
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

export default graphql(Query, Settings)(withRouter(GroupContainer))