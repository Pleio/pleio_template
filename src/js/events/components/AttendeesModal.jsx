import React from "react"
import autobind from "autobind-decorator"
import Modal from "../../core/components/NewModal"
import Tabber from "../../core/components/Tabber"

export default class AttendeesModal extends React.Component {
    @autobind
    toggle() {
        this.refs.modal.toggle()
    }

    render() {
        const items = [
            { title: "Aanwezig", content:"Todo" },
            { title: "Misschien", content:"Todo" },
            { title: "Afwezig", content:"Todo" }
        ]

        return (
            <Modal ref="modal" title="Gasten" square>
                <Tabber items={items} />
            </Modal>
        )
    }
}