import React from "react"
import { graphql } from "react-apollo"
import { Link } from "react-router-dom"
import gql from "graphql-tag"
import CommentList from "../core/components/CommentList"
import AddComment from "../core/containers/AddComment"
import EditModal from "../core/Edit"
import DeleteModal from "../core/Delete"
import SocialShare from "../core/components/SocialShare"
import NotFound from "../core/NotFound"
import showDate from "../lib/showDate"
import RichTextView from "../core/components/RichTextView"
import LikeAndBookmark from "../core/components/LikeAndBookmark"
import LoggedInButton from "../core/components/LoggedInButton"
import Document from "../core/components/Document"
import Featured from "../core/components/Featured"

class Item extends React.Component {
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

        let comments, commentButton
        if (window.__SETTINGS__['commentsOnNews']) {
            commentButton = (
                <LoggedInButton
                title="Schrijf een reactie"
                className="button article-action ___comment"
                viewer={viewer}
                onClick={e =>
                    this.refs.addComment.toggle()
                }
                fromComment
                >
                    Reageer
                </LoggedInButton>
            )

            comments = (
                <div>
                    <AddComment
                    ref="addComment"
                    viewer={viewer}
                    object={entity}
                    refetchQueries={["NewsItem"]}
                    />
                    <CommentList
                        comments={entity.comments}
                        canVote={true}
                    />
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
                                            {commentButton}
                                            <SocialShare />
                                        </div>
                                    </div>
                                </article>
                                {comments}
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
                comments {
                    guid
                    description
                    richDescription
                    canEdit
                    timeCreated
                    hasVoted
                    canVote
                    votes
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