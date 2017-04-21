import React from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import CommentList from "../core/components/CommentList"
import Edit from "../core/Edit"
import Delete from "../core/Delete"
import { showModal } from "../lib/actions"
import AddComment from "../core/containers/AddComment"
import SocialShare from "../core/components/SocialShare"
import NotFound from "../core/NotFound"
import showDate from "../lib/showDate"
import { Link } from "react-router-dom"
import LikeAndBookmark from "../core/components/LikeAndBookmark"
import RichTextView from "../core/components/RichTextView"
import Document from "../core/components/Document"

class Item extends React.Component {
    constructor(props) {
        super(props)

        this.toggleAddComment = () => this.setState({showAddComment: !this.state.showAddComment})
        this.closeAddComment = () => this.setState({showAddComment: false})

        this.state = {
            showAddComment: false
        }
    }


    render() {
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

        let featuredImage = ""
        if (entity.featuredImage) {
            featuredImage = (
                <div style={{backgroundImage: "url(" + entity.featuredImage + ")"}} className="lead ___content">
                    <div className="lead__justify">
                    <div className="container">
                    </div>
                    </div>
                </div>
            )
        }

        let edit
        if (entity.canEdit) {
            edit = (
                <Link to={`/blog/edit/${entity.guid}`}>
                    <div className="button__text article-action ___edit-post">
                        Bewerken
                    </div>
                </Link>
            )
        }

        let actions
        if (viewer.loggedIn) {
            actions = (
                <div className="article-actions__buttons">
                    <div className="article-actions__justify">
                        <div title="Schrijf een reactie" className="button article-action ___comment" onClick={this.toggleAddComment}>
                            Schrijf een reactie
                        </div>
                        {edit}
                    </div>
                </div>
            )
        }

        return (
            <div>
                {featuredImage}
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
                                        <SocialShare />
                                        {actions}
                                    </div>
                                </article>
                                <AddComment viewer={viewer} isOpen={this.state.showAddComment} object={entity} onSuccess={this.closeAddComment} refetchQueries={["BlogItem"]} />
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
    query BlogItem($guid: String!) {
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
                featuredImage
                isRecommended
                canEdit
                tags
                url
                votes
                hasVoted
                isBookmarked
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

export default graphql(Query, Settings)(Item)