import { api } from "~/utils/api";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
export const UserCardModal = ({
  modalId,
  handle,
  enabled,
}: {
  modalId: string;
  handle: string;
  enabled: boolean;
}) => {
  const [confirm, setConfirm] = useState<boolean | undefined>();
  const [isSoad, setIsSoad] = useState<boolean | undefined>();
  const [useEyeError, setUseEyeError] = useState<string | undefined>();
  // const [userDataError, setUserDataError] = useState<string | undefined>();
  // a modal that shows the user's info including their name, bio, interests and status
  const { data, error: userDataError } = api.getUser.getUserInfo.useQuery(
    { handle },
    {
      enabled: enabled,
      refetchOnWindowFocus: false,
      retry: false,
    }
  );
  const { data: attemptsLeft } = api.getUser.getAttemptsLeft.useQuery(
    {},
    {
      enabled: enabled,
      refetchOnWindowFocus: false,
    }
  );
  const { mutateAsync, status } = api.getUser.useEye.useMutation({
    onSuccess: (data) => {
      setIsSoad(data);
    },
    onError: (error) => {
      setUseEyeError(error.message);
    },
  });
  const handleUseEye = async () => {
    if (confirm === true) {
      await mutateAsync({ for: handle });
    }
    setConfirm(!confirm);
  };
  return (
    <dialog className="modal" id={modalId}>
      <form method="dialog" className="modal-box">
        <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
          ✕
        </button>
        {data?.name ? (
          <div className="mx-3 flex flex-col items-start justify-center gap-4">
            <div className="flex flex-row items-center justify-center">
              <h3 className="text-3xl font-extrabold">{data?.name}</h3>
              <Link
                href={`https://www.instagram.com/${data?.name}/`}
                className="btn mx-3"
              >
                {/* add instagram logo here */}
                <Image
                  alt="instagram logo"
                  width="24"
                  height="24"
                  src="https://authjs.dev/img/providers/instagram.svg"
                ></Image>
              </Link>
            </div>
            {/* place to put the user's name */}
            <div>
              <div className="py-2 text-lg font-bold text-base-content">
                Bio
              </div>
              {/* place to put the user's bio */}
              <div className="text-lg text-base-content">{data?.bio}</div>
            </div>
            <div>
              <div className="py-2 text-lg font-bold text-base-content">
                Interests
              </div>
              {/* place to put the user's interests */}
              <div className="inline-block">
                {data?.interests?.map((interest) => (
                  <div
                    className="badge badge-neutral badge-lg mx-1 my-0.5"
                    key={interest.value}
                  >
                    {interest.label}
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full">
              <div className="items-center justify-center py-2 text-lg font-bold text-base-content">
                Status
              </div>
              {/* place to put the user's status */}
              {confirm != false ? (
                <div
                  className={`btn btn-primary w-full transition duration-500 ease-in-out ${
                    confirm ? "btn-secondary" : ""
                  } ${
                    typeof attemptsLeft != "undefined" && attemptsLeft <= 0
                      ? "btn-disabled"
                      : ""
                  }`}
                  onClick={async () => {
                    await handleUseEye();
                  }}
                >
                  {status === "loading" && (
                    <span className="loading loading-spinner"></span>
                  )}
                  {!confirm ? `use 👁️ (${attemptsLeft} left)` : `confirm?`}
                </div>
              ) : isSoad != undefined ? (
                <div
                  className={`badge badge-lg p-3 text-xl ${
                    isSoad ? "badge-primary" : "badge-secondary"
                  }`}
                >
                  {isSoad ? "soad" : "mai soad"}
                </div>
              ) : (
                <div className="flex w-full items-center justify-center">
                  <div className="loading loading-spinner loading-lg"></div>
                </div>
              )}
            </div>
            {useEyeError && (
              <div className="alert alert-error">
                <div className="flex-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2 inline-block h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 17l3 3 3-3m-3-4v4"
                    />
                  </svg>
                  <label>{useEyeError}</label>
                </div>
              </div>
            )}
            <div className="flex w-full items-center justify-center">
              <p className="text-base-content">👁️ will refresh every day</p>
            </div>
          </div>
        ) : (
          <div>
            {userDataError ? (
              <div className="alert alert-error">{userDataError?.message}</div>
            ) : (
              <div className="loading loading-lg"></div>
            )}
          </div>
        )}
      </form>
    </dialog>
  );
};
