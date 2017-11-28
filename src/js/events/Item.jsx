import React from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import { Link } from "react-router-dom"
import CommentList from "../core/components/CommentList"
import EditModal from "../core/Edit"
import DeleteModal from "../core/Delete"
import AddComment from "../core/containers/AddComment"
import SocialShare from "../core/components/SocialShare"
import NotFound from "../core/NotFound"
import { showFullDate } from "../lib/showDate"
import RichTextView from "../core/components/RichTextView"
import LikeAndBookmark from "../core/components/LikeAndBookmark"
import Document from "../core/components/Document"
import People from "../core/components/People"
import Featured from "../core/components/Featured"
import AttendButtons from "./components/AttendButtons"
import AttendeesModal from "./components/AttendeesModal"
import LoggedInButton from "../core/components/LoggedInButton"

class Item extends React.Component {
    constructor(props) {
        super(props)

        this.onEdit = () => this.props.dispatch(showModal("edit"))
        this.onDelete = () => this.props.dispatch(showModal("delete"))
        this.toggleAddComment = () => this.setState({showAddComment: !this.state.showAddComment})
        this.closeAddComment = () => this.setState({showAddComment: false})

        this.state = {
            showAddComment: false
        }
    }

    getRootURL() {
        const { match } = this.props

        if (match.params.groupGuid && match.params.groupSlug) {
            return `/groups/view/${match.params.groupGuid}/${match.params.groupSlug}`
        }

        return ""
    }

    render() {
        const { match } = this.props
        let { entity, viewer } = this.props.data
        let edit

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

        if (entity.canEdit) {
            edit = (
                <div className="article-actions__justify">
                    <Link to={`${this.getRootURL()}/events/edit/${entity.guid}`}>
                        <div className="button__text article-action ___edit-post">
                            Bewerken
                        </div>
                    </Link>
                </div>
            )
        }

        let source
        if (entity.source) {
            source = (
                <a className="link" href={entity.source} target="_blank">Externe link</a>
            )
        }

        let attendees, attendButtons, attendButtonsWithAttendees

        if (entity.rsvp) {
            attendButtons = (
                <AttendButtons viewer={viewer} entity={entity} />
            )

            if (this.props.group) {
                attendButtonsWithAttendees = attendButtons
            }

            attendees = (
                <div className="card">
                    <a onClick={() => this.refs.modal.toggle()}>
                        <People users={entity.attendees} />
                    </a>
                    <div className="flexer ___space-between">
                        <div className="attendees">
                            <a onClick={() => this.refs.modal.toggle(0)}>
                                <div className="attendees__number">{entity.attendees.total}</div>
                                <div className="attendees__label">aanwezig</div>
                            </a>
                        </div>
                        <div className="attendees">
                            <a onClick={() => this.refs.modal.toggle(1)}>
                                <div className="attendees__number">{entity.attendees.totalMaybe}</div>
                                <div className="attendees__label">misschien</div>
                            </a>
                        </div>
                        <div className="attendees">
                            <a onClick={() => this.refs.modal.toggle(2)}>
                                <div className="attendees__number">{entity.attendees.totalReject}</div>
                                <div className="attendees__label">afwezig</div>
                            </a>
                        </div>
                    </div>
                    {attendButtonsWithAttendees}
                    <AttendeesModal ref="modal" entity={entity} />
                </div>
            )
        }

        let featured
        if (!this.props.group) {
            featured = (
                <Featured entity={entity} showEmpty event bottom>
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-9 bottom-sm col-lg-6">
                                <div>
                                    <h1 className="lead__title">{entity.title}</h1>
                                    <span>Georganiseerd door {entity.owner.name}</span>
                                </div>
                            </div>
                            <div className="col-sm-3 end-sm bottom-sm col-lg-6">
                                {attendButtons}
                            </div>
                        </div>
                    </div>
                </Featured>
            )
        }

        return (
            <div>
                <Document title={entity.title} />
                {featured}
                <section className="section">
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-4 last-sm top-sm">
                                {attendees}
                            </div>
                            <div className="col-sm-8">
                                <h2 className="title">{showFullDate(entity.startDate)}<small>{entity.location}</small></h2>
                                {source}
                                <RichTextView richValue={entity.richDescription} value={entity.description} />
                                    <div className="article-actions">
                                        {edit}
                                        <div className="article-actions__buttons">
                                            <LoggedInButton title="Schrijf een reactie" className="button article-action ___comment" viewer={viewer} onClick={this.toggleAddComment} fromComment>
                                                Schrijf een reactie
                                            </LoggedInButton>
                                        </div>
                                    </div>
                                <AddComment viewer={viewer} isOpen={this.state.showAddComment} object={entity} onSuccess={this.closeAddComment} refetchQueries={["EventItem"]} />
                                <CommentList comments={entity.comments} />
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}

const Query = gql`
    query EventItem($guid: Int!) {
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
            ... on Object {
                title
                description
                richDescription
                startDate
                endDate
                accessId
                timeCreated
                source
                location
                rsvp
                isFeatured
                owner {
                    guid
                    name
                }
                featured {
                    image
                    video
                    positionY
                }
                isAttending
                attendees(limit: 5) {
                    total
                    totalMaybe
                    totalReject
                    edges {
                        guid
                        name
                        username
                        icon
                    }
                }
                url
                canEdit
                canComment
                tags
                isBookmarked
                canBookmark
                comments {
                    guid
                    description
                    timeCreated
                    canEdit
                    owner {
                        guid
                        username
                        name
                        icon
                        url
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
                guid: ownProps.match.params.guid
            }
        }
    }
}

export default graphql(Query, Settings)(Item)