import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
const API_URL = import.meta.env.VITE_API_URL;

/**
 * @param {string} url
 * @param {"GET"||"POST"||"PATCH"||"DELETE"} method
 * @param {boolean} onLoad
 * @returns {Object,Object,boolean,function,function,function}
 */

// simplify fetch into a streamlined setup for repeated use
// defaulting method to GET and onLoad to true so GET requests meant to run on load only need the url provided
export default function useFetch(url, method = "GET", onLoad = true) {
  const [loading, setLoading] = useState(onLoad);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const PUBLIC_ROUTES = ["login", "signup"];

  useEffect(() => {
    if (onLoad && localStorage.getItem("token")) {
      runFetch();
    } else if (onLoad) {
      setLoading(false);
    }
  }, []);

  function isPublicRoute(path) {
    let publicRoute = false;
    PUBLIC_ROUTES.forEach((route) => {
      if (path.includes(route)) {
        publicRoute = true;
        return;
      }
    });
    return publicRoute;
  }

  function runFetch(body = {}) {
    const { urlParams = [], searchParams = [], ...payload } = body ?? {};

    setLoading(true);
    fetch(compileUrl(urlParams, searchParams), compileFetchOptions(payload))
      .then(async (r) => {
        if (r.status === 204) {
          return "delete successful";
        }
        const data = await r.json();
        if (!r.ok) {
          if (r.status === 401 && !isPublicRoute(pathname)) {
            navigate("/");
          }
          throw new Error(data.msg || data.error);
        }

        return data;
      })
      .then((data) => {
        setResponse(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }

  function compileUrl(urlParams = [], searchParams = []) {
    let parsedUrl = `${API_URL || ""}/api/${url}`;
    if (urlParams.length) {
      urlParams.forEach((param) => {
        parsedUrl = parsedUrl.replace(param.key, param.value);
      });
    }

    if (searchParams.length) {
      parsedUrl += "?";
      searchParams.forEach((param) => {
        parsedUrl += `&${param.key}=${param.value}`;
      });
    }
    return parsedUrl;
  }

  // compile options for fetch based on method and supplied body
  function compileFetchOptions(body) {
    const { method: bodyMethod, ...requestBody } = body ?? {};
    const compiledMethod = bodyMethod || method; // allows for using the same useFetch for multiple methods like get and patch depending on circumstance
    const token = localStorage.getItem("token");
    const params = {
      method: compiledMethod,
      headers: { Authorization: `Bearer ${token}` },
    };
    if (compiledMethod === "GET") {
      return params;
    }
    if (compiledMethod === "POST" || compiledMethod === "PATCH") {
      return {
        ...params,
        headers: { ...params.headers, "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      };
    } else if (compiledMethod === "DELETE") {
      return params;
    } else {
      console.warn("Invalid config: attempting fetch with default params");
      return params;
    }
  }

  return { response, error, loading, runFetch, setResponse, setError }; // returning setResponse for greater control when using response in useEffect blocks
}
