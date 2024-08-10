import env from "~/env";

export const isAuthorized = (request: Request) => {
  const header = request.headers.get("Authorization");

  if (!header) return false;

  const base64 = header.replace("Basic ", "");
  const [username, password] = Buffer.from(base64, "base64")
    .toString()
    .split(":");

  return username === env.HEROVIZ_USERNAME && password === env.HEROVIZ_PASSWORD;
};
