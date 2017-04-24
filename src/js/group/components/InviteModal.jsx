import React from "react"
import Modal from "../../core/components/NewModal"
import Form from "../../core/components/Form"
import InputField from "../../core/components/InputField"
import InviteList from "../components/InviteList"

export default class InviteModal extends React.Component {
    constructor(props) {
        super(props)

        this.toggle = this.toggle.bind(this)
        this.onChange = this.onChange.bind(this)

        this.state = {
            q: ""
        }
    }

    onChange(e) {
        this.setState({ q: e.target.value })
        console.log("onChange Triggered")
    }

    toggle() {
        this.refs.modal.toggle()
    }

    render () {
        const { entity } = this.props

        return (
            <Modal ref="modal" title="Leden uitnodigen">
                {this.state.q}
                <div className="group-info">
                    <div className="group-info__content">
                        <div className="search-bar ___margin-bottom">
                            <input type="text" name="q" onChange={this.onChange} placeholder="Zoek een lid..." autoComplete="off" />
                            <div className="search-bar__button" />
                        </div>
                        <InviteList entity={entity} q={this.state.q} />
                    </div>
                </div>
            </Modal>
        )
    }
}

