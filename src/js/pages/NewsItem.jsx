import React from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import Comments from "../elements/Comments"
import { displayTime } from "../lib/DateTime"
import moment from "moment"

class NewsItem extends React.Component {
    render() {
        let title = this.props.data.node ? this.props.data.node.title : "";
        let description = this.props.data.node ? this.props.data.node.description : "";
        let timeCreated = this.props.data.node ? moment(this.props.data.node.timeCreated).format("LLL") : "";

        return (
            <section className="section">
                <div className="container">
                    <div className="row">
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
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

const WithQuery = gql`
    query WithQuery($guid: String!) {
        node(guid: $guid) {
            title
            description
            timeCreated
            comments {
                description
                owner {
                    name
                }
            }
        }
    }
`;

export default graphql(WithQuery, {
    options: (ownProps) => {
        return {
            variables: {
                guid: ownProps.params.guid
            }
        }
    }
})(NewsItem);