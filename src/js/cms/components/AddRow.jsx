import React from "react"
import classnames from "classnames"
import autobind from "autobind-decorator"
import Row from "./Row"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

class AddRow extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isVisible: false,
            layout: null
        }
    }

    @autobind
    onChange(value) {
        this.setState({ layout: value })
    }

    @autobind
    show() {
        this.setState({ isVisible: true })
        setTimeout(() => this.refs.toolbar.focus(), 100)
    }

    @autobind
    hide() {
        this.setState({
            isVisible: false,
            layout: null
        })
    }

    @autobind
    onSubmit(e) {
        this.props.mutate({
            variables: {
                input: {
                    clientMutationId: 1,
                    layout: this.state.layout,
                    containerGuid: this.props.containerGuid
                }
            },
            refetchQueries: ["PageItem"]
        }).then((data) => {
            this.hide()
        })
    }

    render() {
        let block
        if (this.state.layout) {
            block = (
                <Row entity={{layout: this.state.layout, widgets: []}} disabled={true} firstRow={this.props.firstRow} />
            )
        } else {
            block = (
                <section className="section">
                    <div className="container">
                        <div className="cms-block ___add" onClick={this.show} />
                    </div>
                </section>
            )
        }

        return (
            <div>
                {block}
                <div ref="toolbar" tabIndex="0" className={classnames({"container toolbar ___blue": true, "___is-visible": this.state.isVisible})} onBlur={this.hide}>
                    <div className="title">Kies een indeling</div>
                    <div className="row">
                        <div className="col-sm-3">
                            <div className="radio">
                                <input type="radio" name="layout" id="full" value="full" onChange={() => this.onChange("full")} checked={this.state.layout == "full" ? true : false} />
                                <label htmlFor="full">Volle breedte</label>
                                <div className="radio__check" />
                            </div>
                            <div className="radio">
                                <input type="radio" name="layout" id="text" value="text" onChange={() => this.onChange("text")} checked={this.state.layout == "text" ? true : false} />
                                <label htmlFor="text">Tekstlaag</label>
                                <div className="radio__check" />
                            </div>
                        </div>
                        <div className="col-sm-3">
                            <div className="radio">
                                <input type="radio" name="layout" id="12" value="12" onChange={() => this.onChange("12")} checked={this.state.layout == "12" ? true : false} />
                                <label htmlFor="12">12</label>
                                <div className="radio__check" />
                            </div>                    
                            <div className="radio">
                                <input type="radio" name="layout" id="8/4" value="8/4" onChange={() => this.onChange("8/4")} checked={this.state.layout == "8/4" ? true : false} />
                                <label htmlFor="8/4">8/4</label>
                                <div className="radio__check" />
                            </div>
                            <div className="radio">
                                <input type="radio" name="layout" id="4/8" value="4/8" onChange={() => this.onChange("4/8")} checked={this.state.layout == "4/8" ? true : false} />
                                <label htmlFor="4/8">4/8</label>
                                <div className="radio__check" />
                            </div>
                        </div>
                        <div className="col-sm-3">
                            <div className="radio">
                                <input type="radio" name="layout" id="4/4/4" value="4/4/4" onChange={() => this.onChange("4/4/4")} checked={this.state.layout == "4/4/4" ? true : false} />
                                <label htmlFor="4/4/4">4/4/4</label>
                                <div className="radio__check" />
                            </div>
                            <div className="radio">
                                <input type="radio" name="layout" id="6/6" value="6/6" onChange={() => this.onChange("6/6")} checked={this.state.layout == "6/6" ? true : false} />
                                <label htmlFor="6/6">6/6</label>
                                <div className="radio__check" />
                            </div>
                        </div>
                        <div className="col-sm-3 end-sm bottom-sm">
                            <div className="button" disabled={!this.state.layout} onClick={this.onSubmit}>Toevoegen</div>
                        </div>
                    </div>
                </div>
            </div>
       )
    }
}

const Mutation = gql`
    mutation AddRow($input: addRowInput!) {
        addRow(input: $input) {
            entity {
                guid
            }
        }
    }
`

export default graphql(Mutation)(AddRow)