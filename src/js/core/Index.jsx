import React from "react"
import ActivityList from "../activity/List"
import CmsItem from "../cms/Item"

export default class Index extends React.Component {
    render() {
        if (!window) {
            return (
                <ActivityList />
            )
        }

        const settings = window.__SETTINGS__

        if (settings.site.startPage == "cms" && settings.site.startPageCms) {
            const match = { params: { guid: settings.site.startPageCms, slug: "start" } }

            return (
                <CmsItem match={match} />
            )
        } else {
            return (
                <ActivityList />
            )
        }
    }
}