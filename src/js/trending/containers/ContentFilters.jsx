import React from "react"
import Select from "../../core/components/Select"

const subtypeOptions = {
    blog: "Blog",
    news: "Nieuws",
    question: "Vragen",
    all: "Alle soorten"
}

export default class ContentFilters extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            subtype: "all"
        }

        this.onChangeSubtype = this.onChangeSubtype.bind(this)
    }

    onChangeSubtype(name, value) {
        this.setState({
            subtype: value
        })

        if (this.props.onChangeSubtype) {
            this.props.onChangeSubtype(value)
        }
    }

    render() {
        return (
            <div className="row">
                <div className="col-sm-4 col-lg-3">
                    <Select name="subtype" options={subtypeOptions} onChange={this.onChangeSubtype} value={this.state.subtype} className="selector ___margin-bottom-mobile" />
                </div>
                {this.props.children}
            </div>
        )
    }
}