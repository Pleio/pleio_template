import React from "react"
import { Link } from "react-router-dom"

export default class Tooltip extends React.Component {
    render() {
        const lists = this.props.lists.map((list, i) => {
            const items = list.map((item, j) => {
                if (item.external) {
                    return (
                        <a key={j} href={item.link} className={item.className}>
                            {item.title}
                        </a>
                    )
                } else {
                    return (
                        <Link key={j} to={item.link} className={item.className}>
                            {item.title}
                        </Link>
                    )
                }
            })

            return (
                <div key={i} className="link-list">
                    {items}
                </div>
            )
        })

        return (
            <div className="tooltip">
                {lists}
            </div>
        )
    }
}