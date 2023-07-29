import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
// import Link from "next/link";
import { api } from "~/utils/api";
import Image from "next/image";
import type { GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "~/server/auth";
import { prisma } from "~/server/db";

export default function Home() {
  // const hello = api.example.hello.useQuery({ text: "from tRPC" });
  const { data: sessionData, status } = useSession();
  return (
    <>
      <Head>
        <title>soad mai?</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {status === "loading" && (
        <div className="fixed inset-0 z-50 flex h-full w-full items-center justify-center bg-base-100 bg-opacity-90">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="loading loading-spinner loading-lg"></div>
          </div>
        </div>
      )}
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-secondary-content sm:text-[5rem]">
            <span className="text-[#8e0e19]"></span>
            <span className="delay-75 duration-300 ease-in-out hover:text-[#8e0e19]">
              {"soad "}
            </span>
            <span className="delay-75 duration-300 ease-in-out hover:text-[#8e0e19]">
              mai?
            </span>
          </h1>
          <div className="grid grid-cols-1 gap-4 text-base-content sm:grid-cols-3 md:gap-8 ">
            <div
              className={`flex max-w-xs flex-col gap-4 rounded-xl bg-gray-500/50 p-4 transition delay-75 duration-300 ease-in-out ${
                sessionData &&
                "bg-primary/60 hover:bg-primary/70 hover:drop-shadow-2xl"
              }`}
            >
              <h3 className="text-2xl font-bold">Find Out?</h3>
              <div className="text-lg text-base-content">
                แอบชอบแต่ไม่รู้ว่าเขาโสดรึเปล่า?
              </div>
            </div>
            <div
              className={`flex max-w-xs flex-col gap-4 rounded-xl bg-gray-500/50 p-4 transition delay-75 duration-300 ease-in-out ${
                sessionData &&
                "bg-primary/60 hover:bg-primary/70 hover:drop-shadow-2xl"
              }`}
            >
              <h3 className="text-2xl font-bold">Get Listed?</h3>
              <div className="text-lg text-base-content">
                บอกให้โลกรู้ว่าเราโสด
              </div>
            </div>
            <div
              className={`flex max-w-xs flex-col gap-4 rounded-xl bg-gray-500/50 p-4 transition delay-75 duration-300 ease-in-out ${
                sessionData &&
                "bg-primary/60 hover:bg-primary/70 hover:drop-shadow-2xl"
              }`}
            >
              <h3 className="text-2xl font-bold">Taken?</h3>
              <div className="text-lg text-base-content">มีเจ้าของแล้วจ้า</div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            {/* <p className="text-2xl text-white">
              {hello.data ? hello.data.greeting : "Loading tRPC query..."}
            </p> */}
            <AuthShowcase />
          </div>
        </div>
      </main>
    </>
  );
}

function AuthShowcase() {
  const session = useSession();
  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: typeof window !== undefined }
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {session.data && <span>Logged in as {session.data.user.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      {session.data ? (
        <button className="btn btn-secondary" onClick={() => void signOut()}>
          {"Sign out"}
        </button>
      ) : (
        <button
          className="btn btn-secondary"
          onClick={() => {
            void signIn("instagram");
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
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerAuthSession(context);
  if (!session?.user?.id) {
    // not logged in
    return {
      props: {},
    };
  }
  // check if user is onboarded
  const user = await prisma.user.findFirst({
    where: {
      id: session.user.id,
    },
    select: {
      isOnboarded: true,
      emailVerified: true,
    },
  });
  if (!user?.emailVerified) {
    // not verified
    return {
      redirect: {
        destination: "/verify",
        permanent: true,
      },
    };
  }
  if (!user?.isOnboarded) {
    //onboarded
    return {
      // not onboarded
      redirect: {
        destination: "/onboarding",
        permanent: true,
      },
    };
  }

  // other cases (verified and onboarded)
  return {
    props: {},
  };
}
