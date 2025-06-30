"use client";
import { useUser } from "@clerk/nextjs";

const Home = () => {
  const { user } = useUser();
  return (
    <div>
      <div>The current logged in user: {user?.fullName ?? user?.emailAddresses[0]?.emailAddress} </div>
    </div>
  );
};

export default Home;
