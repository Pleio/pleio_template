import React from "react"
import ContentHeader from "../core/components/ContentHeader"
import UsersOnline from "../core/containers/UsersOnline"
import TopicCard from "./containers/TopicCard"
import Add from "../core/Add"
import Document from "../core/components/Document"
import { Link } from "react-router-dom"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

class Index extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            q: ""
        }

        this.onChange = (e) => this.setState({q: e.target.value})
        this.onSubmit = this.onSubmit.bind(this)
    }

    onSubmit(e) {
        e.preventDefault()
        this.props.history.push(`/search?q=${this.state.q}&type=object&subtype=question`)

        this.setState({
            q: ""
        })
    }

    render() {
        let { site, entities } = this.props.data
        let categories, categoriesSection

        if (site && site.filters && site.filters.length > 0) {
            categories = site.filters[site.filters.length - 1].values.map((tag, i) => (
                <TopicCard key={i} title={tag} tags={[tag]} />                
            ))

            categoriesSection = (
                <section className="section ___grey ___grow">
                    <div className="container">
                        <h3 className="section__title">Categorieën</h3>
                        <div className="row">
                            {categories}
                        </div>
                    </div>
                </section>
            )
        }

        let addQuestion
        if (entities && entities.canWrite) {
            addQuestion = (
                <div>
                    <span className="forum__search-separate">of</span>
                    <Link to="/questions/add">
                        <button className="button ___large forum__ask-a-question">
                            Stel een vraag
                        </button>
                    </Link>
                </div>
            )
        }

        return (
            <div className="page-container">
                <Document title="Forum" />
                <div className="lead ___forum">
                    <div style={{backgroundImage: "url(/mod/pleio_template/src/images/lead-forum.jpg)"}} className="lead__background"></div>
                    <div className="container">
                        <div className="forum__header">
                            <div className="forum__search-top">
                                <h3 className="main__title">Forum</h3>
                                <UsersOnline />
                            </div>
                            <div className="forum__search">
                                <form onSubmit={this.onSubmit} className="forum__search-form">
                                <div className="search-bar">
                                    <input name="q" onChange={this.onChange} placeholder="Zoeken binnen het forum" value={this.state.q} />
                                    <div className="search-bar__button"></div>
                                </div>
                                </form>{addQuestion}
                            </div>
                        </div>
                    </div>
                </div>

                <section className="section">
                    <div className="container">
                        <div className="row">
                            <TopicCard title="Recente vragen" tags={[]} />
                            <TopicCard title="Populaire vragen" tags={[]} />
                        </div>
                    </div>
                </section>

                {categoriesSection}
            </div>
        )
    }
}

const Query = gql`
    query QuestionIndex {
        entities(subtype:"question", offset: 0, limit: 1) {
            canWrite
        }
        site {
            guid
            filters {
                name
                values
            }
        }
    }
`;


export default graphql(Query)(Index)