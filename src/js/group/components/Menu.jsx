import React from "react"
import TabMenu from "../../core/components/TabMenu"
import { groupPlugins as defaultPlugins } from "../../lib/constants"

export default class Menu extends React.Component {
    render() {
        const { match, group } = this.props
        const rootUrl =  `/groups/view/${match.params.groupGuid}/${match.params.groupSlug}`
        
        const plugins = group.plugins ? group.plugins : Object.keys(defaultPlugins)

        const menuOptions = plugins.map((key) => {
            return {
                link: `${rootUrl}/${key}`,
                title: defaultPlugins[key]
            }
        })

        return (
            <TabMenu options={[
                ...[{ link: `${rootUrl}`, title:"Activiteiten" }],
                ...menuOptions
            ]} history={history} />
        )
    }
}