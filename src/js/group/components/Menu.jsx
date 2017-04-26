import React from "react"
import TabMenu from "../../core/components/TabMenu"

export default class Menu extends React.Component {
    render() {
        const { match } = this.props
        const rootUrl =  `/groups/view/${match.params.groupGuid}/${match.params.groupSlug}`

        const menuOptions = [
            { link: `${rootUrl}`, title:"Activiteiten" },
            { link: `${rootUrl}/events`, title:"Agenda" },
            { link: `${rootUrl}/blog`, title:"Blog" },
            { link: `${rootUrl}/questions`, title:"Forum" },
            { link: `${rootUrl}/files`, title:"Bestanden" },
            { link: `${rootUrl}/wiki`, title:"Wiki" },
            { link: `${rootUrl}/tasks`, title:"Taken" }
        ]

        return (
            <TabMenu options={menuOptions} history={history} />
        )
    }
}