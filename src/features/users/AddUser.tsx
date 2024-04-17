import UserForm from "./components/UserForm";

const AddUser = () => {

  const content = (
    <div className="rounded-[0.5rem] bg-background shadow-md md:shadow-l p-8">
      <UserForm initialData={null} />
    </div>
  );

  return content;
};

export default AddUser;
