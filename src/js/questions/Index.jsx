import React from "react"
import { connect } from "react-redux"
import { showModal } from "../lib/actions"
import ContentHeader from "../core/components/ContentHeader"
import UsersOnline from "../core/containers/UsersOnline"
import { sectorOptions, categoryOptions } from "../lib/filters"
import TopicCard from "./containers/TopicCard"
import Add from "../core/Add"

class Index extends React.Component {
    constructor(props) {
        super(props)
        this.onClickAdd = (e) => this.props.dispatch(showModal("add"))
    }

    render() {
        const categories = Object.keys(categoryOptions).map((key, i) => (
                <TopicCard key={i} title={categoryOptions[key]} tags={[key]} />
            )
        )

        return (
            <div className="page-layout">
                <div className="lead ___forum">
                    <div style={{backgroundImage: "url(/mod/pleio_template/src/images/lead-forum.jpg)"}} className="lead__background"></div>
                    <div className="container">
                        <div className="forum__header">
                            <div className="forum__search-top">
                                <h3 className="main__title">Forum</h3>
                                <UsersOnline />
                            </div>
                            <div className="forum__search">
                                <form action="zoekresultaten-forum.html" className="forum__search-form">
                                <div className="search-bar">
                                    <input placeholder="Zoeken binnen het forum" />
                                    <div className="search-bar__button"></div>
                                </div>
                                </form><span className="forum__search-separate">of</span>
                                <button className="button ___large forum__ask-a-question" onClick={this.onClickAdd}>
                                    Een vraag stellen
                                </button>
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

export default connect()(Index)