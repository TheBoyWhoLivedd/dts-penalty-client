import UserForm from "./components/UserForm";

const AddUser = () => {
  // let content = null;

  // if (!departments) return <p>Loading...</p>;

  // const formattedDepartments = departments.ids.map(
  //   (id) => departments.entities[id]
  // );

  // console.log("Formatted", formattedDepartments);

  const content = (
    <div className="rounded-[0.5rem] bg-background shadow-md md:shadow-l p-8">
      <UserForm initialData={null} />
    </div>
  );

  return content;
};

export default AddUser;
