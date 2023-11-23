import { Profile as PrismaProfile, User } from "@prisma/client";
import { differenceInYears, format } from "date-fns";
import { GetServerSideProps } from "next";
import Image from "next/image";
import { useState } from "react";
import prisma from "../../../lib/prisma";

// note: just a way to get around the Date type from prisma
interface UserProfile extends Omit<PrismaProfile, "birthdate"> {
  birthdate: string;
  age: string;
}

export const Profile = ({
  user,
  error,
}: {
  user: User & { profile: UserProfile };
  error: Error;
}) => {
  const [showForm, setShowForm] = useState<boolean>(false);
  if (error) {
    return <div>{error}</div>;
  }

  const handleShowForm = () => setShowForm((prev) => !prev);

  return (
    <section className="profile_section">
      {!showForm ? (
        <div className="profile_container">
          <Image
            className="divider"
            style={{ borderRadius: "150%" }}
            width="150"
            height="150"
            alt="development pic"
            src="https://picsum.photos/200"
          />
          <div className="profile_grid divider">
            <div className="form_label">name</div>
            <div>{user.profile.name}</div>
            <div className="form_label">age</div>
            <div>{user.profile.age}</div>
          </div>
          <button className="button_edit divider" onClick={handleShowForm}>
            edit
          </button>
        </div>
      ) : (
        <form
          className="profile_form  divider"
          action="/api/profile"
          method="post"
        >
          <div className="profile_grid">
            <label className="form_label">avatar</label>
            <input
              type="file"
              id="avatar"
              name="avatar"
              value=""
              placeholder="avatar"
            />

            <label className="form_label">name</label>
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={user.profile.name ?? ""}
            />

            <label className="form_label">age</label>
            <input
              type="text"
              id="age"
              name="age"
              defaultValue={user.profile.birthdate ?? ""}
            />
          </div>

          <div className="form_actions">
            <button className="divider button_edit">submit</button>
            <button className="divider button_edit" onClick={handleShowForm}>
              {"<"}
            </button>
          </div>
        </form>
      )}
      <style jsx>{`
        .profile_section {
          max-width: 350px;
          margin: 4rem auto;
        }
        .profile_container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        .divider {
          margin: 1rem 0;
        }
        .profile_form {
        }
        .profile_grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          grid-gap: 1rem;
        }
        .profile_button {
          grid-column: 1 / span 2;
          justify-self: center;
        }
        .form_label {
          font-weight: 600;
        }
        .form_actions {
          margin-top: 2rem;
          diplay: flex;
          justify-content: center;
          align-items: center;
        }
        .button_edit {
          display: block;
          padding: 0.5rem 1rem;
          background: #34d399;
          color: #fff;
          border-radius: 10px;
          opacity: 0.8;
          transition: 0.3s;
          cursor: pointer;
        }
        .button_edit:hover {
          opacity: 1;
        }
      `}</style>
    </section>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const { userId } = context.params || {};
    const user = await prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
      include: { profile: true },
    });

    const birthdate = user?.profile?.birthdate
      ? format(new Date(user?.profile?.birthdate), "MM/dd/yyyy")
      : "";
    const age = user?.profile
      ? differenceInYears(new Date(), new Date(user.profile.birthdate))
      : "";

    console.dir({ user }, { depth: null });
    return {
      props: {
        user: {
          ...user,
          profile: {
            ...user?.profile,
            birthdate,
            age,
          },
        },
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: { error: `error while fetching the user` },
    };
  }
};

export default Profile;
