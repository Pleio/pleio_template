import React from "react"
import { connect } from "react-redux"
import { showModal } from "../lib/actions"
import ContentHeader from "../core/components/ContentHeader"
import ContentFilters from "../core/containers/ContentFilters"
import InfiniteList from "../core/containers/InfiniteList"
import AddButton from "../core/containers/AddButton"
import Card from "./components/Card"
import Add from "../core/Add"

class List extends React.Component {
    constructor(props) {
        super(props)

        this.onChangeFilter = (tags) => this.setState({ tags })
        this.onClickAdd = (e) => this.props.dispatch(showModal('add'))

        this.state = {
            tags: []
        }
    }

    render() {
        return (
            <div className="page-layout">
                <ContentHeader>
                    <h3 className="main__title">
                        Forum
                    </h3>
                    <ContentFilters onClickAdd={this.onClickAdd} onChange={this.onChangeFilter} value={this.state.tags}>
                        <AddButton subtype="news" onClick={this.onClickAdd} />
                    </ContentFilters>
                </ContentHeader>
                <section className="section ___grey ___grow">
                    <InfiniteList childClass={Card} subtype="question" offset={0} limit={20} tags={this.state.tags} />
                </section>
                <Add title="Stel een vraag" subtype="question" refetchQueries={["InfiniteList", "QuestionTopicCard"]} />
            </div>
        )
    }
}

export default connect()(List)