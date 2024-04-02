import { useParams } from "react-router-dom";
import { useGetUsersQuery } from "./usersApiSlice";
import UserForm from "./components/UserForm";

const EditUser = () => {
  const { id } = useParams<string>();

  const { user } = useGetUsersQuery(undefined, {
    selectFromResult: ({ data }) => ({
      user: id ? data?.entities[id] : undefined,
    }),
  });

  console.log(user);

  if (!user) return <p>Loading...</p>;

  const content = (
    <div className="rounded-[0.5rem] bg-background shadow-md md:shadow-l p-8">
      <UserForm initialData={user} />;
    </div>
  );

  return content;
};

export default EditUser;
