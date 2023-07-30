import { api } from "~/utils/api";
import { useSession, signIn } from "next-auth/react";
import Image from "next/image";

export default function Delete() {
  const { mutate } = api.user.deleteUser.useMutation({});
  const { data: sessionData } = useSession();
  return (
    <>
      {sessionData ? (
        <button className="btn btn-secondary" onClick={() => void mutate({})}>
          delete
        </button>
      ) : (
        <button
          className="btn btn-secondary"
          onClick={() => {
            void signIn("instagram", { callbackUrl: "/delete" });
          }}
        >
          <Image
            alt="instagram logo"
            width="24"
            height="24"
            src="https://authjs.dev/img/providers/instagram.svg"
          ></Image>
          Sign in with Instagram
        </button>
      )}
    </>
  );
}
