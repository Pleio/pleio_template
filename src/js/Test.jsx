import React from "react"
import RichTextField from "./core/components/RichTextField"

export default class Test extends React.Component {
    render() {
        return (
            <div className="form">
                <RichTextField name="test" />
            </div>
        )
    }
}