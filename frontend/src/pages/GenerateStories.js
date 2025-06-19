import Navbar from "../components/Navbar";
import UserStoryForm from "../components/UserStoryForm";

const GenerateStories = () => {
  return (
    <>
      <Navbar />
      <div className="p-6 bg-gray-100 min-h-screen">
        <UserStoryForm />
      </div>
    </>
  );
};

export default GenerateStories;
