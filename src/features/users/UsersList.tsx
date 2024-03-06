import { UsersClient } from "./components/client";
import { useGetUsersQuery } from "./usersApiSlice";

const UsersList = () => {
  const {
    data: users,
    isLoading: isLoadingUsers,
    isSuccess: isSuccessUsers,
  } = useGetUsersQuery(undefined, {
    pollingInterval: 360000,
    // refetchOnFocus: true,
    // refetchOnMountOrArgChange: true,
  });

  if (isLoadingUsers) return <p>Loading...</p>;

  if (isSuccessUsers) {
    // console.log("Users", users);

    const transformedData = users.ids.map((userId) => {
      const user = users.entities[userId];
      return {
        ...user,
      };
    });

    return <UsersClient data={transformedData} />;
  }

  return null;
};

export default UsersList;
