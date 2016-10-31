import React from "react"
import { connect } from "react-redux"
import { showModal } from "../lib/actions"

import ContentHeader from "../core/components/ContentHeader"
import InfiniteList from "../core/containers/InfiniteList"
import Card from "./components/Card"
import ContentFilters from "../core/containers/ContentFilters"
import AddButton from "../core/containers/AddButton"
import Add from "../core/Add"

class List extends React.Component {
    constructor(props) {
        super(props)

        this.onChangeCanWrite = (canWrite) => this.setState({canWrite})
        this.onChangeFilter = (tags) => this.setState({ tags })
        this.onClickAdd = (e) => this.props.dispatch(showModal("add"))

        this.state = {
            tags: []
        }
    }

    render() {
        return (
            <div className="page-layout">
                <ContentHeader>
                    <h3 className="main__title">
                        Blog
                    </h3>
                    <ContentFilters onClickAdd={this.onClickAdd} onChange={this.onChangeFilter} value={this.state.tags}>
                        <AddButton subtype="blog" onClick={this.onClickAdd} />
                    </ContentFilters>
                </ContentHeader>
                <section className="section ___grey ___grow">
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-12 col-lg-8">
                                <InfiniteList childClass={Card} subtype="blog" offset={0} limit={20} tags={this.state.tags} />
                            </div>
                        </div>
                    </div>
                </section>
                <Add title="Blog toevoegen" subtype="blog" featuredImage={true} />
            </div>
        )
    }
}

export default connect()(List)