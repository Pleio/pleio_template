import React from "react"

export default class ProfileSore extends React.Component {
    calculateScore() {
        const { entity } = this.props

        let score = 0
        entity.profile.forEach((item) => {
            if (item.value) {
                score += 1
            }
        })

        return score / entity.profile.length
    }

    render() {
        let status, statusDescription
        const score = this.calculateScore()

        if (score >= 0 && score <= 0.25) {
            status = "___is-ok"
            statusDescription = "Oké profiel"
        } else if (score > 0.25 && score <= 0.5) {
            status = "___is-reasonable"
            statusDescription = "Redelijk profiel"
        } else if (score > 0.5 && score <= 0.9) {
            status = "___is-good"
            statusDescription = "Goed profiel"
        } else {
            status = "___is-perfect"
            statusDescription = "Perfect profiel"
        }

        return (
            <div className={"card-profile__status " + status}>
                <span>{statusDescription}</span>
            </div>
        )
    }
}