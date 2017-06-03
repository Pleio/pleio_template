import React from "react"
import AddCore from "../core/Add"
import Modal from "../core/components/Modal"

export default class Add extends React.Component {
    constructor(props) {
        super(props)
        this.onClose = this.onClose.bind(this)
    }

    onClose() {
        this.props.history.push("/news")
    }

    afterAdd() {
        window.location.href = "/news"
    }

    render() {
        return (
            <Modal title="Nieuws toevoegen" full={true} noParent={true} onClose={this.onClose}>
                <AddCore subtype="news" featured={true} refetchQueries={["InfiniteList"]} afterAdd={this.afterAdd} />
            </Modal>
        )
    }
}