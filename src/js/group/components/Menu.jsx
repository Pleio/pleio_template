import React from "react"
import TabMenu from "../../core/components/TabMenu"
import { groupPlugins as defaultPlugins } from "../../lib/constants"
import { withRouter } from "react-router"

class Menu extends React.Component {
    render() {
        const { match, entity } = this.props

        const rootUrl =  `/groups/view/${match.params.groupGuid}/${match.params.groupSlug}`

        const plugins = entity.plugins ? entity.plugins : Object.keys(defaultPlugins)

        const menuOptions = plugins.map((key) => {
            return {
                link: `${rootUrl}/${key}`,
                title: defaultPlugins[key]
            }
        })

        return (
            <TabMenu className="tabmenu ___group" options={[
                ...[{ link: `${rootUrl}`, title:"Overzicht" }],
                ...menuOptions
            ]} />
        )
    }
}

export default withRouter(Menu)