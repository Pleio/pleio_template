import React from "react"
import { DropTarget } from "react-dnd"
import Widget from "./Widget"
import Delete from "../../core/Delete"
import classnames from "classnames"
import autobind from "autobind-decorator"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

class Row extends React.Component {

    @autobind
    addWidget(position, type) {
        this.props.mutate({
            variables: {
                input: {
                    clientMutationId: 1,
                    rowGuid: this.props.entity.guid,
                    position,
                    type,
                }
            },
            refetchQueries: ["PageItem"]
        })
    }

    render() {
        const { entity } = this.props

        let cols = []
        let options = ["text", "html", "other"]

        switch (entity.layout) {
            case "full":
                cols = ["col-sm-12"]
                break
            case "text":
                cols = ["col-sm-8 col-sm-offset-2"]
                options = ["text"]
                break
            case "8/4":
                cols = ["col-sm-8", "col-sm-4"]
                break
            case "4/8":
                cols = ["col-sm-4", "col-sm-8"]
                break
            case "4/4/4":
                cols = ["col-sm-4", "col-sm-4", "col-sm-4"]
                break
            case "6/6":
                cols = ["col-sm-6", "col-sm-6"]
                break
        }

        let definedWidgets = {}
        entity.widgets.forEach((widget) => {
            definedWidgets[widget.position] = widget
        })

        const widgets = cols.map((col, i) => {
            return (
                <Widget key={i} index={i} container={entity} options={options} col={col} entity={definedWidgets[i]} addWidget={this.addWidget} />
            )
        })

        let overlay
        if (entity.canEdit) {
            overlay = (
                <div>
                    <div className="cms-section__buttons">
                        <button className="___delete" onClick={(e) => this.refs.delete.toggle()} />
                    </div>
                    <Delete ref="delete" entity={this.props.entity} refetchQueries={["PageItem"]} />
                </div>
            )
        }

        return (
            <section className={classnames({"section cms-section": true, "___less-padding-top": (this.props.firstRow && entity.layout === "full")})}>
                <div className={classnames({"container": true, "___no-padding-mobile": (this.props.firstRow && entity.layout === "full")})}>
                    <div className="row">
                        {widgets}
                    </div>
                </div>
                {overlay}
            </section>
        )
    }
}

const Mutation = gql`
    mutation AddWidget($input: addWidgetInput!) {
        addWidget(input: $input) {
            entity {
                guid
            }
        }
    }
`

export default graphql(Mutation)(Row)