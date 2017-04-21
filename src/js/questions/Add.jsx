import React from "react"
import AddCore from "../core/Add"
import Modal from "../core/components/Modal"

export default class Add extends React.Component {
    constructor(props) {
        super(props)
        this.onClose = this.onClose.bind(this)
    }

    onClose() {
        this.props.history.push("/questions")
    }

    afterAdd() {
        window.location.href = "/questions"
    }

    render() {
        return (
            <Modal title="Stel een vraag" full={false} noParent={true} onClose={this.onClose}>
                <AddCore title="Stel een vraag" subtype="question" refetchQueries={["InfiniteList", "QuestionTopicCard"]} afterAdd={this.afterAdd} />
            </Modal>
        )
    }
}