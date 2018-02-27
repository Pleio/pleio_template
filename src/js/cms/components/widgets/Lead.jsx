import React from "react"
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

        let value = defaultValue || ""
        entity.settings.forEach(setting => {
            if (setting.key === key) {
                value = setting.value
            }
        })

        return value
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

        this.props.onSave([{ key: "leadImage", value: values.leadImage }])
    }

    render() {
        const { entity, isEditing } = this.props

        let style = {
            height: this.state.height,
            width: "100%",
            marginLeft: 0,
            marginRight: 0,
            backgroundImage: `url(${this.getSetting(
                "leadImage",
                "/mod/pleio_template/src/images/lead-home2.png"
            )})`
        }

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
                        name="leadImage"
                        placeholder="Hier komt de link naar de afbeelding..."
                        value={this.getSetting("leadImage")}
                    />
                    <InputField
                        name="leadlink"
                        placeholder="Hier komt de link naar de link..."
                        value={this.getSetting("leadlink")}
                    />
                </Form>
            )
        }

        return (
            <div style={style} className="lead" ref="lead">
                <div className="lead__justify container">
                    <div className="row">
                        <div className="col-xs-12 bottom-xs start-xs">
                            <div>
                                <h1 className="lead__title">Titel</h1>
                                <a className="read-more">
                                    <div className="read-more__circle" />
                                    <span>Lees meer</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
