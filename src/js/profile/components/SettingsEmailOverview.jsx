import React from "react"
import SelectField from "../../core/components/SelectField"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

const Options = {
    daily: "Dagelijks",
    weekly: "Wekelijks",
    twoweekly: "Om de twee weken",
    monthly: "Maandelijks",
    never: "Nooit"
}

class SettingsEmailOverview extends React.Component {
    constructor(props) {
        super(props)

        this.onChange = this.onChange.bind(this)
        this.submit = this.submit.bind(this)
    }

    onChange(e) {
        setTimeout(() => {
            this.submit()
        }, 10)
    }

    submit() {
        this.props.mutate({
            variables: {
                input: {
                    clientMutationId: 1,
                    guid: this.props.entity.guid,
                    overview: this.refs.overview.getValue()
                }
            }
        })
    }

    render() {
        const { entity } = this.props

        return (
            <div className="card-profile">
                <h3 className="card-profile__title">Updates ontvangen</h3>
                <p>Op basis van je interessegebied kun je een e-mail ontvangen met voor jou geselecteerde berichten.</p>
                <SelectField ref="overview" name="overview" options={Options} onChange={this.onChange} value={entity.emailOverview} />
            </div>
        )
    }
}

const Query = gql`
    mutation editEmailOverview($input: editEmailOverviewInput!) {
        editEmailOverview(input: $input) {
            user {
                guid
                emailOverview
            }
        }
    }
`

export default graphql(Query)(SettingsEmailOverview)