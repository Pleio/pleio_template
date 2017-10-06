import React from "react"
import { DropTarget } from "react-dnd"
import Widget from "./Widget"
import classnames from "classnames"

const translate = {
    "video": "Video",
    "image": "Afbeelding",
    "text": "Tekst"
}

export default class Row extends React.Component {
    render() {
        let cols = []
        let options = ["video", "image", "text"]

        switch (this.props.layout) {
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

        const buttons = options.map((option, i) => (
            <button key={i} className="button" disabled={this.props.disabled}>{translate[option]}</button>
        ))

        const widgets = cols.map((col, i) => (
            <div key={i} className={col}>
                <div className="cms-block">
                    <div className="cms-block__buttons">
                        {buttons}
                    </div>
                </div>
            </div>
        ))

        if (this.props.layout === "full") {
            return (
                <section className={classnames({"section": true, "___no-padding-top": this.props.firstRow})}>
                    <div className="cms-block">
                        <div className="cms-block__buttons">
                            {buttons}
                        </div>
                    </div>
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
                </section>
            )
        }
    }
}