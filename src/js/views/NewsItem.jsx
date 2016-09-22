import React from "react"
import { graphql } from "react-apollo"
import { connect } from "react-redux"
import gql from "graphql-tag"
import CommentList from "../components/CommentList"
import EditModal from "../views/EditModal"
import DeleteModal from "../views/DeleteModal"
import moment from "moment"
import { showModal } from "../lib/actions"
import AddComment from "../containers/AddComment"
import SocialShare from "../components/SocialShare"
import Bookmark from "../components/Bookmark"
import NotFound from "./NotFound"

class NewsItem extends React.Component {
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
        if (this.props.data.error) {
            return (
                <NotFound />
            )
        }

        let title = this.props.data.entity ? this.props.data.entity.title : "";
        let description = this.props.data.entity ? this.props.data.entity.description : "";
        let timeCreated = this.props.data.entity ? moment(this.props.data.entity.timeCreated).format("LLL") : "";
        let canEdit = this.props.data.entity ? this.props.data.entity.canEdit : false;
        let comments = this.props.data.entity ? this.props.data.entity.comments : [];

        let manage = ""
        if (canEdit) {
            manage = (
                <div className="col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2 end-lg">
                    <div className="button" onClick={this.onEdit}>
                        <span>Wijzigen</span>
                    </div>
                    <div className="button" onClick={this.onDelete}>
                        <span>Verwijderen</span>
                    </div>
                </div>
            );
        }

        return (
            <section className="section">
                <div className="container">
                    <div className="row">
                        {manage}
                        <div className="col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2">
                            <article className="article">
                                <h3 className="article__title">{title}</h3>
                                <div className="article-meta">
                                    <div className="article-meta__date">
                                        {timeCreated}
                                    </div>
                                    <div className="article-meta__source">
                                        Bron:&nbsp;<a href="#">Ministerie van Onderwijs, Cultuur en Wetenschap</a>
                                    </div>
                                </div>
                                <div className="content" dangerouslySetInnerHTML={{__html: description}} />
                                <div className="article-actions">
                                    <SocialShare />
                                    <div className="article-actions__justify">
                                        <div title="Schrijf een reactie" className="button article-action ___comment" onClick={this.toggleAddComment}>
                                            Schrijf een reactie
                                        </div>
                                        <Bookmark />
                                    </div>
                                </div>
                            </article>
                            <AddComment isOpen={this.state.showAddComment} object={this.props.data.entity} onSuccess={this.closeAddComment} />
                            <CommentList comments={comments} />
                            <EditModal title="Nieuws wijzigen" object={this.props.data.entity} />
                            <DeleteModal title="Nieuws verwijderen" object={this.props.data.entity} />
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

const QUERY = gql`
    query NewsItem($guid: String!) {
        entity(guid: $guid) {
            ...newsFragment
        }
    }

    fragment newsFragment on Object {
        guid
        title
        description
        accessId
        timeCreated
        canEdit
        tags
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
`;

export default connect()(graphql(QUERY, {
    options: (ownProps) => {
        return {
            variables: {
                guid: ownProps.params.guid
            }
        }
    }
})(NewsItem));