import React from "react"
import TabMenu from "../../core/components/TabMenu"
import { groupPlugins, defaultGroupPlugins } from "../../lib/constants"
import { getQueryVariable } from "../../lib/helpers"
import { withRouter } from "react-router"
import autobind from "autobind-decorator"
import classnames from "classnames"

let onSearchPage
let returnTo

class Menu extends React.Component {
    constructor(props) {
        super(props)

        const { match } = this.props

        if (match.path == "/groups/view/:groupGuid/:groupSlug/search/results") {
            onSearchPage = true
        } else {
            onSearchPage = false
            returnTo = match.url
        }

        this.state = {
            searchActive: onSearchPage,
            value: getQueryVariable("q") || ""
        }
    }

    @autobind
    openSearch(e) {
        this.setState({ searchActive: true })

        setTimeout(() => {
            this.refs.search.focus()
        }, 100)
    }

    @autobind
    closeSearch(e) {
        const { history, match } = this.props

        if (onSearchPage) {
            history.push(returnTo)
        } else {
            this.setState({ searchActive: false })
        }
    }

    @autobind
    onChange(e) {
        this.setState({ value: e.target.value })
    }

    @autobind
    onKeyDown(e) {
        if (e.keyCode !== 13) {
            return
        }

        this.onSearch()
    }

    @autobind
    onSearch() {
        const { history, match } = this.props

        let subtype
        switch (match.path) {
            case "/groups/view/:groupGuid/:groupSlug/events":
                subtype = "event"
                break
            case "/groups/view/:groupGuid/:groupSlug/blog":
                subtype = "blog"
                break
            case "/groups/view/:groupGuid/:groupSlug/questions":
                subtype = "question"
                break
            case "/groups/view/:groupGuid/:groupSlug/discussion":
                subtype = "discussion"
                break
            case "/groups/view/:groupGuid/:groupSlug/files":
                subtype = "file"
                break
            case "/groups/view/:groupGuid/:groupSlug/wiki":
                subtype = "wiki"
                break
        }

        if (subtype) {
            history.push(`/groups/view/${match.params.groupGuid}/${match.params.groupSlug}/search/results?q=${this.state.value}&type=object&subtype=${subtype}`)
        } else {
            history.push(`/groups/view/${match.params.groupGuid}/${match.params.groupSlug}/search/results?q=${this.state.value}`)
        }
    }

    render() {
        const { history, match, entity } = this.props

        const rootUrl =  `/groups/view/${match.params.groupGuid}/${match.params.groupSlug}`

        const plugins = entity.plugins.length > 0 ? entity.plugins : defaultGroupPlugins

        let menuOptions = []
        Object.keys(groupPlugins).forEach((key) => {
            if (plugins.includes(key)) {
                menuOptions.push({
                    link: `${rootUrl}/${key}`,
                    title: groupPlugins[key]
                })
            }
        })

        return (
            <TabMenu className="tabmenu ___group" options={[
                ...[{ link: `${rootUrl}`, title:"Overzicht" }],
                ...menuOptions
            ]} group>
                <div className="tabmenu__search-container">
                    <div className="search-bar">
                        <input name="q" onKeyDown={this.onKeyDown} onChange={this.onChange} value={this.state.value} placeholder="Zoeken in groep" />
                        <div className="search-bar__button" onClick={this.onSearch} />
                    </div>
                </div>
            </TabMenu>
        )
    }
}

export default withRouter(Menu)