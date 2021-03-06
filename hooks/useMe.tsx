import { gql, useQuery, useReactiveVar } from "@apollo/client";
import { useEffect } from "react";
import { isLoggedInVar, logUserOut } from "../apollo";
import { me } from "../screens/__generated__/me";

const ME_QUERY = gql`
  query me {
    me {
      id
      firstName
      lastName
      username
      email
      bio
      avatar
    }
  }
`;

function useMe() {
  const hasToken = useReactiveVar(isLoggedInVar);
  const { data, error } = useQuery<me>(ME_QUERY, {
    skip: !hasToken,
  });
  useEffect(() => {
    if (data?.me === null) {
      logUserOut();
    }
  }, [data]);
  return { data };
}

export default useMe;
