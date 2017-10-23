import React from "react"
import { graphql } from "react-apollo"
import { Link } from "react-router-dom"
import gql from "graphql-tag"
import CommentList from "../core/components/CommentList"
import EditModal from "../core/Edit"
import DeleteModal from "../core/Delete"
import AddComment from "../core/containers/AddComment"
import SocialShare from "../core/components/SocialShare"
import NotFound from "../core/NotFound"
import showDate from "../lib/showDate"
import RichTextView from "../core/components/RichTextView"
import LikeAndBookmark from "../core/components/LikeAndBookmark"
import Document from "../core/components/Document"
import Featured from "../core/components/Featured"

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
                    <Link to={`/news/edit/${entity.guid}`}>
                        <div className="button__text article-action ___edit-post">
                            Bewerken
                        </div>
                    </Link>
            )
        }

        if (entity.source) {
            source = (
                <div className="article-meta__source">
                    Bron:&nbsp;<span>{entity.source}</span>
                </div>
            )
        }

        return (
            <div>
                <Document title={entity.title} />
                <Featured entity={entity} />
                <section className="section">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2">
                                <article className="article">
                                    <h3 className="article__title">{entity.title}</h3>
                                    <div className="article-meta">
                                        <div className="article-meta__date">
                                            {showDate(entity.timeCreated)}
                                        </div>
                                        {source}
                                    </div>
                                    <RichTextView richValue={entity.richDescription} value={entity.description} />
                                    <LikeAndBookmark like={false} bookmark={true} viewer={viewer} entity={entity} />
                                    <div className="article-actions">
                                        {edit}
                                        <div className="article-actions__buttons">
                                            <SocialShare />
                                        </div>
                                    </div>
                                </article>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}

const Query = gql`
    query NewsItem($guid: Int!) {
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
                accessId
                timeCreated
                source
                isFeatured
                featured {
                    image
                    video
                    positionY
                }
                canEdit
                tags
                isBookmarked
                canBookmark
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