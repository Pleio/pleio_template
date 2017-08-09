import React from "react"
import Color from "./components/Color"
import autobind from "autobind-decorator"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

const Schemes = {
    fresh: { label: "Fris", colors: [ "#02b875", "#00e8a1", "#00c6ff", "#0272a9" ] },
    cold: { label: "Koud", colors: [ "#01689b", "#009ee3", "#00c6ff", "#154273" ] },
    coldWarm: { label: "Koud en warm", colors: [ "#0e2f56", "#118df0", "#ff304f", "#c0b6fd" ] },
    warm: { label: "Warm", colors: [ "#464545", "#fb5660", "#f0f3b0", "#f98e90" ]},
    pastel: { label: "Pastel", colors: [ "#474168", "#626f92", "#00c6ff", "#f9c4ac" ]},
    ubuntu: { label: "Ubuntu", colors: [ "#581845", "#900c3f", "#c70039", "#ff5733" ]}
}

class Colors extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            colors: ["", "", "", ""]
        }
    }

    @autobind
    onChange(e) {
        if (!e.target.value) {
            return
        }

        this.setState({ colors: Schemes[e.target.value].colors })
    }

    componentWillReceiveProps(nextProps) {
        const { data } = nextProps

        if (nextProps == this.props) {
            return
        }

        if (data.loading) {
            return
        }

        this.setState({
            colors: [
                data.site.style.colorPrimary,
                data.site.style.colorSecondary,
                data.site.style.colorTertiary,
                data.site.style.colorQuaternary
            ]
        })
    }

    render() {
        const { data } = this.props

        if (data.loading) {
            return (
                <div />
            )
        }

        const options = Object.keys(Schemes).map((key) => (
            <option key={key} value={key}>{Schemes[key].label}</option>
        ))

        return (
            <div>
                <p>
                    Kies een standaard schema:
                    <select name="scheme" onChange={this.onChange}>
                        <option value="">----</option>
                        {options}
                    </select>
                </p>
                <Color item="primary" label="Primair" value={this.state.colors[0]} />
                <Color item="secondary" label="Secundair" value={this.state.colors[1]} />
                <Color item="tertiary" label="Tertiair" value={this.state.colors[2]} />
                <Color item="quaternary" label="Kwartair" value={this.state.colors[3]} />
            </div>
        )
    }
}

const Query = gql`
    query Colors {
        site {
            guid
            style {
                colorPrimary
                colorSecondary
                colorTertiary
                colorQuaternary
            }
        }
    }
`

export default graphql(Query)(Colors)