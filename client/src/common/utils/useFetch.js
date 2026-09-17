import { useEffect, useState } from "react";

/**
 * @param {string} url
 * @param {"GET"||"POST"||"PATCH"||"DELETE"} method
 * @param {boolean} onLoad
 * @returns {Object,boolean,function,function}
 */

//simplify fetch into a streamlined setup for repeated use
//defaulting method to GET and onLoad to true so GET requests meant to run on load only need the url provided
export default function useFetch(url, method = "GET", onLoad = true) {
  const [loading, setLoading] = useState(onLoad);
  const [response, setResponse] = useState(null);

  useEffect(() => {
    if (onLoad) {
      runFetch();
    }
  }, []);

  function runFetch(body) {
    setLoading(true);
    fetch('/api/'+url, compileFetchOptions(body))
      .then((r) => {
        if (r.ok) {
          return r.json();
        }
      })
      .then((data) => {setResponse(data); setLoading(false)})
      .catch((error) => {console.error(error); setLoading(false)});
  }

  //compile options for fetch based on method and supplied body
  function compileFetchOptions(body) {
    const params = {
      method,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
    if (method === "GET") {
      return params;
    }
    if (method === "POST" || method === "PATCH") {
      return {
        ...params,
        headers: { ...params.headers, "Content-Type": "application/json" },
        body: JSON.stringify(body),
      };
    } else if (method === "DELETE") {
      return params;
    } else {
      console.warn("Invalid config: attempting fetch with default params");
      return params;
    }
  }

  return { response, loading, runFetch, setResponse }; //returning setResponse for cases where component's useEffect is based on response
}
