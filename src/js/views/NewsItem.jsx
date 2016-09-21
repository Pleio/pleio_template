import React from "react"
import { graphql } from "react-apollo"
import { connect } from "react-redux"
import gql from "graphql-tag"
import Comments from "../components/Comments"
import EditModal from "../views/EditModal"
import DeleteModal from "../views/DeleteModal"
import moment from "moment"
import { showModal } from "../lib/actions"

class NewsItem extends React.Component {
    constructor(props) {
        super(props)

        this.onEdit = () => this.props.dispatch(showModal("edit"))
        this.onDelete = () => this.props.dispatch(showModal("delete"))
    }

    render() {
        let title = this.props.data.object ? this.props.data.object.title : "";
        let description = this.props.data.object ? this.props.data.object.description : "";
        let timeCreated = this.props.data.object ? moment(this.props.data.object.timeCreated).format("LLL") : "";
        let canEdit = this.props.data.object ? this.props.data.object.canEdit : false;

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
                                    <div className="article-meta__date">{timeCreated}</div>
                                    <div className="article-meta__source">Bron:&nbsp;<a href="#">Ministerie van Onderwijs, Cultuur en Wetenschap</a></div>
                                </div>
                                <div className="content">
                                    {description}
                                </div>
                                <div className="article-actions">
                                    <div className="article-actions__share">
                                        <div title="Deel" data-toggle-share className="button article-action ___share"><span>Deel</span></div>
                                        <div data-toggle-share-target className="article-share">
                                            <div className="button__share ___twitter"></div>
                                            <div className="button__share ___facebook"></div>
                                            <div className="button__share ___google"></div>
                                            <div className="button__share ___linkedin"></div>
                                            <div className="button__share ___mail"></div>
                                        </div>
                                    </div>
                                    <div className="article-actions__justify">
                                        <div title="Schrijf een reactie" data-comment-add-toggle className="button article-action ___comment">Schrijf een reactie
                                        </div>
                                        <div title="Bewaar" data-toggle-bookmark className="button__text article-action ___bookmark"><span className="___saved">Bewaard</span><span className="___save">Bewaren</span></div>
                                    </div>
                                </div>
                            </article>
                            <Comments />
                            <EditModal title="Nieuws wijzigen" object={this.props.data.object} />
                            <DeleteModal title="Nieuws verwijderen" object={this.props.data.object} />
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

const WithQuery = gql`
    query WithQuery($guid: String!) {
        object(guid: $guid) {
            guid
            title
            description
            accessId
            timeCreated
            canEdit
            tags
            comments {
                description
                owner {
                    name
                }
            }
        }
    }
`;

export default connect()(graphql(WithQuery, {
    options: (ownProps) => {
        return {
            variables: {
                guid: ownProps.params.guid
            }
        }
    }
})(NewsItem));