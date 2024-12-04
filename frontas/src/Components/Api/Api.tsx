import axios, { ResponseType } from "axios"; // Import ResponseType

const api = axios.create({
  baseURL: "https://localhost:7285/",
});

const authConfig = {
  headers: {
    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
  },
};

const getRequest = async (url: string, postData: any, responseType: ResponseType = "json") => {
  const authorizationToken = `Bearer ${sessionStorage.getItem("token")}`;

  const { data } = await api.get(url + postData, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: authorizationToken,
    },
    responseType, // Use responseType of type ResponseType
  });

  return data;
};

async function makePostRequest(url: string, postData: any) {
  const authorizationToken = `Bearer ${sessionStorage.getItem("token")}`;

  try {
    const { data } = await api.post<any>(url, postData, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: authorizationToken,
      },
    });

    return data;
  } catch (error) {
    await handleError(error);
  }
}

async function makePutRequest(url: string, postData: any) {
  const authorizationToken = `Bearer ${sessionStorage.getItem("token")}`;

  try {
    const { data } = await axios.put<any>(url, postData, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: authorizationToken,
      },
    });

    return data;
  } catch (error) {
    await handleError(error);
  }
}


async function makeDeleteRequest(url: string) {
  const authorizationToken = `Bearer ${sessionStorage.getItem("token")}`;

  try {
    const { data, status } = await axios.delete<any>(url, {
      headers: {
        Accept: "application/json",
        Authorization: authorizationToken,
      },
    });

    console.log("response is: ", data);
    console.log("response status is: ", status);

    return data;
  } catch (error) {
    await handleError(error);
  }
}

async function handleError(error: any) {
  if (axios.isAxiosError(error)) {
    console.log("error message: ", error.message);
    return error.message;
  } else {
    console.log("unexpected error: ", error);
    return "An unexpected error occurred";
  }
}

export const logout = () => {
  sessionStorage.clear();
  window.location.href = '/home';
};


export { api, authConfig, makePostRequest, makeDeleteRequest,getRequest,makePutRequest};