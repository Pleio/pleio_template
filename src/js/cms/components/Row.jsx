import React from "react"
import { DropTarget } from "react-dnd"
import Widget from "./Widget"
import Delete from "../../core/Delete"
import classnames from "classnames"
import autobind from "autobind-decorator"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

const translate = {
    "text": "Tekst",
    "html": "HTML"
}

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
        let options = ["text", "html"]

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

        let buttons

        const widgets = cols.map((col, i) => {
            if (definedWidgets[i]) {
                return (
                    <Widget key={i} col={col} entity={definedWidgets[i]} />
                )
            } else {
                if (entity.canEdit) {
                    buttons = options.map((option, j) => (
                        <button key={j} className="button" disabled={this.props.disabled} onClick={(e) => this.addWidget(i, option)}>{translate[option]}</button>
                    ))
                }

                return (
                    <div key={i} className={col}>
                        <div className="cms-block">
                            <div className="cms-block__buttons">
                                {buttons}
                            </div>
                        </div>
                    </div>
                )
            }
        })

        let overlay
        if (entity.canEdit) {
            overlay = (
                <div className="overlay">
                    <div className="overlay__buttons">
                        <button onClick={(e) => this.refs.delete.toggle()}>Delete</button>
                    </div>
                    <Delete ref="delete" entity={this.props.entity} refetchQueries={["PageItem"]} />
                </div>
            )
        }

        if (this.props.entity.layout === "full") {
            return (
                <section className={classnames({"section": true, "___no-padding-top": this.props.firstRow})}>
                    {widgets}
                    {overlay}
                </section>
            )
        } else {
            return (
                <section className="section">
                    <div className="container">
                        <div className="row">
                            {widgets}
                        </div>
                    </div>
                    {overlay}
                </section>
            )
        }
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