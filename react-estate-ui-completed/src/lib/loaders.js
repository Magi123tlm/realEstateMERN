import { defer } from "react-router-dom";

export const singlePageLoader = async ({ request, params }) => {
  try {
    const response = await fetch(
      `http://localhost:3210/api/posts/${params.id}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "SOmething is wrogn buddy");
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
    return { error: error.message || "Failed to load post data." };
  }
};

// export const listPageLoader = async ({ request, params }) => {
//   const query = request.url.split("?")[1];
//   const response = await fetch("http://localhost:3210/api/posts?" + query);
//   const result = await response.json();
//   return result;
// };

export const listPageLoader = async ({ request, params }) => {
  const query = request.url.split("?")[1];
  return defer({
    postResponse: fetch("http://localhost:3210/api/posts?" + query).then(
      (response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      }
    ),
  });
};

export const profilePageLoader = async () => {
  return defer({
    postResponse: fetch("http://localhost:3210/api/users/profilePosts", {
      method: "GET",
      credentials: "include",
    }).then((response) => {
      if (!response.ok) {
        throw new Error("error error");
      }
      return response.json();
    }),
  });
};
