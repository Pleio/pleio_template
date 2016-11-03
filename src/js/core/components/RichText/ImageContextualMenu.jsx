import React from "react"
import classnames from "classnames"

export default class ImageMenu extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            showAlignOptions: false,
            showInlineOptions: false
        }

        this.toggleAlignOptions = (e) => this.setState({showAlignOptions: !this.state.showAlignOptions})
        this.toggleInlineOptions = (e) => this.setState({showInlineOptions: !this.state.showInlineOptions})

        this.onChangeAlign = this.onChangeAlign.bind(this)
        this.onChangeDisplay = this.onChangeDisplay.bind(this)
    }

    onChangeAlign(position) {
        if (this.props.onChangeAlign) {
            this.props.onChangeAlign(position)
        }
    }

    onChangeDisplay(option) {
        if (this.props.onChangeDisplay) {
            this.props.onChangeDisplay(option)
        }
    }

    render() {
        return (
            <div className={classnames({"contextual": true, "___is-visible":this.props.isVisible})}>
                <div onClick={this.toggleAlignOptions} className={classnames({"contextual__tool ___align": true, "___show-options": this.state.showAlignOptions})}>
                    <div className="icon-dropdown"></div>
                    <ul className="option-list">
                        <li className={classnames({"___align-left": true, "___is-active": this.props.align === "left"})} onClick={() => this.onChangeAlign("left")}>Links</li>
                        <li className={classnames({"___align-right": true, "___is-active": this.props.align === "right"})} onClick={() => this.onChangeAlign("right")}>Rechts</li>
                    </ul>
                </div>
                <div className="contextual__tool ___delete" onClick={this.props.onDelete}></div>
                <div onClick={this.toggleInlineOptions} className={classnames({"contextual__tool ___inline": true, "___show-options": this.state.showInlineOptions})}>
                    <div className="icon-dropdown"></div>
                    <ul className="option-list">
                        <li onClick={() => this.onChangeDisplay("inline-block")}>Inline</li>
                        <li onClick={() => this.onChangeDisplay("block")}>Tekst onderbreken</li>
                    </ul>
                </div>
                <div className="contextual__tool ___info"></div>
                <div className="contextual__tool ___resize"></div>
            </div>
        )
    }
}