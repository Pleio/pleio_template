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
import NotFound from "../core/NotFound"
import showDate from "../lib/showDate"
import RichTextView from "../core/components/RichTextView"
import LikeAndBookmark from "../core/components/LikeAndBookmark"
import Document from "../core/components/Document"

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
        let edit, featuredImage, source

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
                    <div className="button__text article-action ___edit-post" onClick={this.onEdit}>
                        Bewerken
                    </div>
                </div>
            )
        }

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

        if (entity.source) {
            source = (
                <div className="article-meta__source">
                    Bron:&nbsp;<a href="#">{entity.source}</a>
                </div>
            )
        }

        return (
            <div>
                <Document title={entity.title} />
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
                                    <RichTextView richValue={entity.richDescription} value={entity.description} />
                                    <LikeAndBookmark like={false} bookmark={true} viewer={viewer} entity={entity} />
                                    <div className="article-actions">
                                        <SocialShare />
                                        {edit}
                                    </div>
                                </article>
                                <EditModal title="Nieuws wijzigen" entity={entity} subtype="news" featuredImage={true} />
                                <DeleteModal title="Nieuws verwijderen" entity={entity} subtype="news" refetchQueries={["InfiniteList"]} />
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
                featuredImage
                canEdit
                tags
                isBookmarked
                canBookmark
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