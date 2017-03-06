import React from "react"
import { List } from "immutable"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

class Menu extends React.Component {
    constructor(props) {
        super(props)

        this.addLink = this.addLink.bind(this)
        this.removeLink = this.removeLink.bind(this)

        this.state = {
            menu: List()
        }
    }

    componentWillReceiveProps(nextProps) {
        const { data } = nextProps

        if (!data.site || this.props.data === nextProps.data) {
            return
        }

        this.setState({
            menu: List(data.site.menu)
        })
    }

    addLink(e) {
        e.preventDefault()

        this.setState({
            menu: this.state.menu.push({
                title: "Nieuw",
                link: "/nieuw"
            })
        })
    }

    onChangeField(i, fieldName, e) {
        e.preventDefault()

        this.setState({
            menu: this.state.menu.set(i, Object.assign({}, this.state.menu[i], {
                [fieldName]: e.target.value
            }))
        })
    }

    removeLink(i, e) {
        e.preventDefault()

        this.setState({
            menu: this.state.menu.delete(i)
        })
    }

    render() {
        const menu = this.state.menu.map((link, i) => {
            return (
                <div key={i}>
                    <input type="text" name={`menuTitle[${i}]`} onChange={(e) => this.onChangeField(i, "title", e)} value={link.title} />
                    <input type="text" name={`menuLink[${i}]`} onChange={(e) => this.onChangeField(i, "link", e)} value={link.link} />
                    <span className="elgg-icon elgg-icon-delete" onClick={(e) => this.removeLink(i, e)} />
                </div>
            )
        })

        return (
            <div>
                <div>
                    <button className="elgg-button elgg-button-submit" onClick={this.addLink}>
                        Link toevoegen
                    </button>
                    {menu}
                </div>
            </div>
        )
    }
}

const Query = gql`
    query Menu {
        site {
            guid
            menu {
                title
                link
            }
        }
    }
`

export default graphql(Query)(Menu)