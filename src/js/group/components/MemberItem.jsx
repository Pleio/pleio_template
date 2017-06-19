import React from "react"
import { Link } from "react-router-dom"
import Select from "../../core/components/Select"
import classnames from "classnames"

export default class MemberItem extends React.Component {
    render() {
        const { member } = this.props

        let editable
        if (this.props.editable) {
            editable = (
                <div className="col-sm-4">
                    <Select options={{lid: "Lid", admin: "Groepsbeheerder", remove: "Verwijderen"}} value="lid" />
                </div>
            )
        }

        return (
            <div className="row">
                <div className={this.props.editable ? "col-sm-8" : "col-sm-12"}>
                    <Link to={member.url} className="card-list-members__item">
                        <div style={{backgroundImage: `url('${member.icon}')`}} className="card-list-members__picture" />
                        <div className="card-list-members__name">{member.name}</div>
                    </Link>
                </div>
                {editable}
            </div>
        )
    }
}