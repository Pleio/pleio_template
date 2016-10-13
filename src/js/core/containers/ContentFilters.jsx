import React from "react"
import Select from "../components/Select"

const sectorOptions = {
    "primair": "Primair onderwijs",
    "voortgezet": "Voorgezet onderwijs",
    "speciaal": "Speciaal onderwijs",
    "mbo": "Mbo",
    "hbo": "Hbo",
    "wo": "WO",
    "all": "Alle onderwijssectoren"
}

const categoryOptions = {
    "loopbaan": "Loopbaan",
    "contract-en-afspraken": "Contract & Afspraken",
    "omgaan-met-crises": "Omgaan met crises",
    "in-de-klas": "In de klas",
    "wetten-en-regels": "Wetten en regels",
    "toekomstvisies": "Toekomstvisies",
    "overig": "Overig",
    "mijn": "Mijn categorieën",
    "all": "Alle categorieën"
}

export default class ContentFilters extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            filter: {
                sector: "all",
                category: "all"
            }
        }

        this.onChangeFilter = this.onChangeFilter.bind(this)
    }

    onChangeFilter(name, value) {
        const newFilter = Object.assign({}, this.state.filter, {
            [name]: value
        })

        this.setState({
            filter: newFilter
        })

        const tagsArray = Object.keys(newFilter)
            .map(key => newFilter[key])
            .filter((value) => value != "all")

        if (this.props.onChange) {
            this.props.onChange(tagsArray)
        }
    }

    render() {
        return (
            <div className="row">
                <div className="col-sm-4 col-lg-3">
                    <Select name="sector" options={sectorOptions} value={this.state.filter.sector} onChange={this.onChangeFilter} />
                </div>
                <div className="col-sm-4 col-lg-3">
                    <Select name="category" options={categoryOptions} value={this.state.filter.category} onChange={this.onChangeFilter} />
                </div>
                {this.props.children}
            </div>
        )
    }
}