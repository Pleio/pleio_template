import React from "react"
import { Link } from "react-router-dom"
import { graphql, gql } from "react-apollo"
import ContentHeader from "../core/components/ContentHeader"
import PageList from "./containers/PageList"
import Card from "./components/Card"
import ContentFilters from "../core/containers/ContentFilters"
import Document from "../core/components/Document"

class List extends React.Component {
    constructor(props) {
        super(props)

        this.onChangeCanWrite = (canWrite) => this.setState({canWrite})
        this.onChangeFilter = (tags) => this.setState({ tags })

        this.state = {
            tags: []
        }
    }

    render() {
        const { viewer } = this.props.data

        let add
        if (viewer && viewer.canWriteToContainer) {
            add = (
                <Link to={`/cms/add`} className="right-lg">
                    <div className="button ___large ___add"><span>Pagina toevoegen</span></div>
                </Link>
            )
        }

        return (
            <div>
                <Document title="Pagina's" />
                <ContentHeader>
                    <div className="row">
                        <div className="col-sm-6">
                            <h3 className="main__title">Pagina's</h3>
                        </div>
                        <div className="col-sm-6 end-sm">
                            {add}
                        </div>
                    </div>
                </ContentHeader>
                <section className="section ___grey ___grow">
                    <PageList childClass={Card} subtype="page" offset={0} limit={20} tags={this.state.tags} />
                </section>
            </div>
        )
    }
}

const Query = gql`
    query PageList {
        viewer {
            guid
            loggedIn
            canWriteToContainer(type: object, subtype: "page")
        }
    }
`

export default graphql(Query)(List)