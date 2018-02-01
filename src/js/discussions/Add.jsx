import React from "react"
import AddCore from "../core/Add"
import ActionContainer from "../core/components/ActionContainer"
import autobind from 'autobind-decorator'

export default class Add extends React.Component {
    constructor(props) {
        super(props)
    }

    getRootURL() {
        const { match } = this.props

        if (match.params.groupGuid && match.params.groupSlug) {
            return `/groups/view/${match.params.groupGuid}/${match.params.groupSlug}`
        }

        return ""
    }

    @autobind
    onClose() {
        this.props.history.push(`${this.getRootURL()}/discussion`)
    }

    @autobind
    afterAdd() {
        window.location.href = `${this.getRootURL()}/discussion`
    }

    render() {
        const { match } = this.props

        return (
            <ActionContainer title="Start een discussie" full noParent onClose={this.onClose}>
                <AddCore title="Start een discussie" subtype="discussion" afterAdd={this.afterAdd} containerGuid={match.params.groupGuid} />
            </ActionContainer>
        )
    }
}