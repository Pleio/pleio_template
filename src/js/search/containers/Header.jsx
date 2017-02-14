import React from "react"
import { Link } from "react-router"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import { showShortDate } from "../../lib/showDate"
import Header from "../components/Header"

const Query = gql`
    query SearchHeader($q: String!, $type: Type, $subtype: String, $offset: Int, $limit: Int) {
        search(q: $q, offset: $offset, limit: $limit, type: $type, subtype: $subtype) {
            total
            totals {
                subtype
                total
            }
        }
    }
`;

export default graphql(Query)(Header);