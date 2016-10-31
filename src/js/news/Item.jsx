import React from "react"
import { graphql } from "react-apollo"
import { connect } from "react-redux"
import gql from "graphql-tag"
import CommentList from "../core/components/CommentList"
import EditModal from "../core/Edit"
import DeleteModal from "../core/Delete"
import { showModal } from "../lib/actions"
import AddComment from "../core/containers/AddComment"
import SocialShare from "../core/components/SocialShare"
import Bookmark from "../bookmarks/components/Bookmark"
import NotFound from "../core/NotFound"
import showDate from "../lib/showDate"

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

        let edit = ""
        if (entity.canEdit) {
            edit = (
                <div className="button__text article-action ___edit-post" onClick={this.onEdit}>
                    Bewerken
                </div>
            );
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

        let source
        if (entity.source) {
            source = (
                <div className="article-meta__source">
                    Bron:&nbsp;<a href="#">{entity.source}</a>
                </div>
            )
        }

        return (
            <div>
                {featuredImage}
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
                                    <div className="content" dangerouslySetInnerHTML={{__html: entity.description}} />
                                    <div className="article-actions">
                                        <SocialShare />
                                        <div className="article-actions__buttons">
                                            <div className="article-actions__justify">
                                                <div title="Schrijf een reactie" className="button article-action ___comment" onClick={this.toggleAddComment}>
                                                    Schrijf een reactie
                                                </div>
                                                {edit}
                                            </div>
                                            <Bookmark entity={entity} />
                                        </div>
                                    </div>
                                </article>
                                <AddComment viewer={viewer} isOpen={this.state.showAddComment} object={entity} onSuccess={this.closeAddComment} />
                                <CommentList comments={entity.comments} />
                                <EditModal title="Nieuws wijzigen" entity={entity} subtype="news" featuredImage={true} />
                                <DeleteModal title="Nieuws verwijderen" entity={entity} subtype="news" />
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}

const QUERY = gql`
    query NewsItem($guid: String!) {
        viewer {
            guid
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
                accessId
                timeCreated
                source
                isFeatured
                featuredImage
                canEdit
                tags
                isBookmarked
                comments {
                    guid
                    description
                    timeCreated
                    owner {
                        name
                        icon
                        url
                    }
                }
            }
        }
    }
`;

export default connect()(graphql(QUERY, {
    options: (ownProps) => {
        return {
            variables: {
                guid: ownProps.params.guid
            }
        }
    }
})(Item));