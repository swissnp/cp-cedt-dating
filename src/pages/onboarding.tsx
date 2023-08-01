import Head from "next/head";
import { useForm, Controller } from "react-hook-form";
import {
  type IOnBoarding,
  onBoardingSchema,
} from "~/utils/validator/userInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { signOut } from "next-auth/react";
import { api } from "~/utils/api";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import { getServerAuthSession } from "~/server/auth";
import type { GetServerSidePropsContext } from "next";
import Select from "react-select";
const options = [
  { value: "video_games", label: "🎮 Video Games" },
  { value: "reading", label: "📚 Reading" },
  { value: "cooking", label: "🍳 Cooking" },
  { value: "traveling", label: "✈️ Traveling" },
  { value: "music", label: "🎵 Music" },
  { value: "painting", label: "🎨 Painting" },
  { value: "basketball", label: "🏀 Basketball" },
  { value: "soccer", label: "⚽ Soccer" },
  { value: "swimming", label: "🏊 Swimming" },
  { value: "yoga", label: "🧘 Yoga" },
  { value: "chess", label: "♟️ Chess" },
  { value: "hiking", label: "🥾 Hiking" },
  { value: "dancing", label: "💃 Dancing" },
  { value: "coding", label: "💻 Coding" },
  { value: "gardening", label: "🌱 Gardening" },
  { value: "fashion", label: "👗 Fashion" },
  { value: "anime", label: "Anime" },
  { value: "fitness", label: "💪 Fitness" },
  { value: "writing", label: "📝 Writing" },
  { value: "baking", label: "🍰 Baking" },
  { value: "volleyball", label: "🏐 Volleyball" },
  { value: "puzzles", label: "🧩 Puzzles" },
  { value: "meditation", label: "🧘 Meditation" },
  { value: "cinema", label: "🎥 Cinema" },
  { value: "karaoke", label: "🎤 Karaoke" },
  { value: "cycling", label: "🚴 Cycling" },
  { value: "sketching", label: "🎨 Sketching" },
  { value: "running", label: "🏃 Running" },
  { value: "fishing", label: "🎣 Fishing" },
  { value: "cars", label: "🚗 Cars" },
  { value: "technology", label: "📱 Technology" },
  { value: "pets", label: "🐾 Pets" },
  { value: "beauty", label: "💅 Beauty" },
  { value: "shopping", label: "🛍️ Shopping" },
  { value: "comedy", label: "😄 Comedy" },
  { value: "history", label: "📜 History" },
  { value: "astronomy", label: "🔭 Astronomy" },
  { value: "football", label: "⚽ Football" },
  { value: "board_games", label: "🎲 Board Games" },
  { value: "call_of_duty", label: "🎮 Call of Duty" },
  { value: "fortnite", label: "🎮 Fortnite" },
  { value: "minecraft", label: "🎮 Minecraft" },
  { value: "apex_legends", label: "🎮 Apex Legends" },
  { value: "overwatch", label: "🎮 Overwatch" },
  { value: "counter_strike", label: "🎮 Counter-Strike" },
  { value: "valorant", label: "🎮 Valorant" },
  { value: "dota_2", label: "🎮 Dota 2" },
  { value: "hearthstone", label: "🎮 Hearthstone" },
  { value: "world_of_warcraft", label: "🎮 World of Warcraft" },
  { value: "grand_theft_auto", label: "🎮 Grand Theft Auto" },
  { value: "red_dead_redemption", label: "🎮 Red Dead Redemption" },
  { value: "among_us", label: "🎮 Among Us" },
  { value: "rocket_league", label: "🎮 Rocket League" },
  { value: "pubg", label: "🎮 PlayerUnknown's Battlegrounds" },
  { value: "fifa", label: "⚽ FIFA" },
  { value: "nba_2k", label: "🏀 NBA 2K" },
  { value: "warframe", label: "🎮 Warframe" },
  { value: "rainbow_six_siege", label: "🎮 Rainbow Six Siege" },
  { value: "league_of_legends", label: "🎮 League of Legends" },
  { value: "madden", label: "🏈 Madden NFL" },
  { value: "animal_crossing", label: "🏝️ Animal Crossing" },
  { value: "the_witcher", label: "🧙 The Witcher" },
  { value: "destiny", label: "🔮 Destiny" },
  { value: "god_of_war", label: "🎮 God of War" },
  { value: "super_smash_bros", label: "🎮 Super Smash Bros" },
];

export default function Home() {
  const previousData = api.onBoarding.getOnboardData.useQuery({
    refetch: false,
    refetchOnWindowFocus: false,
  });
  const {
    register,
    handleSubmit,
    control,
    setError,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<IOnBoarding>({
    resolver: zodResolver(onBoardingSchema),
    mode: "onBlur",
    defaultValues: useMemo(() => {
      return {
        name: previousData.data?.name ?? "",
        bio: previousData.data?.bio ?? "",
        soad: previousData.data?.soad ?? undefined,
        interests: previousData.data?.interests ?? [],
      };
    }, [previousData]),
  });

  useEffect(() => {
    reset({
      name: previousData.data?.name ?? "",
      bio: previousData.data?.bio ?? "",
      soad: previousData.data?.soad ?? undefined,
      interests: previousData.data?.interests ?? [],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previousData.data]);
  const { mutate, status } = api.onBoarding.setOnboarded.useMutation({
    onSuccess: () => {
      if (document) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        (document.getElementById("my_modal_1") as HTMLFormElement).showModal();
      }
    },
    onError: (error) => {
      setError("root.serverError", { message: error.message });
    },
  });

  return (
    <>
      <Head>
        <title>soad mai?</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </Head>
      <dialog id="my_modal_1" className="modal">
        <form method="dialog" className="modal-box">
          <h3 className="text-lg font-bold">
            {previousData.data?.name
              ? `💾 Save successful!`
              : `🎉 Congrats! Welcome to soad mai?`}
          </h3>
          <p className="py-4">
            {previousData.data?.name
              ? `Let's find whether your crush is available or not.`
              : "Now, you could find whether your crush is available or not."}
          </p>
          <div className="modal-action">
            <Link className="btn btn-primary" href="/">
              {previousData.data?.name ? `Home` : "Next"}
            </Link>
          </div>
        </form>
      </dialog>
      <main className="flex min-h-screen flex-col items-center justify-center">
        {previousData.data?.name && (
          <Link href={"/"} className="btn fixed left-5 top-5">
            ←
          </Link>
        )}
        <div
          className="btn fixed right-5 top-5"
          onClick={() => {
            void signOut({ callbackUrl: "/" });
          }}
        >
          logout
        </div>
        <div className="container flex flex-col items-center justify-center gap-6 px-4 py-16 sm:gap-12 ">
          <h6 className="text-3xl font-extrabold tracking-tight text-secondary-content sm:text-[4rem]">
            <span className="text-[#8e0e19] delay-75 duration-300 ease-in-out">
              {`${previousData.data?.name ?? ""} `}
            </span>
            <span className="delay-75 duration-300 ease-in-out hover:text-[#8e0e19]">
              {"soad "}
            </span>
            <span className="delay-75 duration-300 ease-in-out hover:text-[#8e0e19]">
              mai?
            </span>
          </h6>
          <div className="grid w-full grid-rows-1 items-center gap-3 font-bold sm:justify-center">
            {
              <div className="form-control ">
                <label className="label pt-0 text-lg">
                  <span className="label-text text-base">
                    Instagram username
                    {!previousData.data?.name && (
                      <span className="label-text text-error">{` (can't be changed later)`}</span>
                    )}
                  </span>
                </label>
                <input
                  className={`input input-bordered  w-full sm:w-96 `}
                  disabled={!!previousData.data?.name}
                  placeholder="Username ex: soadmai"
                  {...register("name")}
                ></input>
                {
                  <label className="label pb-0">
                    <span className="label-text-alt pb-0 text-red-500">
                      {errors.bio?.message}
                    </span>
                  </label>
                }
              </div>
            }
            <div className="form-control ">
              <label className="label pt-0 text-lg">
                <span className="label-text text-base">
                  Tell something about yourself
                </span>
              </label>
              <textarea
                className="textarea textarea-bordered h-20 w-full sm:w-96"
                placeholder="Bio"
                {...register("bio")}
              ></textarea>
              {
                <label className="label pb-0">
                  <span className="label-text-alt pb-0 text-red-500">
                    {errors.bio?.message}
                  </span>
                </label>
              }
            </div>
            <div className="form-control flex w-full flex-none sm:w-96">
              <label className="label pt-0 text-lg">
                <span className="label-text text-base">Interests</span>
              </label>
              <Controller
                control={control}
                name={"interests"}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <Select
                    closeMenuOnSelect={false}
                    onChange={onChange}
                    onBlur={onBlur}
                    ref={ref}
                    value={value}
                    isMulti
                    options={options}
                    classNames={{
                      container: (state) =>
                        `!border-[1px] !border-base-content/20 !bg-base-100 textarea !px-2 !py-1 !z-100 ${
                          state.isFocused ? "!ring-1 !ring-base-content/20" : ""
                        }`,
                      control: (state) =>
                        `!rounded-full !border-0 !bg-base-100 ${
                          state.isFocused ? "!ring-0 !ring-base-content/20" : ""
                        }`,
                      valueContainer: () => `bg-transparent text-base-content`,
                      indicatorsContainer: () =>
                        `bg-transparent text-base-content`,
                      multiValue: () => `!rounded-lg`,
                    }}
                  />
                )}
              />
              {
                <label className="label pb-0">
                  <span className="label-text-alt pb-0 text-red-500">
                    {errors.interests?.message}
                  </span>
                </label>
              }
            </div>
            <div className="form-control">
              <div className="flex w-full flex-row justify-between">
                <label className="label pt-0 text-lg"> soad mai?</label>
                <Controller
                  control={control}
                  name={"soad"}
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <div className="join">
                      <input
                        className="btn join-item"
                        type="radio"
                        aria-label="soad"
                        onBlur={onBlur} // notify when input is touched
                        onChange={() => onChange(true)} // send value to hook form
                        checked={value === true}
                        ref={ref}
                      />
                      <input
                        className="btn join-item"
                        type="radio"
                        aria-label="mai soad"
                        onChange={() => onChange(false)} // send value to hook form
                        checked={value === false}
                        ref={ref}
                      />
                    </div>
                  )}
                />
              </div>
              {
                <label className="label pb-0">
                  <span className="label-text-alt pb-0 text-red-500">
                    {errors.soad?.message}
                    {errors.root?.serverError?.message}
                  </span>
                </label>
              }
            </div>

            <div
              className={`btn w-full ${
                isValid ? "btn-secondary" : "btn-disabled"
              }`}
              onClick={handleSubmit((data) => mutate(data))}
            >
              {isSubmitting ||
                (status === "loading" && (
                  <span className="loading loading-spinner"></span>
                ))}
              Submit
            </div>
          </div>
          <div className="flex flex-col items-center gap-2"></div>
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerAuthSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
}
