import React from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

class WidgetOverlay extends React.Component {
    render() {
        return (
            <div className="cms-overlay">
                <div className="cms-overlay__actions">
                    <div className="cms-overlay__buttons">
                        <button className="___settings"></button>
                        <button className="___delete"></button>
                    </div>
                </div>
            </div>
        )
    }
}

const Mutation = gql`

`

export default graphql(Mutation)(WidgetOverlay)