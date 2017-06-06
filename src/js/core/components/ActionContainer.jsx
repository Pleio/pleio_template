import React from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

export default class ActionContainer extends React.Component {
    render() {
        return (
            <div className="page-layout ___no-nav">
                <main id="skip-navigation" className="page-layout__main">
                    <section className="section">
                        <div className="container">
                            <div className="row">
                                <div className="col-sm-10 col-sm-offset-1 col-lg-8 col-lg-offset-2">
                                    <div className="flexer ___space-between ___margin-bottom">
                                        <h3 className="main__title ___no-margin">{this.props.title}</h3>
                                        <div className="modal__close" onClick={this.props.onClose}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {this.props.children}
                    </section>
                </main>
            </div>
        )
    }
}