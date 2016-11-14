import React from "react"
import { connect } from "react-redux"
import { showModal } from "../lib/actions"
import ContentHeader from "../core/components/ContentHeader"
import UsersOnline from "../core/containers/UsersOnline"
import { sectorOptions, categoryOptions } from "../lib/filters"
import TopicCard from "./containers/TopicCard"
import Add from "../core/Add"
import Document from "../core/components/Document"
import { browserHistory } from "react-router"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

class Index extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            q: ""
        }

        this.onChange = (e) => this.setState({q: e.target.value})
        this.onClickAdd = (e) => this.props.dispatch(showModal("add"))
        this.onSubmit = this.onSubmit.bind(this)
    }

    onSubmit(e) {
        e.preventDefault()
        browserHistory.push(`/search?q=${this.state.q}&subtype=question`)

        this.setState({
            q: ""
        })
    }

    render() {
        let { entities } = this.props.data

        const categories = Object.keys(categoryOptions).map((key, i) => (
                <TopicCard key={i} title={categoryOptions[key]} tags={[key]} />
            )
        )

        let addQuestion
        if (entities && entities.canWrite) {
            addQuestion = (
                <div>
                    <span className="forum__search-separate">of</span>
                    <button className="button ___large forum__ask-a-question" onClick={this.onClickAdd}>
                        Een vraag stellen
                    </button>
                </div>
            )
        }

        return (
            <div className="page-layout">
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

                <section className="section ___grey ___grow">
                    <div className="container">
                        <h3 className="section__title">Categorieën</h3>
                        <div className="row">
                            {categories}
                        </div>
                    </div>
                </section>
                <Add title="Stel een vraag" subtype="question" refetchQueries={["InfiniteList", "QuestionTopicCard"]} />
            </div>
        )
    }
}

const Query = gql`
    query QuestionIndex {
        entities(subtype:"question", offset: 0, limit: 1) {
            canWrite
        }
    }
`;


const withQuery = graphql(Query)
export default connect()(withQuery(Index))