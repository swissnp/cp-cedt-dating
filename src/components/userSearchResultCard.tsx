import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "~/server/api/root";
import { UserCardModal } from "./userInfoCard";
import { useState } from "react";
import type { IInterestsBase } from "~/utils/validator/userInput";
export const UserSearchResultCard = ({
  info,
  searchTerms,
}: {
  info: inferRouterOutputs<AppRouter>["getUser"]["getUserWithInterests"][0];
  searchTerms: IInterestsBase;
}) => {
  const [enabled, setEnabled] = useState(false);
  return (
    <>
      <UserCardModal
        modalId={info.name ?? ""}
        handle={info.name ?? ""}
        enabled={enabled}
      />
      <div
        className="bordered card mx-0 flex bg-base-200 shadow-lg sm:mx-2"
        onClick={() => {
          setEnabled(true);
          if (document)
            (
              document.getElementById(info.name ?? "") as HTMLDialogElement
            )?.showModal();
        }}
      >
        {/* <figure>
        <img src={info.avatar} alt="Avatar" className="rounded-lg" />
      </figure> */}
        <div className="card-body w-full">
          <h2 className="card-title ">{info.name}</h2>
          <p className="break-words">{info.bio}</p>
          <div className="card-actions">
            {info?.interests?.map((interest) => (
              <div
                className={`badge badge-md mx-1 my-0.5 ${
                  searchTerms.map((term) => term.value).includes(interest.value)
                    ? "badge-primary"
                    : "badge-outline"
                }`}
                key={interest.value}
              >
                {interest.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
