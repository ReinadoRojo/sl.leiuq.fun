const { NEXT_PUBLIC_UMAMI_WEBSITE_ID } = process.env;

export const uTrack = async (
  name: string,
  data?: { [key: string]: string | number | Date }
) => {
  try {
    console.log("firing track", name, data);

    fetch("https://cloud.umami.is/api/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 sl.leiuq.fun/" + process.version,
      },
      body: JSON.stringify({
        type: "event",
        payload: {
          website: NEXT_PUBLIC_UMAMI_WEBSITE_ID,
          name,
          data,
        },
      }),
    });
  } catch (_) {
    console.log("umami error");
  }
};
