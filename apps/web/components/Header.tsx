import Image from "next/image";
import { useRouter } from "next/router";
import { FC } from "react";
import { useUser } from "../hooks/useUser";
import { Navbar } from "./Navbar";

const userId = 1;
export const Header: FC = () => {
  const { user, isLoading, isError } = useUser(userId);
  const router = useRouter();

  const handleClickAvatar = () => {
    router.push(`/user/profile/${userId}`);
  };

  if (isError) return <div>Failed to load</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="header_container">
      <h1 className="header_brand_title">Supapawa</h1>
      <Navbar />
      <div className="header_profile">
        <h1 className="header_profile__name">{user.profile?.name}</h1>
        <span>
          <Image
            width="30"
            height="30"
            alt="development pic"
            style={{ borderRadius: "100%" }}
            src="https://picsum.photos/200"
            onClick={handleClickAvatar}
          />
        </span>
      </div>

      <style jsx>{`
        .header_container {
          display: flex;
          justify-content: space-between;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #efefef;
        }
        .header_brand_title {
          font-weight: 600;
        }
        .header_profile {
          display: flex;
          align-items: center;
        }
        .header_profile * {
          margin-left: 1rem;
        }
        .header_profile__name {
          font-size: 1rem;
          font-weight: 600;
          text-transform: capitalize;
        }
      `}</style>
    </div>
  );
};
