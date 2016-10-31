import React from "react"
import { Link } from "react-router"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import { showShortDate } from "../../lib/showDate"
import Card from "../../activity/components/Card"
import Header from "../components/Header"

class ResultList extends React.Component {

    generateLink(item) {
        switch (item.subtype) {
            case "blog":
                return `/blog/${item.guid}`
            case "news":
                return `/news/${item.guid}`
            case "question":
                return `/questions/${item.guid}`
        }
    }

    render() {
        const { search } = this.props.data

        if (!search) {
            return (
                <div></div>
            )
        }

        let results

        if (search.results) {
            results = search.results.map((entity, i) => (
                <Card key={i} entity={{object: entity}} />
            ))
        }

        return (
            <div className="page-layout">
                <Header q={this.props.q} type={this.props.type} subtype={this.props.subtype} totals={search.totals} />
                <section className="section ___grey ___grow">
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-12 col-lg-8">
                                {results}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}

const Query = gql`
    query ResultList($q: String!, $type: Type, $subtype: String, $offset: Int, $limit: Int) {
        search(q: $q, offset: $offset, limit: $limit, type: $type, subtype: $subtype) {
            totals {
                subtype
                total
            }
            results {
                guid
                ... on Object {
                    guid
                    title
                    url
                    featuredImage
                    subtype
                    tags
                    timeCreated
                    isBookmarked
                    commentCount
                    hasVoted
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
`;

export default graphql(Query)(ResultList);