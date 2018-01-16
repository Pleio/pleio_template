import React from "react"
import autobind from "autobind-decorator"
import Form from "../../../core/components/Form"
import InputField from "../../../core/components/InputField"

export default class Leader extends React.Component {
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
        entity.settings.forEach((setting) => {
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

        this.props.onSave([
            { key: "leaderImage", value: values.leaderImage}
        ])
    }

    render() {
        const { entity, isEditing } = this.props

        let style = {
            height: this.state.height,
            width: "100%",
            backgroundImage: `url(${this.getSetting("leaderImage", "/mod/pleio_template/src/images/lead-home2.png")})`
        }

        if (!this.state.visible) {
            style.marginTop = 0;
            style.opacity = 0;
            style.height = 0;
        }

        if (isEditing) {
            return (
                <Form ref="form" className="form">
                    <InputField name="leaderImage" placeholder="Hier komt de link naar de leader..." value={this.getSetting("leaderImage")} />
                </Form>
            )
        }

        return (
            <div style={style} className="lead ___home" ref="lead">
                <div className="lead__close" onClick={this.onClose}>
                </div>
                <div className="lead__justify">
                    <div className="container">
                    </div>
                </div>
            </div>
        )
    }
}