import React from "react"
import AddCore from "../core/Add"
import Modal from "../core/components/Modal"

export default class Add extends React.Component {
    constructor(props) {
        super(props)
        this.onClose = this.onClose.bind(this)
    }

    onClose() {
        this.props.history.push("/blog")
    }

    afterAdd() {
        window.location.href = "/blog"
    }

    render() {
        return (
            <Modal title="Schrijf een verhaal" full={true} noParent={true} onClose={this.onClose}>
                <AddCore ref="add" subtype="blog" featuredImage={true} refetchQueries={["InfiniteList"]} afterAdd={this.afterAdd} />
            </Modal>
        )
    }
}