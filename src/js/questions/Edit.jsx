import React from "react"
import NotFound from "../core/NotFound"
import EditCore from "../core/Edit"
import DeleteCore from "../core/Delete"
import Modal from "../core/components/Modal"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

class Edit extends React.Component {
    constructor(props) {
        super(props)

        this.onClose = this.onClose.bind(this)
        this.afterEdit = this.afterEdit.bind(this)
        this.afterDelete = this.afterDelete.bind(this)
        this.onDeleteClick = this.onDeleteClick.bind(this)
    }

    getRootURL() {
        const { match } = this.props

        if (match.params.groupGuid && match.params.groupSlug) {
            return `/groups/view/${match.params.groupGuid}/${match.params.groupSlug}`
        }

        return ""
    }

    onClose() {
        const { entity } = this.props.data
        this.props.history.push(`${this.getRootURL()}/questions/view/${entity.guid}/${entity.title}`)
    }

    afterEdit() {
        const { entity } = this.props.data
        window.location.href = `${this.getRootURL()}/questions/view/${entity.guid}/${entity.title}`
    }

    afterDelete() {
        window.location.href = `${this.getRootURL()}/questions`
    }

    onDeleteClick(e) {
        e.preventDefault()
        this.refs.deleteModal.toggle()
    }

    render() {
        let { entity, viewer } = this.props.data

        if (!entity) {
            return (
                <div />
            )
        }

        if (entity.status == 404) {
            return (
                <NotFound />
            )
        }

        return (
            <Modal title="Vraag wijzigen" full={true} noParent={true} onClose={this.onClose}>
                <EditCore subtype="question" viewer={viewer} entity={entity} afterEdit={this.afterEdit} onDeleteClick={this.onDeleteClick} />
                <DeleteCore title="Vraag verwijderen" ref="deleteModal" entity={entity} afterDelete={this.afterDelete} />
            </Modal>
        )
    }
}

const Query = gql`
    query EditQuestion($guid: String!) {
        viewer {
            guid
            loggedIn
            user {
                guid
                name
                icon
                url
            }
        }
        entity(guid: $guid) {
            guid
            status
            ... on Object {
                title
                description
                richDescription
                accessId
                timeCreated
                source
                url
                isFeatured
                featured {
                    image
                    video
                    positionY
                }
                canEdit
                tags
                isBookmarked
                canBookmark
            }
        }
    }
`

const Settings = {
    options: (ownProps) => {
        return {
            variables: {
                guid: ownProps.match.params.guid
            }
        }
    }
}

export default graphql(Query, Settings)(Edit)