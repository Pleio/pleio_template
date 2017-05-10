import React from "react"
import { DropTarget } from "react-dnd"
import Widget from "./Widget"
import classnames from "classnames"

export default class Row extends React.Component {
    render() {
        const { canEdit, entities, moveWidget, deleteWidget } = this.props

        const widgets = entities.map((entity, i) => {
            return (
                <Widget key={entity.guid} index={i} entity={entity} canEdit={canEdit} moveWidget={moveWidget} deleteWidget={deleteWidget} />
            )
        })

        return (
            <div className={classnames({"row": true, "widget__row":true, "___selected": this.props.selected})}>
                {widgets}
            </div>
        )
    }
}