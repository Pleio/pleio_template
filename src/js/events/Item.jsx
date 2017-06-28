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
import Featured from "../core/components/Featured"
import AttendButtons from "./components/AttendButtons"

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
        let { entity, viewer } = this.props.data
        let edit, featured, source

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

        let comment
        if (viewer.loggedIn) {
            comment = (
                <div title="Schrijf een reactie" className="button article-action ___comment" onClick={this.toggleAddComment}>
                    Schrijf een reactie
                </div>
            )
        }

        return (
            <div>
                <Document title={entity.title} />
                <div className={"lead ___event ___bottom"}>
                    <div className="lead__background" style={{"backgroundImage": `url(${entity.featured.image})`, "backgroundPositionY": entity.featured.positionY + "%"}} />
                    <div className="lead__justify">
                        <div className="container">
                            <div className="row">
                                <div className="col-sm-9 bottom-sm col-lg-6">
                                    <div>
                                        <h1 className="lead__title">{entity.title}</h1>
                                        <span>Georganiseerd door {entity.owner.name}</span>
                                    </div>
                                </div>
                                <div className="col-sm-3 end-sm bottom-sm col-lg-6">
                                    <AttendButtons entity={entity} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <section className="section">
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-4 last-sm top-sm">
                                <div className="card">
                                    <div className="title">Aanwezig</div>
                                </div>
                            </div>
                            <div className="col-sm-8">
                                <h2 className="title">{showFullDate(entity.startDate)}<small>Den Haag</small></h2>
                                <a className="link">Tickets</a>
                                <RichTextView richValue={entity.richDescription} value={entity.description} />
                                    <div className="article-actions">
                                        {edit}
                                        <div className="article-actions__buttons">
                                            {comment}
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
    query EventItem($guid: String!) {
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