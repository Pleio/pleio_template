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
import { Link } from "react-router-dom"
import LikeAndBookmark from "../core/components/LikeAndBookmark"
import RichTextView from "../core/components/RichTextView"
import Document from "../core/components/Document"
import Featured from "../core/components/Featured"

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
                                            {comment}
                                            <SocialShare />
                                        </div>
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