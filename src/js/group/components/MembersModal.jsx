import React from "react"
import Modal from "../../core/components/NewModal"
import Form from "../../core/components/Form"
import InputField from "../../core/components/InputField"
import MembersList from "../components/MembersList"

export default class MembersModal extends React.Component {
    constructor(props) {
        super(props)

        this.toggle = this.toggle.bind(this)
        this.onChange = this.onChange.bind(this)

        this.state = {
            q: "",
            search: ""
        }
    }

    onChange(e) {
        const q = e.target.value

        this.setState({ q })

        if (this.changeTimeout) {
            clearTimeout(this.changeTimeout)
        }

        this.changeTimeout = setTimeout(() => {
            this.setState({ search: q })
        }, 100)
    }

    toggle() {
        this.refs.modal.toggle()
    }

    render () {
        const { entity } = this.props

        return (
            <Modal ref="modal" title="Leden" square>
                <div className="group-info">
                    <div className="group-info__content ___scrollable">
                        <div className="search-bar ___margin-bottom">
                            <input type="text" name="q" onChange={this.onChange} placeholder="Zoek op naam..." autoComplete="off" value={this.state.q} />
                            <div className="search-bar__button" />
                        </div>
                        <MembersList
                            entity={entity}
                            q={this.state.search}
                            selectable={this.props.selectable}
                            onSelect={this.props.onSelect}
                            selected={this.props.selected}
                            scrollable
                        />
                    </div>
                </div>
            </Modal>
        )
    }
}

