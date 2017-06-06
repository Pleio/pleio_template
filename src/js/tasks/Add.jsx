import React from "react"
import AddCore from "../core/Add"
import Modal from "../core/components/Modal"

export default class Add extends React.Component {
    constructor(props) {
        super(props)
        this.onClose = this.onClose.bind(this)
        this.afterAdd = this.afterAdd.bind(this)
    }

    getRootURL() {
        const { match } = this.props

        if (match.params.groupGuid && match.params.groupSlug) {
            return `/groups/view/${match.params.groupGuid}/${match.params.groupSlug}`
        }

        return ""
    }

    onClose() {
        this.props.history.push(`${this.getRootURL()}/tasks`)
    }

    afterAdd() {
        window.location.href = `${this.getRootURL()}/tasks`
    }

    render() {
        const { match } = this.props
        
        return (
            <Modal title="Voeg een taak toe" full={true} noParent={true} onClose={this.onClose}>
                <AddCore ref="add" subtype="task" afterAdd={this.afterAdd} containerGuid={match.params.groupGuid} />
            </Modal>
        )
    }
}