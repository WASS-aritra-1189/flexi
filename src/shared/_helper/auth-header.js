export async function authHeader(type) {
  const token = localStorage.getItem("token");
  if (token) {
    if (type === "FormData") {
      return {
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + token,
      };
    } else {
      return { Authorization: "Bearer " + token };
    }
  } else {
    localStorage.clear();
  }
}
