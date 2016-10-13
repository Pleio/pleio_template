import React from "react"
import Password from "./containers/Password"

export default class Account extends React.Component {
    render() {
        return (
            <section className="section ___grey ___grow">
                <div className="container">
                    <Password />
                </div>
            </section>
        )
    }
}