import React from "react"
import Select from "../components/Select"
import { sectorOptions, categoryOptions } from "../../lib/filters"

const extendedSectorOptions = Object.assign({}, sectorOptions, {
    all: "Alle onderwijssectoren"
})

const extendedCategoryOptions = Object.assign({}, categoryOptions, {
    mine: "Mijn categorieën",
    all: "Alle categorieën"
})

export default class ContentFilters extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            sector: "all",
            category: "all"
        }

        this.onChangeFilter = this.onChangeFilter.bind(this)
    }

    onChangeFilter(name, value) {
        let newFilter = Object.assign(this.state, {
            [name]: value
        })

        this.setState(newFilter)

        const tagsArray = Object.keys(newFilter)
            .map(key => newFilter[key])
            .filter((value) => value !== "all")

        if (this.props.onChange) {
            this.props.onChange(tagsArray)
        }
    }

    render() {
        let sectorClass, categoryClass
        switch (this.props.page) {
            case "activity":
                sectorClass = "selector ___margin-top ___margin-bottom ___margin-bottom-mobile ___filter"
                categoryClass = "selector ___margin-top ___margin-bottom ___no-margin-top-mobile ___filter"
                break
            default:
                sectorClass = "selector ___margin-bottom-mobile ___filter"
                categoryClass = "selector ___filter"
                break
        }

        return (
            <div className="row">
                <div className="col-sm-4 col-lg-3">
                    <Select name="sector" options={extendedSectorOptions} onChange={this.onChangeFilter} value={this.state.sector} className={sectorClass} />
                </div>
                <div className="col-sm-4 col-lg-3">
                    <Select name="category" options={extendedCategoryOptions} onChange={this.onChangeFilter} value={this.state.category} className={categoryClass} />
                </div>
                {this.props.children}
            </div>
        )
    }
}