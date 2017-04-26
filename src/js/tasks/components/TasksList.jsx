import React from "react"
import Card from "./Card"

export default class TasksList extends React.Component {
    render() {
        const { entities } = this.props.data

        if (!entities) {
            return (
                <div />
            )
        }

        const cards = entities.edges.map((entity, i) => (
            <Card key={i} entity={entity} {...this.props} />
        ))

        return (
            <div className="row">
                <div className="col-sm-4">
                    <h3>Nieuw</h3>
                    {cards}
                </div>
                <div className="col-sm-4">
                    <h3>Bezig</h3>
                </div>
                <div className="col-sm-4">
                    <h3>Klaar</h3>
                </div>
            </div>
        )
    }
}