import React from "react"
import autobind from "autobind-decorator"
import Modal from "../../core/components/NewModal"
import Tabber from "../../core/components/Tabber"
import AttendeesList from "../containers/AttendeesList"

export default class AttendeesModal extends React.Component {
    @autobind
    toggle(state) {
        this.refs.modal.toggle()

        if (typeof(state) !== "undefined")  {
            this.refs.tabber.toggleSlide(state)
        }
    }

    render() {
        const { entity } = this.props

        const items = [
            { title: `Aanwezig (${entity.attendees.total})`, content: <AttendeesList guid={entity.guid} state="accept" /> },
            { title: `Misschien (${entity.attendees.totalMaybe})`, content: <AttendeesList guid={entity.guid} state="maybe" /> },
            { title: `Afwezig (${entity.attendees.totalReject})`, content: <AttendeesList guid={entity.guid} state="reject" /> }
        ]

        return (
            <Modal ref="modal" title="Gasten" square>
                <Tabber ref="tabber" items={items} />
            </Modal>
        )
    }
}