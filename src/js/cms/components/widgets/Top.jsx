import React from "react"
import Accordeon from "../../../core/components/Accordeon"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import { Link } from "react-router-dom"

class Top extends React.Component {
    render() {
        const { top } = this.props.data

        if (!top || top.length == 0) {
            return (
                <div></div>
            )
        }

        const items = top.map((item, i) => (
            <Link key={i} to={item.user.url} className="card-list-bloggers__item">
                <div style={{backgroundImage: "url(" + item.user.icon + ")"}} className="card-list-bloggers__picture" />
                <div>
                    <div className="card-list-bloggers__name">{item.user.name}</div>
                </div>
            </Link>
        ))

        return (
            <Accordeon title="Top bloggers" className="card-list-bloggers">
                {items}
            </Accordeon>
        )
    }
}

const Query = gql`
    query Top {
        top {
            user {
                guid
                username
                url
                name
                icon
            }
            likes
        }
    }
`

const withQuery = graphql(Query)
export default withQuery(Top)