import React from "react"
import Select from "../../core/components/NewSelect"
import Switches from "../../core/components/Switches"
import Form from "../../core/components/Form"
import { sectorOptions, categoryOptions } from "../../lib/filters"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

class SettingsInterests extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            categories: this.getSelectedItems(categoryOptions, this.props.entity.tags),
            sector: this.getSelectedItem(sectorOptions, this.props.entity.tags)
        }

        this.getSelectedItem = this.getSelectedItem.bind(this)
        this.getSelectedItems = this.getSelectedItems.bind(this)
        this.onChangeSector = this.onChangeSector.bind(this)
        this.onChangeCategories = this.onChangeCategories.bind(this)

        this.submit = this.submit.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps !== this.props) {
            this.setState({
                categories: this.getSelectedItems(categoryOptions, nextProps.entity.tags),
                sector: this.getSelectedItem(sectorOptions, nextProps.entity.tags)
            })
        }
    }

    getSelectedItems(options, values) {
        let selected = []
        Object.keys(options).forEach((option) => {
            if (values.includes(option)) {
                selected.push(option)
            }
        })

        return selected
    }

    getSelectedItem(options, values) {
        for (let option of Object.keys(options)) {
            if (values.includes(option)) {
                return option
            }
        }
    }

    onChangeSector(value) {
        this.setState({ sector: value })

        setTimeout(() => {
            this.submit()
        }, 50)
    }

    onChangeCategories(name, checked) {
        let newState

        if (checked) {
            newState = [ ...this.state.categories, name ]
        } else {
            newState = this.state.categories.filter((i) => i !== name )
        }

        this.setState({ categories: newState })

        setTimeout(() => {
            this.submit()
        }, 50)
    }

    submit() {
        this.props.mutate({
            variables: {
                input: {
                    clientMutationId: 1,
                    guid: this.props.entity.guid,
                    tags: [ ...this.state.categories, this.state.sector ]
                }
            }
        })
    }

    render() {
        return (
            <div className="card-profile">
                <h3 className="card-profile__title">Stel hier je interesses in</h3>
                <div className="row">
                    <div className="col-sm-8 col-lg-6">
                        <div className="form__label">Interesses</div>
                        <div className="row">
                            <div className="col-sm-6">
                                <Switches name="category" label="Je interesses" options={categoryOptions} values={this.state.categories} onChange={this.onChangeCategories} />
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6 col-lg-4">
                        <div className="form__label">Onderwijssector</div>
                        <Select name="sector" label="Je onderwijssector" options={sectorOptions} value={this.state.sector} onChange={this.onChangeSector} />
                    </div>
                </div>
            </div>
        )
    }
}

const Query = gql`
    mutation editInterests($input: editInterestsInput!) {
        editInterests(input: $input) {
            user {
                guid
                tags
            }
        }
    }
`

const withQuery = graphql(Query)
export default withQuery(SettingsInterests)