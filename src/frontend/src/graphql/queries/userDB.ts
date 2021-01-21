import { gql } from "@apollo/client";

export const userDBQuery = gql`
  query {
    user_db {
      _id
      firstName
      lastName
      username
    }
  }
`;
