import React from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import CommentList from "../core/components/CommentList"
import Edit from "../core/Edit"
import Delete from "../core/Delete"
import AddComment from "../core/containers/AddComment"
import NotFound from "../core/NotFound"
import showDate from "../lib/showDate"
import { Link, withRouter } from "react-router-dom"
import LikeAndBookmark from "../core/components/LikeAndBookmark"
import RichTextView from "../core/components/RichTextView"
import Document from "../core/components/Document"
import SubNav from "./components/SubNav"

class Item extends React.Component {
    constructor(props) {
        super(props)

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
        const { match } = this.props

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
                <Link to={`${this.getRootURL()}/wiki/edit/${entity.guid}`}>
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
                        {edit}
                    </div>
                </div>
            )
        }

        let subNav
        if (entity.hasChildren || match.params.containerGuid) {
            subNav = (
                <div className="col-sm-4">
                    <SubNav containerGuid={match.params.containerGuid || match.params.guid} guid={match.params.containerGuid || match.params.guid} />
                </div>
            )
        }

        return (
            <div>
                <Document title={entity.title} />
                <section className="section">
                    <div className="container">
                        <div className="row">
                            {subNav}
                            <div className={entity.hasChildren || match.params.containerGuid ? "col-sm-8" : "col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2"}>
                                <article className="article">
                                    <h3 className="article__title">{entity.title}</h3>
                                    <RichTextView richValue={entity.richDescription} value={entity.description} />
                                    <div className="article-actions">
                                        {actions}
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
    query WikiItem($guid: Int!) {
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
                hasChildren
                featured {
                    image
                    video
                    positionY
                }
                isRecommended
                canEdit
                tags
                url
                isBookmarked
                canBookmark
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