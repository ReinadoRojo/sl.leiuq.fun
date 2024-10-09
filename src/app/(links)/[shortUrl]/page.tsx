"use client";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { shortUrl } = useParams();

  useEffect(() => {
    fetch(`/api/visit?shortUrl=${shortUrl}`)
      .then((res) => res.json())
      .then((data) => {
        window.location.href = data.url;
      })
      .catch((err) => console.error(err));
  }, [shortUrl]);

  useEffect(() => {
    setTimeout(() => {
      document.getElementById("failed-redirect")?.classList.remove("hidden");

      const a = document.querySelector(
        "#failed-redirect-a"
      ) as HTMLAnchorElement;
      a.href = `/api/manual?shorturl=${shortUrl}`;
    }, 6000);
  }, [shortUrl]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-xl font-bold">Redirecting...</h1>
      <div id="failed-redirect" className="hidden">
        <p>Seems like something went wrong - Click below to be redirected</p>
        <br />
        <a href={""} id="failed-redirect-a">
          ! HERE !
        </a>
      </div>
      <p>Please wait while we redirect you</p>
    </div>
  );
}
