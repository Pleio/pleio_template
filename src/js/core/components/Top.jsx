import React from "react"
import Accordeon from "./Accordeon"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import { Link } from "react-router"

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
                    <div className="card-list-bloggers__likes">{item.likes}</div>
                </div>
            </Link>
        ))

        return (
            <div className="col-sm-6 col-lg-12">
                <Accordeon title="Top bloggers" className="card-list-bloggers">
                    {items}
                </Accordeon>
            </div>
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