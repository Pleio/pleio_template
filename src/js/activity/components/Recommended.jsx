import React from "react"
import classnames from "classnames"
import Accordeon from "../../core/components/Accordeon"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import { Link } from "react-router"

class Recommended extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isOpen: false
        }

        this.toggleOpen = (e) => this.setState({isOpen: !this.state.isOpen})
        this.calculateHeight = this.calculateHeight.bind(this)
    }

    calculateHeight() {
        if (this.state.isOpen) {
            return this.refs["recommendedItems"].firstChild.offsetHeight;
        }

        return 0
    }

    render() {
        const { recommended } = this.props.data

        if (!recommended) {
            return (
                <div></div>
            )
        }

        const items = recommended.entities.map((entity, i) => (
            <Link key={i} to={entity.url} className="card-list-recommended__item">
                <div style={{backgroundImage: "url(" + entity.owner.icon + ")"}} className="card-list-recommended__picture" />
                <div className="card-list-recommended__justify">
                    <div className="card-list-recommended__article">{entity.title}</div>
                    <div className="card-list-recommended__name">{entity.owner.name}</div>
                </div>
            </Link>
        ))

        return (
            <div className="col-sm-6 col-lg-12">
                <Accordeon title="Aanbevolen" className="card-list-recommended">
                    {items}
                </Accordeon>
            </div>
        )
    }
}

const Query = gql`
    query Recommended {
        recommended(limit:3) {
            total
            entities {
                guid
                ... on Object {
                    title
                    subtype
                    url
                    owner {
                        guid
                        name
                        icon
                    }
                }
            }
        }
    }
`

const withQuery = graphql(Query)
export default withQuery(Recommended)