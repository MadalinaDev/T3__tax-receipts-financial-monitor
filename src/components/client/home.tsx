"use client";
import { useUser } from "@clerk/nextjs";

const Home = () => {
  const { user } = useUser();
  return (
    <div>
      {user ? (
        <div>
          The current user logged in:{" "}
          {user?.fullName ?? user?.emailAddresses[0]?.emailAddress}{" "}
        </div>
      ) : (
        <div>No user logged in</div>
      )}
    </div>
  );
};

export default Home;
