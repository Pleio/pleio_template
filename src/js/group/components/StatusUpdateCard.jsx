import React from "react"
import { Link } from "react-router-dom"
import { getClassFromTags } from "../../lib/helpers"
import { logErrors } from "../../lib/helpers"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import { convertToRaw } from "draft-js"
import classnames from "classnames"
import showDate from "../../lib/showDate"
import Likes from "../../core/components/Likes"
import Form from "../../core/components/Form"
import DeleteModal from "../../core/Delete"
import Bookmark from "../../bookmarks/components/Bookmark"
import Errors from "../../core/components/Errors"
import { displayTags } from "../../lib/helpers"
import RichTextView from "../../core/components/RichTextView"
import RichTextField from "../../core/components/RichTextField"
import autobind from "autobind-decorator"

class StatusUpdateCard extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isEditing: false,
            errors: []
        }
    }

    @autobind
    toggleEdit(e) {
        this.setState({ isEditing: !this.state.isEditing })
    }

    @autobind
    onEdit(e) {
        const { entity } = this.props

        this.setState({
            errors: []
        })

        let values = this.refs.form.getValues()

        this.props.mutate({
            variables: {
                input: {
                    clientMutationId: 1,
                    guid: entity.guid,
                    description: values.description.getPlainText(),
                    richDescription: JSON.stringify(convertToRaw(values.description))
                }
            }
        }).then(({ data }) => {
            this.setState({
                isEditing: false
            })
        }).catch((errors) => {
            logErrors(errors)
            this.setState({
                errors: errors
            })
        })
    }

    @autobind
    onDelete(e) {
        e.preventDefault()
        this.refs.deleteModal.toggle()
    }

    afterDelete() {
        location.reload()
    }

    render() {
        const { entity, group } = this.props
        const { owner } = entity

        let ownerLink
        if (group) {
            ownerLink = (
                <span>
                    <Link to={owner.url} className="card-blog-post__user">
                        {owner.name}
                    </Link>
                    &nbsp;in <Link to={group.url}>{group.name}</Link>
                </span>
            )
        } else {
            ownerLink = (
                <span>
                    <Link to={owner.url} className="card-blog-post__user">
                        {owner.name}
                    </Link>
                </span>
            )
        }

        let content, editButton
        if (this.state.isEditing) {
            content = (
                <div className="form">
                    <Errors errors={this.state.errors} />
                    <Form ref="form" onSubmit={this.onEdit}>
                        <RichTextField name="description" richValue={entity.richDescription} value={entity.description} minimal />
                        <div className="flexer ___end ___gutter">
                            <button className="button" type="submit">Opslaan</button>
                            <button className="button ___link" onClick={this.onDelete}>Verwijderen</button>
                        </div>
                    </Form>
                    <DeleteModal ref="deleteModal" entity={entity} afterDelete={this.afterDelete} />
                </div>
            )
        } else {
            editButton = (
                <div className="card-edit" onClick={(e) => this.toggleEdit()}><span>Wijzig</span></div>
            )
            content = (
                <RichTextView richValue={entity.richDescription} value={entity.description} />
            )
        }

        return (
            <div className={classnames({"card-blog-post": true, "___can-edit": entity.canEdit})}>
                <a name={entity.guid}></a>
                <Link to={owner.url} title={owner.name} style={{backgroundImage: `url(${owner.icon})`}} className="card-blog-post__picture" />
                <div className="card-blog-post__post">
                    <div className="card-blog-post__meta">
                        <div className="comment__justify">
                            {ownerLink}
                            {editButton}
                        </div>
                        <div className="card-blog-post__date">
                            {showDate(entity.timeCreated)}
                        </div>
                    </div>

                    <div className="card__content">
                        {content}
                    </div>
                </div>

                <div className="card-blog-post__actions">
                    <Likes entity={entity} />
                </div>
            </div>
       )
    }
}

const Mutation = gql`
    mutation StatusUpdateCard($input: editEntityInput!) {
        editEntity(input: $input) {
            entity {
                guid
                ... on Object {
                    title
                    description
                    richDescription
                    url
                    accessId
                    writeAccessId
                    source
                    isFeatured
                    isRecommended
                    featured {
                        image
                        video
                        positionY
                    }
                    startDate
                    endDate
                    tags
                }
            }
        }
    }
`

export default graphql(Mutation)(StatusUpdateCard)
