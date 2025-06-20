import axios from "axios";
// import { useLoading } from "../context/LoadingContext";
// import { useAuth } from "../context/AuthContext";
// import { toast } from "react-toastify";
const useAxios = () => {
//   const { startLoading, stopLoading } = useLoading();
//   const { logout } = useAuth();
  const request = async (url: string, options: Record<string, any> = {}) => {
//     if (!url) {
//       throw new Error("URL is required and must be a string.");
//     }
//     startLoading();
//     const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
//     const authToken = storedUser ? storedUser.AuthToken : null;

//     if (authToken) {
//       options.headers = options.headers || {};
//       options.headers["Authorization"] = `Bearer ${authToken}`;
//     }

//     try {
//       const response = await axios(url, options);
//       // console.log(response, "res");
//       if (response?.data?.message === "Login successful" || response?.data?.message === "Quotation Fetched") {
//       } else {
//         // toast.success(response?.data?.message)
//       }
//       return response;
//     } catch (error) {
//       // console.log(error, "erro");

//       if (error instanceof Error && error.hasOwnProperty("response")) {
//         const response = (error as any).response;
//         // console.log(response);

//         if (response && response.status === 401) {
//         //   toast.error(response.data?.message);
//           logout();
//         } else {
//         //   toast.error(response.data?.message);
//         }
//       }
//     } finally {
//       stopLoading();
//     }
  };

  return { request };
};

export default useAxios;
