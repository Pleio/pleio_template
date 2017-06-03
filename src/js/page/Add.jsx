import React from "react"
import AddCore from "../core/Add"
import Modal from "../core/components/Modal"

export default class Add extends React.Component {
    constructor(props) {
        super(props)
        this.onClose = this.onClose.bind(this)
    }

    onClose() {
        this.props.history.push("/page")
    }

    afterAdd() {
        window.location.href = "/page"
    }

    render() {
        return (
            <Modal title="Pagina toevoegen" full={true} noParent={true} onClose={this.onClose}>
                <AddCore subtype="page" featured={true} refetchQueries={["InfiniteList"]} afterAdd={this.afterAdd} />
            </Modal>
        )
    }
}