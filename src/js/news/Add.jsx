import React from "react"
import AddCore from "../core/Add"
import ActionContainer from "../core/components/ActionContainer"

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
            <ActionContainer title="Nieuws toevoegen" onClose={this.onClose}>
                <AddCore subtype="news" featured={true} refetchQueries={["InfiniteList"]} afterAdd={this.afterAdd} />
            </ActionContainer>
        )
    }
}