import React from "react"
import Accordeon from "../../core/components/Accordeon"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import classnames from "classnames"
import { Link } from "react-router-dom"

class Trending extends React.Component {
    render() {
        const { trending } = this.props.data

        if (!trending || trending.length == 0) {
            return (
                <div></div>
            )
        }

        const items = trending.map((item, i) => (
            <Link key={i} to={`/trending/${item.tag}`} className="card-list-trending__item">
                <div className="card-list-trending__category">
                    {item.tag}
                </div>
                <div className="card-list-trending__likes">
                    {item.likes}
                </div>
            </Link>
        ))

        return (
            <div className={classnames({"col-sm-6 col-lg-12": true, "show-md": this.props.showmd})}>
                <Accordeon title="Trending" className="card-list-trending">
                    {items}
                </Accordeon>
            </div>
        )
    }
}

const Query = gql`
    query Trending {
        trending {
            tag
            likes
        }
    }
`

const withQuery = graphql(Query)
export default withQuery(Trending)