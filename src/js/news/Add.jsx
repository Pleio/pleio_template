import React from "react"
import { browserHistory } from "react-router"
import AddCore from "../core/Add"
import Modal from "../core/components/Modal"

export default class Add extends React.Component {
    constructor(props) {
        super(props)
    }

    onClose() {
        browserHistory.push("/news")
    }

    afterAdd() {
        window.location.href = "/news"
    }

    render() {
        return (
            <Modal title="Nieuws toevoegen" full={true} noParent={true} onClose={this.onClose}>
                <AddCore subtype="news" featuredImage={true} refetchQueries={["InfiniteList"]} afterAdd={this.afterAdd} />
            </Modal>
        )
    }
}