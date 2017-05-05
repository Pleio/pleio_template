import createBrowserHistory from "history/createBrowserHistory"

const browserHistory = createBrowserHistory()

browserHistory.listen((location) => {
    setTimeout(() => {
        // Piwik
        if (typeof _paq !== "undefined") {
            _paq.push(["setDocumentTitle", document.title]);
            _paq.push(["setCustomUrl", location.pathname])
            _paq.push(["trackPageView"])
        }

        // Google Analytics
        if (typeof window.ga !== "undefined") {
            window.ga("send", "pageview", location.pathname)
        }
    }, 100)
})

export default browserHistory
