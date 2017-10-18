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
        this.onDeleteClick = this.onDeleteClick.bind(this)
    }

    onClose() {
        const { entity } = this.props.data
        this.props.history.push(entity.url)
    }

    afterEdit() {
        const { entity } = this.props.data
        window.location.href = entity.url
    }

    afterDelete() {
        window.location.href = '/cms'
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
            <Modal title="Pagina wijzigen" full={true} noParent={true} onClose={this.onClose}>
                <EditCore subtype="page" viewer={viewer} entity={entity} refetchQueries={["InfiniteList"]} afterEdit={this.afterEdit} onDeleteClick={this.onDeleteClick} />
                <DeleteCore title="Pagina verwijderen" ref="deleteModal" entity={entity} afterDelete={this.afterDelete} />
            </Modal>
        )
    }
}

const Query = gql`
    query EditPage($guid: String!) {
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
                url
                accessId
                timeCreated
                source
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