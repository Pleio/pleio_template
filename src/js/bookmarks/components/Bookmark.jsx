import React from "react"
import classNames from "classnames"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

class Bookmark extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isBookmarked: (this.props.entity && this.props.entity.isBookmarked) || false
        }

        this.onToggle = this.onToggle.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.entity) {
            this.setState({
                isBookmarked: nextProps.entity.isBookmarked
            })
        }
    }

    onToggle(e) {
        e.preventDefault()

        let isAdding = !this.state.isBookmarked

        this.props.mutate({
            variables: {
                input: {
                    clientMutationId: "1",
                    guid: this.props.entity.guid,
                    isAdding: isAdding
                }
            }
        })

        this.setState({
            isBookmarked: isAdding
        })
    }

    render() {
        return (
            <div title="Bewaar" onClick={this.onToggle} className={classNames({"button__text article-action ___bookmark": true, "___is-saved": this.state.isBookmarked})}>
                <span className="___saved">Bewaard</span>
                <span className="___save">Bewaren</span>
            </div>
        )
    }
}

const Query = gql`
    mutation Bookmark($input: bookmarkInput!) {
        bookmark(input: $input) {
            object {
                guid
                isBookmarked
            }
        }
    }
`
const withQuery = graphql(Query)
export default withQuery(Bookmark)