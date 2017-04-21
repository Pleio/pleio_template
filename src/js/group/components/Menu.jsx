import React from "react"
import TabMenu from "../../core/components/TabMenu"

export default class Menu extends React.Component {
    render() {
        const rootUrl =  `/groups/view/${this.props.match.params.guid}/${this.props.match.params.slug}`

        const menuOptions = [
            { link: `${rootUrl}`, title:"Home" },
            { link: `${rootUrl}/blog`, title:"Blog" },
            { link: `${rootUrl}/questions`, title:"Forum" },
            { link: `${rootUrl}/files`, title:"Bestanden" }
        ]

        return (
            <TabMenu options={menuOptions} />
        )
    }
}