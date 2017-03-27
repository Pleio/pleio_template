import React from "react"
import AddCore from "../core/Add"
import { browserHistory } from "react-router"
import Modal from "../core/components/Modal"

export default class Add extends React.Component {
    constructor(props) {
        super(props)
    }

    onClose() {
        browserHistory.push("/blog")
    }

    afterAdd() {
        window.location.href = "/blog"
    }

    onScroll(e) {
        console.log(e)
    }

    render() {
        return (
            <Modal title="Schrijf een verhaal" full={true} noParent={true} onClose={this.onClose} onScroll={this.onScroll}>
                <AddCore ref="add" subtype="blog" featuredImage={true} refetchQueries={["InfiniteList"]} afterAdd={this.afterAdd} />
            </Modal>
        )
    }
}