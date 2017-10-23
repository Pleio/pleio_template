import React from "react"
import { gql, graphql } from "react-apollo"
import autobind from "autobind-decorator"
import Delete from "../../core/Delete"
import Text from "./widgets/Text"
import HTML from "./widgets/HTML"

class Widget extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isEditing: false
        }
    }

    @autobind
    onEdit(e) {
        this.setState({ isEditing: true })
    }

    @autobind
    onSave(settings) {
        const { entity } = this.props

        this.props.mutate({
            variables: {
                input: {
                    clientMutationId: "1",
                    guid: entity.guid,
                    settings: settings
                }
            }
        })
    
        this.setState({ isEditing: false })
    }

    render() {
        const { entity } = this.props

        let widget
        switch (entity.type) {
            case "text":
                widget = (
                    <Text ref="widget" entity={entity} isEditing={this.state.isEditing} onSave={this.onSave} />
                )
                break;
            case "html":
                widget = (
                    <HTML ref="widget" entity={entity} isEditing={this.state.isEditing} onSave={this.onSave} />
                )
        }

        let settings
        if (this.state.isEditing) {
            settings = (
                <button className="___add" onClick={(e) => this.refs.widget.onSave()}></button>
            )
        } else {
            settings = (
                <button className="___settings" onClick={this.onEdit}></button>
            )
        }

        return (
            <div className={this.props.col} onBlur={this.onBlur}>
                <div className="cms-block ___is-filled">
                    {widget}
                    <div className="cms-overlay">
                        <div className="cms-overlay__actions">
                            <div className="cms-overlay__buttons">
                                {settings}
                                <button className="___delete" onClick={(e) => this.refs.delete.toggle()}></button>
                            </div>
                        </div>
                    </div>
                </div>
                <Delete ref="delete" entity={entity} refetchQueries={["PageItem"]} />
            </div>
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

export default graphql(Mutation)(Widget)