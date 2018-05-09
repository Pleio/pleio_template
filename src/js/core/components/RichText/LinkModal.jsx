import React from "react"
import classnames from "classnames"

export default class LinkModal extends React.Component {
    constructor(props) {
        super(props)

        const { data } = this.props

        this.state = {
            isOpen: false,
            url: data.url || "",
            isTargetBlank: (data.target && data.target === "_blank") ? true : false
        }

        this.changeUrl = (e) => this.setState({ url: e.target.value })
        this.changeTarget = (e) => this.setState({ isTargetBlank: !this.state.isTargetBlank })
        this.onKeyPress = this.onKeyPress.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.toggle = this.toggle.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps === this.props) {
            return
        }

        const { data } = nextProps

        this.setState({
            url: data.url || "",
            isTargetBlank: (data.target && data.target === "_blank") ? true : false
        })
    }

    toggle() {
        this.setState({ isOpen: !this.state.isOpen })
        setTimeout(() => {
            this.refs.url.focus()
        }, 100)
    }

    onKeyPress(e) {
        const keyCode = e.keyCode ? e.keyCode : e.which
        if (keyCode !== 13) { // Enter button
            return;
        }

        e.preventDefault()
        this.onSubmit(e)
    }

    onSubmit(e) {
        let url = this.state.url

        // check if the url does not contain http://, is not relative and is not a mail URL
        if (!/^(f|ht)tps?:\/\//i.test(url) && !/^mailto:/i.test(url) && !/^\//i.test(url)) {
            url = "https://" + url;
        }

        if (this.props.onSubmit) {
            this.props.onSubmit(url, this.state.isTargetBlank)
        }

        this.toggle()
    }

    render() {
        return (
            <div tabIndex="0" ref="hyperlink-modal" className={classnames({"modal ___small ___middle": true, "___is-open": this.state.isOpen})}>
                <div className="modal__wrapper">
                    <div className="modal__background" onClick={this.toggle}></div>
                    <div className="modal__box">
                        <div className="modal__close" onClick={this.toggle}></div>
                        <h3 className="modal__title">
                            Hyperlink toevoegen
                        </h3>
                        <div className="form">
                            <label className="form__item">
                                <input ref="url" type="text" name="url" placeholder="Link" onKeyPress={this.onKeyPress} onChange={this.changeUrl} value={this.state.url} />
                            </label>
                            <div className="checkbox" onClick={this.changeTarget}>
                                <input readOnly name="condition-hyperlink" type="checkbox" checked={this.state.isTargetBlank} />
                                <label htmlFor="condition-hyperlink">Openen in nieuw tabblad</label>
                            </div>
                                <div className="buttons ___end">
                                    <div className="button" onClick={this.onSubmit}>
                                        Invoegen
                                    </div>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

