import React from "react"
import { Link } from "react-router-dom"
import ContentHeader from "../core/components/ContentHeader"
import ContentFilters from "../core/containers/ContentFilters"
import QuestionList from "./containers/QuestionList"
import Document from "../core/components/Document"
import Card from "./components/Card"

class List extends React.Component {
    constructor(props) {
        super(props)

        this.onChangeFilter = (tags) => this.setState({ tags })

        this.state = {
            tags: []
        }
    }

    render() {
        return (
            <div className="page-container">
                <Document title="Forum" />
                <ContentHeader>
                    <h3 className="main__title">
                        Forum
                    </h3>
                    <ContentFilters page="questions" onClickAdd={this.onClickAdd} onChange={this.onChangeFilter} value={this.state.tags} selectClassName="selector ___margin-bottom-mobile ___filter">
                        <Link to="/questions/add" className="right-lg">
                        </Link>
                    </ContentFilters>
                </ContentHeader>
                <section className="section ___grey ___grow">
                    <QuestionList childClass={Card} subtype="question" offset={0} limit={20} tags={this.state.tags} />
                </section>
            </div>
        )
    }
}

export default List