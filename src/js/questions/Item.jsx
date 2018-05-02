import React from "react"
import { graphql } from "react-apollo"
import { Link, withRouter } from "react-router-dom"
import gql from "graphql-tag"
import CommentList from "../core/components/CommentList"
import Edit from "../core/Edit"
import Delete from "../core/Delete"
import AddComment from "../core/containers/AddComment"
import SocialShare from "../core/components/SocialShare"
import NotFound from "../core/NotFound"
import showDate from "../lib/showDate"
import RichTextView from "../core/components/RichTextView"
import LikeAndBookmark from "../core/components/LikeAndBookmark"
import Document from "../core/components/Document"
import LoggedInButton from "../core/components/LoggedInButton"
import Follow from "../core/components/Follow"

class Item extends React.Component {
    getRootURL() {
        const { match } = this.props

        if (match.params.groupGuid && match.params.groupSlug) {
            return `/groups/view/${match.params.groupGuid}/${
                match.params.groupSlug
            }`
        }

        return ""
    }

    render() {
        let { entity, viewer } = this.props.data

        if (!entity) {
            // Loading...
            return <div />
        }

        if (entity.status == 404) {
            return <NotFound />
        }

        let edit = ""
        if (entity.canEdit) {
            edit = (
                <Link to={`${this.getRootURL()}/questions/edit/${entity.guid}`}>
                    <div
                        className="button__text article-action ___edit-post"
                        onClick={this.onEdit}
                    >
                        Bewerken
                    </div>
                </Link>
            )
        }

        return (
            <div>
                <Document title={entity.title} />
                <section className="section">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2">
                                <article className="article">
                                    <div className="article-author ___margin-bottom">
                                        <Link
                                            to={entity.owner.url}
                                            style={{
                                                backgroundImage:
                                                    "url(" +
                                                    entity.owner.icon +
                                                    ")"
                                            }}
                                            className="article-author__picture"
                                        />
                                        <div className="article-author__justify">
                                            <Link
                                                to={entity.owner.url}
                                                className="article-author__name"
                                            >
                                                {entity.owner.name}
                                            </Link>
                                            <div className="article-author__date">
                                                {showDate(entity.timeCreated)}
                                            </div>
                                        </div>
                                    </div>
                                    <h3 className="article__title">
                                        {entity.title}
                                    </h3>
                                    <RichTextView
                                        richValue={entity.richDescription}
                                        value={entity.description}
                                    />
                                    <LikeAndBookmark
                                        like={true}
                                        bookmark={true}
                                        viewer={viewer}
                                        entity={entity}
                                    />
                                    <div className="article-actions">
                                        {edit}
                                        <div className="article-actions__buttons">
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
                                            <SocialShare />
                                        </div>
                                        <Follow
                                            viewer={viewer}
                                            entity={entity}
                                        />
                                    </div>
                                </article>
                                <AddComment
                                    ref="addComment"
                                    viewer={viewer}
                                    object={entity}
                                    refetchQueries={["QuestionsItem"]}
                                />
                                <CommentList
                                    comments={entity.comments}
                                    canVote={true}
                                    canUpvote={true}
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}

const Query = gql`
    query QuestionsItem($guid: Int!) {
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
                featured {
                    image
                    video
                    positionY
                }
                canEdit
                tags
                votes
                hasVoted
                isBookmarked
                isFollowing
                canBookmark
                canComment
                owner {
                    guid
                    username
                    name
                    icon
                    url
                }
                comments {
                    guid
                    description
                    richDescription
                    isBestAnswer
                    canChooseBestAnswer
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
    options: ownProps => {
        return {
            variables: {
                guid: ownProps.match.params.guid
            }
        }
    }
}

export default graphql(Query, Settings)(Item)
