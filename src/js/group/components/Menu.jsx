import React from "react"
import TabMenu from "../../core/components/TabMenu"
import { groupPlugins as defaultPlugins } from "../../lib/constants"
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
            case "/groups/view/:groupGuid/:groupSlug/files":
                subtype = "file"
                break
            case "/groups/view/:groupGuid/:groupSlug/wiki":
                subtype = "wiki"
                break
        }

        if (subtype) {
            history.push(`/groups/view/${match.params.groupGuid}/${match.params.groupSlug}/search/results?q=${e.target.value}&type=object&subtype=${subtype}`)
        } else {
            history.push(`/groups/view/${match.params.groupGuid}/${match.params.groupSlug}/search/results?q=${e.target.value}`)
        }

    }

    render() {
        const { history, match, entity } = this.props

        const rootUrl =  `/groups/view/${match.params.groupGuid}/${match.params.groupSlug}`

        const plugins = entity.plugins ? entity.plugins : Object.keys(defaultPlugins)

        let menuOptions = []
        Object.keys(defaultPlugins).forEach((key) => {
            if (plugins.includes(key)) {
                menuOptions.push({
                    link: `${rootUrl}/${key}`,
                    title: defaultPlugins[key]
                })
            }
        })

        return (
            <TabMenu className="tabmenu ___group" options={[
                ...[{ link: `${rootUrl}`, title:"Overzicht" }],
                ...menuOptions
            ]}>
                <button className="tabmenu__search-button" onClick={this.openSearch}></button>
                <div className={classnames({"tabmenu__search": true, "___is-visible": this.state.searchActive})}>
                    <input ref="search" placeholder="Zoeken in groep" onKeyDown={this.onKeyDown} onChange={this.onChange} value={this.state.value} />
                    <button onClick={this.closeSearch} />
                </div>
            </TabMenu>
        )
    }
}

export default withRouter(Menu)