import React from "react"
import { gql, graphql } from "react-apollo"
import autobind from "autobind-decorator"
import classnames from "classnames"
import Select from "../../core/components/NewSelect"
import Delete from "../../core/Delete"

import Text from "./widgets/Text"
import HTML from "./widgets/HTML"
import Leader from "./widgets/Leader"
import Lead from "./widgets/Lead"
import Activity from "./widgets/Activity"
import Events from "./widgets/Events"
import Cards from "./widgets/Cards"

const translate = {
    "text": "Tekst",
    "html": "Code",
    "other": "Anders"
}

const otherWidgets = {
    activity: "Activiteiten",
    leader: "Leader",
    lead: "Lead",
    events: "Agenda",
    // cards: "Kaarten"
}

class Widget extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isEditing: false,
            isSelectingType: false
        }
    }

    @autobind
    addWidget(index, option) {
        if (option === "other") {
            this.setState({ isSelectingType: true })
            return
        }

        this.setState({ isSelectingType: false })
        this.props.addWidget(index, option)
    }

    @autobind
    onEdit(e) {
        this.setState({ isEditing: true })
    }

    @autobind
    onSelectType(e) {
        this.setState({ isSelectingType: true })
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
        const { container, entity } = this.props

        let widget

        if (entity) {
            switch (entity.type) {
                case "text":
                    widget = (
                        <Text ref="widget" entity={entity} isEditing={this.state.isEditing} onSave={this.onSave} />
                    )
                    break
                case "html":
                    widget = (
                        <HTML ref="widget" entity={entity} isEditing={this.state.isEditing} onSave={this.onSave} />
                    )
                    break
                case "activity":
                    widget = (
                        <Activity ref="widget" entity={entity} isEditing={this.state.isEditing} onSave={this.onSave} />
                    )
                    break
                case "lead":
                widget = (
                    <Lead ref="widget" entity={entity} isEditing={this.state.isEditing} onSave={this.onSave} />
                )
                    break
                case "leader":
                    widget = (
                        <Leader ref="widget" entity={entity} isEditing={this.state.isEditing} onSave={this.onSave} />
                    )
                    break
                case "events":
                    widget = (
                        <Events ref="widget" entity={entity} isEditing={this.state.isEditing} onSave={this.onSave} />
                    )
                    break
                case "cards":
                    widget = (
                        <Cards ref="widget" entity={entity} isEditing={this.state.isEditing} onSave={this.onSave} />
                    )
            }

            let settings
            if (this.state.isEditing) {
                settings = (
                    <button className="___save" onClick={(e) => this.refs.widget.onSave()}></button>
                )
            } else {
                settings = (
                    <button className="___edit" onClick={this.onEdit}></button>
                )
            }

            let overlay
            if (entity.canEdit) {
                overlay = (
                    <div className="cms-overlay">
                        <div className="cms-overlay__actions">
                            <div className="cms-overlay__buttons">
                                {settings}
                                <button className="___delete" onClick={(e) => this.refs.delete.toggle()}></button>
                            </div>
                        </div>
                    </div>
                )
            }

            return (
                <div className={this.props.col}>
                    <div className={classnames({
                        "cms-block cms-block-filled": entity.canEdit,
                        "cms-block-editing": this.state.isEditing
                    })}>
                        {widget}
                        {overlay}
                    </div>
                    <Delete ref="delete" entity={entity} refetchQueries={["PageItem"]} message="Weet je zeker dat je de widget wil legen?" />
                </div>
            )
        } else {
            let selectType
            if (this.state.isSelectingType) {
                selectType = (
                    <Select name="selectType" onChange={(option) => this.addWidget(this.props.index, option)} options={otherWidgets} />
                )
            }

            if (container.canEdit) {
                let buttons
                buttons = this.props.options.map((option, j) => {
                    if (this.state.isSelectingType && option === "other") {
                        return
                    }

                    return (
                        <button key={j} className="button" disabled={this.props.disabled} onClick={(e) => this.addWidget(this.props.index, option)}>{translate[option]}</button>
                    )
                })

                return (
                    <div tabIndex="0" className={this.props.col}>
                        <div className="cms-block">
                            <div className="cms-block__buttons">
                                {buttons}
                                {selectType}
                            </div>
                        </div>
                    </div>
                )
            } else {
                return (
                    <div />
                )
            }
        }
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