import useAuth from "@/hooks/useAuth";

const Welcome = () => {
  const { userName } = useAuth();

  const date = new Date();
  const today = new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeStyle: "long",
  }).format(date);

  const content = (
    <>
      <section className="welcome">
        <p>{today}</p>

        <h1>Welcome {userName}!</h1>
      </section>
    </>
  );

  return content;
};
export default Welcome;
