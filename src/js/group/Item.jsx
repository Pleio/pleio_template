import React from "react"
import { graphql } from "react-apollo"
import { Link } from "react-router-dom"
import gql from "graphql-tag"
import { showModal } from "../lib/actions"
import Document from "../core/components/Document"
import ContentHeader from "../core/components/ContentHeader"
import NotFound from "../core/NotFound"
import Card from "../activity/components/Card"
import MoreInfoModal from "./components/MoreInfoModal"
import LeaveGroupModal from "./components/LeaveGroupModal"
import InviteModal from "./components/InviteModal"
import MembersSummary from "./components/MembersSummary"
import ActivityList from "./components/ActivityList"
import Menu from "./components/Menu"
import JoinGroupButton from "./components/JoinGroupButton"

class Item extends React.Component {
    constructor(props) {
        super(props)
    }

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
                    <div className="button ___large ___line">
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

        return (
            <div className="page-container">    
                <Document title={entity.name} />
                <ContentHeader className="___no-padding-bottom">
                    <div className="row">
                        <div className="col-sm-6">
                            <h3 className="main__title ___info">
                                {entity.name}
                                <div onClick={() => this.refs.moreInfoModal.toggle()} />
                            </h3>
                        </div>
                        <div className="col-sm-6 end-sm">
                            <div className="buttons ___no-margin ___gutter ___hide-on-tablet">
                                {join}
                                {leave}
                                {edit}
                                {invite}
                            </div>
                        </div>
                    </div>
                    <Menu match={this.props.match} group={entity} />
                </ContentHeader>
                <section className="section ___grey ___grow">
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-12 col-lg-4 last-lg top-lg">
                                <MembersSummary entity={entity} /> 
                            </div>
                            <div className="col-sm-12 col-lg-8">
                                <ActivityList containerGuid={entity.guid} containerClassName="" childClass={Card} offset={0} limit={20} tags={[]} />
                            </div>
                        </div>
                    </div>
                </section>
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

export default graphql(Query, Settings)(Item)