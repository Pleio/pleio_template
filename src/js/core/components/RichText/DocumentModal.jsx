import React from "react"
import classnames from "classnames"
import { graphql } from "react-apollo"
import { withRouter } from "react-router-dom"
import autobind from "autobind-decorator"
import gql from "graphql-tag"
import AddDocument from "./AddDocument"
import Tabber from "../Tabber"
import FolderField from "../../../files/components/FolderField"

class DocumentSelect extends React.Component {
    @autobind
    onAddDocument(name, data) {
        this.props.onSubmit(name, data)
        this.props.toggle()
    }

    @autobind
    onSelectDocument(e) {
        const data = this.refs.folderField.getRichValue()
        this.props.onSubmit(data.name, data)
        this.props.toggle()
    }

    render() {
        const { match } = this.props

        const addDocument = (
            <div className="form">
                <AddDocument onSubmit={this.onAddDocument} />
            </div>
        )

        if (match.params.groupGuid) {
            const selectDocument = (
                <div className="form">
                    <div style={{maxHeight:"20em", overflow:"scroll"}}>
                        <FolderField ref="folderField" containerGuid={match.params.groupGuid} showFiles />
                    </div>
                    <div className="buttons ___end">
                        <div className="button" onClick={this.onSelectDocument}>Invoegen</div>
                    </div>
                </div>
            )

            const items = [
                {title: "Uploaden", content: addDocument},
                {title: "Selecteren", content: selectDocument}
            ]

            return (
                <div className="form">
                    <Tabber items={items} />
                </div>
            )
        } else {
            return addDocument
        }
    }
}

const DocumentSelectWithRouter = withRouter(DocumentSelect)

export default class DocumentModal extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isOpen: false
        }
    }

    @autobind
    toggle() {
        this.setState({ isOpen: !this.state.isOpen })
    }

    render() {
        return (
            <div tabIndex="0" className={classnames({"modal ___small ___middle": true, "___is-open": this.state.isOpen})}>
                <div className="modal__wrapper">
                    <div className="modal__background" onClick={this.toggle}></div>
                    <div className="modal__box">
                        <div className="modal__close" onClick={this.toggle}></div>
                        <h3 className="modal__title">Document(en) invoegen</h3>
                        <DocumentSelectWithRouter {...this.props} toggle={this.toggle} />
                    </div>
                </div>
            </div>
        )
    }
}
