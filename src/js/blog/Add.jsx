import React from "react"
import AddCore from "../core/Add"
import ActionContainer from "../core/components/ActionContainer"

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
        this.props.history.push(`${this.getRootURL()}/blog`)
    }

    afterAdd() {
        window.location.href = `${this.getRootURL()}/blog`
    }

    render() {
        const { match } = this.props

        return (
            <ActionContainer title="Maak een blog" onClose={this.onClose}>
                <AddCore ref="add" subtype="blog" featured={true} afterAdd={this.afterAdd} containerGuid={match.params.groupGuid} />
            </ActionContainer>
        )
    }
}