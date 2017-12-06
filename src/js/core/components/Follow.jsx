import React from "react"
import classnames from "classnames"
import { graphql } from "react-apollo"
import { withRouter } from "react-router-dom"
import gql from "graphql-tag"
import autobind from "autobind-decorator"

class Follow extends React.Component {
    constructor(props) {
        super(props)

        this.state = { isFollowing: this.props.entity.isFollowing || false }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.entity !== this.props.entity) {
            this.setState({ isFollowing: nextProps.entity.isFollowing || false })
        }
    }

    @autobind
    onToggle(e) {
        let isFollowing = !this.state.isFollowing

        this.props.mutate({
            variables: {
                input: {
                    clientMutationId: "1",
                    guid: this.props.entity.guid,
                    isFollowing: isFollowing ? true : false
                }
            }
        })

        this.setState({ isFollowing: isFollowing })
    }

    render() {
        const { viewer } = this.props

        if (!viewer || !viewer.loggedIn) {
            return (
                <div />
            )
        }

        return (
            <div className={classnames({ "button__text article-actions__follow": true, " ___is-saved": this.state.isFollowing })} onClick={this.onToggle}>
                <span className="___saved">Stop met volgen</span>
                <span className="___save">Volg dit artikel</span>
            </div>
        )
    }
}

const Query = gql`
    mutation Follow($input: followInput!) {
        follow(input: $input) {
            object {
                guid
                isFollowing
            }
        }
    }
`

export default graphql(Query)(Follow)