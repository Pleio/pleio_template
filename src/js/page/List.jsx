import React from "react"
import { connect } from "react-redux"
import { showModal } from "../lib/actions"
import ContentHeader from "../core/components/ContentHeader"
import InfiniteList from "../core/containers/InfiniteList"
import Card from "./components/Card"
import ContentFilters from "../core/containers/ContentFilters"
import AddButton from "../core/containers/AddButton"
import Add from "../core/Add"
import Document from "../core/components/Document"

class List extends React.Component {
    constructor(props) {
        super(props)

        this.onChangeCanWrite = (canWrite) => this.setState({canWrite})
        this.onChangeFilter = (tags) => this.setState({ tags })
        this.onClickAdd = (e) => this.props.dispatch(showModal('add'))

        this.state = {
            tags: []
        }
    }

    render() {
        return (
            <div className="page-container">
                <Document title="Pagina's" />
                <ContentHeader>
                    <h3 className="main__title">
                        Pagina's
                    </h3>
                    <ContentFilters page="news" onClickAdd={this.onClickAdd} onChange={this.onChangeFilter} value={this.state.tags}>
                        <AddButton subtype="news" onClick={this.onClickAdd} />
                    </ContentFilters>
                </ContentHeader>
                <section className="section ___grey ___grow">
                    <InfiniteList childClass={Card} subtype="page" offset={0} limit={20} tags={this.state.tags} />
                </section>
                <Add title="Pagina toevoegen" subtype="page" featuredImage={true} refetchQueries={["InfiniteList"]} />
            </div>
        )
    }
}

export default connect()(List)