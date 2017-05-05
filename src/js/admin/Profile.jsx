import React from "react"
import { List } from "immutable"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

class Profile extends React.Component {
    constructor(props) {
        super(props)

        this.addField = this.addField.bind(this)
        this.removeField = this.removeField.bind(this)

        this.state = {
            profile: List()
        }
    }

    componentWillReceiveProps(nextProps) {
        const { data } = nextProps

        if (!data.site || this.props.data === nextProps.data) {
            return
        }

        this.setState({
            profile: List(data.site.profile)
        })
    }

    addField(e) {
        e.preventDefault()

        this.setState({
            profile: this.state.profile.push({
                key: "veld",
                name: "Een voorbeeldveld"
            })
        })
    }

    onChangeField(i, fieldName, e, transformToKey) {
        e.preventDefault()

        let value = e.target.value
        if (transformToKey) {
            value = value.toLowerCase().replace(/[^a-z]/gm, "")
        }

        this.setState({
            profile: this.state.profile.set(i, Object.assign({}, this.state.profile[i], {
                [fieldName]: value
            }))
        })
    }

    removeField(i, e) {
        e.preventDefault()

        this.setState({
            profile: this.state.profile.delete(i)
        })
    }

    render() {
        const fields = this.state.profile.map((field, i) => {
            return (
                <div key={i}>
                    <input type="text" name={`profileKey[${i}]`} onChange={(e) => this.onChangeField(i, "key", e, true)} value={field.key} />
                    <input type="text" name={`profileName[${i}]`} onChange={(e) => this.onChangeField(i, "name", e, false)} value={field.name} />
                    <span className="elgg-icon elgg-icon-delete" onClick={(e) => this.removeField(i, e)} />
                </div>
            )
        })

        return (
            <div>
                <div>
                    <button className="elgg-button elgg-button-submit" onClick={this.addField}>
                        Veld toevoegen
                    </button><br />
                    <b>Sleutel</b>&nbsp;<b>Omschrijving</b><br />
                    <i>Let op: de sleutel mag alleen de karakters a-z bevatten en mag maximaal 8 tekens lang zijn.</i>
                    {fields}
                </div>
            </div>
        )
    }
}

const Query = gql`
    query Profile {
        site {
            guid
            profile {
                key
                name
            }
        }
    }
`

export default graphql(Query)(Profile)