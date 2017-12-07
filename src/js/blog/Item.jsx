import React from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import CommentList from "../core/components/CommentList"
import Edit from "../core/Edit"
import Delete from "../core/Delete"
import AddComment from "../core/containers/AddComment"
import SocialShare from "../core/components/SocialShare"
import NotFound from "../core/NotFound"
import showDate from "../lib/showDate"
import { Link, withRouter } from "react-router-dom"
import LikeAndBookmark from "../core/components/LikeAndBookmark"
import LoggedInButton from "../core/components/LoggedInButton"
import RichTextView from "../core/components/RichTextView"
import Document from "../core/components/Document"
import Featured from "../core/components/Featured"
import Follow from "../core/components/Follow"

class Item extends React.Component {
    getRootURL() {
        const { match } = this.props

        if (match.params.groupGuid && match.params.groupSlug) {
            return `/groups/view/${match.params.groupGuid}/${match.params.groupSlug}`
        }

        return ""
    }

    render() {
        const { location } = this.props
        let { entity, viewer } = this.props.data

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

        let edit
        if (entity.canEdit) {
            edit = (
                <Link to={`${this.getRootURL()}/blog/edit/${entity.guid}`}>
                    <div className="button__text article-action ___edit-post">
                        Bewerken
                    </div>
                </Link>
            )
        }

        return (
            <div>
                <Featured entity={entity} />
                <Document title={entity.title} />
                <section className="section">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2">
                                <article className="article">
                                    <div className="article-author ___margin-bottom">
                                        <Link to={entity.owner.url} style={{backgroundImage: "url(" + entity.owner.icon + ")"}} className="article-author__picture"></Link>
                                        <div className="article-author__justify">
                                            <Link to={entity.owner.url} className="article-author__name">
                                                {entity.owner.name}
                                            </Link>
                                            <div className="article-author__date">
                                                {showDate(entity.timeCreated)}
                                            </div>
                                        </div>
                                    </div>
                                    <h3 className="article__title">{entity.title}</h3>
                                    <RichTextView richValue={entity.richDescription} value={entity.description} />
                                    <LikeAndBookmark like={true} bookmark={true} viewer={viewer} entity={entity} />
                                    <div className="article-actions">
                                        {edit}
                                        <div className="article-actions__buttons">
                                            <LoggedInButton title="Schrijf een reactie" className="button article-action ___comment" viewer={viewer} onClick={(e) => this.refs.addComment.toggle()} fromComment>
                                                Schrijf een reactie
                                            </LoggedInButton>
                                            <SocialShare />
                                        </div>
                                        <Follow viewer={viewer} entity={entity} />
                                    </div>
                                </article>
                                <AddComment ref="addComment" viewer={viewer} object={entity} refetchQueries={["BlogItem"]} />
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
    query BlogItem($guid: Int!) {
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
                isRecommended
                canEdit
                tags
                url
                votes
                hasVoted
                isBookmarked
                isFollowing
                canBookmark
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
`;

const Settings = {
    options: (ownProps) => {
        return {
            variables: {
                guid: ownProps.match.params.guid
            }
        }
    }
}

export default graphql(Query, Settings)(withRouter(Item))