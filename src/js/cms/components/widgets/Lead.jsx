import React from "react"
import { Link } from "react-router-dom"
import autobind from "autobind-decorator"
import Form from "../../../core/components/Form"
import InputField from "../../../core/components/InputField"

export default class Lead extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            visible: true,
            height: "auto"
        }
    }

    @autobind
    getSetting(key, defaultValue) {
        const { entity } = this.props

        let value
        entity.settings.forEach(setting => {
            if (setting.key === key) {
                value = setting.value
            }
        })

        if (value) {
            return value
        }

        return defaultValue || ""
    }

    @autobind
    onClose(e) {
        this.setState({
            height: this.refs.lead.offsetHeight
        })

        setTimeout(() => {
            this.setState({
                visible: false
            })
        }, 10)
    }

    @autobind
    onSave() {
        const values = this.refs.form.getValues()

        this.props.onSave([
            { key: "image", value: values.image },
            { key: "title", value: values.title },
            { key: "link", value: values.link }
        ])
    }

    render() {
        const { entity, isEditing } = this.props

        let style = {
            height: this.state.height,
            width: "100%",
            marginLeft: 0,
            marginRight: 0,
            backgroundImage: `url(${this.getSetting("image", "/mod/pleio_template/src/images/lead-home2.png")})`
        }

        console.log(this.getSetting("image"))

        let link = this.getSetting("leadlink")

        if (!this.state.visible) {
            style.marginTop = 0
            style.opacity = 0
            style.height = 0
        }

        if (isEditing) {
            return (
                <Form ref="form" className="form">
                    <InputField
                        name="image"
                        placeholder="Afbeelding..."
                        value={this.getSetting("image")}
                    />
                    <InputField
                        name="title"
                        placeholder="Title..."
                        value={this.getSetting("title")}
                    />
                    <InputField
                        name="link"
                        placeholder="Link..."
                        value={this.getSetting("link")}
                    />
                </Form>
            )
        }

        let title
        if (this.getSetting("title")) {
            title = (
                <h1 className="lead__title">{this.getSetting("title")}</h1>
            )
        }

        let readMore
        if (this.getSetting("link")) {
            readMore = (
                <Link to={this.getSetting("link")} className="read-more">
                    <div className="read-more__circle" />
                    <span>Lees meer</span>
                </Link>
            )
        }

        return (
            <div style={style} className="lead" ref="lead">
                <div className="lead__justify container">
                    <div className="row">
                        <div className="col-xs-12 bottom-xs start-xs">
                            <div>
                                {title}
                                {readMore}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
