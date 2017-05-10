import React from "react"
import Form from "../../../core/components/Form"
import InputField from "../../../core/components/TextField"
import SelectField from "../../../core/components/SelectField"
import TagsField from "../../../core/components/TagsField"
import Accordeon from "../../../core/components/Accordeon"
import { Link } from "react-router-dom"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import { showShortDate } from "../../../lib/showDate"

class List extends React.Component {
    render() {
        const { entities } = this.props.data

        if (!entities) {
            return (
                <div></div>
            )
        }

        const items = entities.edges.map((entity, i) => {
            let comments
            if (entity.canComment) {
                comments = (
                    <div className="card-list-topics__comments">
                        {entity.commentCount}
                    </div>
                )
            }

            return (
                <Link key={i} to={entity.url} className="card-list-topics__item">
                    <div className="card-list-topics__date">
                        {showShortDate(entity.timeCreated)}
                    </div>
                    <div className="card-list-topics__post">
                        {entity.title}
                    </div>
                    {comments}
                </Link>
            )
        })

        return (
            <Accordeon title={this.props.title} className="card-list-topics">
                {items}
            </Accordeon>
        )
    }
}


const Query = gql`
    query WidgetObjects($subtype: String!, $tags: [String!]) {
        entities(subtype: $subtype, offset: 0, limit: 5, tags: $tags) {
            edges {
                guid
                ... on Object {
                    title
                    timeCreated
                    canComment
                    commentCount
                    url
                }
            }
        }
    }
`;

const ListWithQuery = graphql(Query)(List)

class Objects extends React.Component {
    constructor(props) {
        super(props)
        this.getSetting = this.getSetting.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    getSetting(key, defaultValue) {
        const { entity } = this.props

        let value = defaultValue || ""
        entity.settings.forEach((setting) => {
            if (setting.key === key) {
                value = setting.value
            }
        })

        return value
    }

    onSubmit(e) {
        const { entity } = this.props

        const values = this.refs.form.getValues()

        this.props.mutate({
            variables: {
                input: {
                    clientMutationId: "1",
                    guid: entity.guid,
                    row: 1,
                    col: 1,
                    settings: [
                        { key: "title", "value": values.title },
                        { key: "subtype", "value": values.subtype },
                        { key: "tag", "value": values.tags.join(",") }
                    ]
                }
            }
        }).then(({data}) => {
            this.props.toggleEdit()
        })
    }

    render() {
        const { entity, isEditing } = this.props

        if (isEditing) {
            return (
                <Form ref="form" onSubmit={this.onSubmit} className="form">
                    <div className="card-list-topics">
                        <InputField type="text" label="Titel" className="form__input" name="title" value={this.getSetting("title")} />
                        <SelectField label="Type" className="form__input" name="subtype" options={{"all":"Alles", "question": "Vraag", "news": "Nieuws", "blog": "Blog", "event": "Agenda"}}value={this.getSetting("subtype")} />
                        <TagsField label="Steekwoorden (tags) toevoegen" name="tags" type="text" className="form__input" value={this.getSetting("tag") ? this.getSetting("tag").split(",") : []} />
                        <div className="buttons ___space-between">
                            <button className="button" type="submit">
                                Opslaan
                            </button>
                        </div>
                    </div>
                </Form>
            )
        }

        return (
            <ListWithQuery title={this.getSetting("title")} subtype={this.getSetting("subtype") !== "all" ? this.getSetting("subtype") : ""} tags={this.getSetting("tag") ? this.getSetting("tag").split(",") : []} />
        )
    }
}

const Mutation = gql`
    mutation editWidget($input: editWidgetInput!) {
        editWidget(input: $input) {
            entity {
                guid
                ... on Widget {
                    settings {
                        key
                        value
                    }
                }
            }
        }
    }
`

export default graphql(Mutation)(Objects)