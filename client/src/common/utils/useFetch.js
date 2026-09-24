import { useEffect, useState } from "react";
const API_URL = import.meta.env.VITE_API_URL

/**
 * @param {string} url
 * @param {"GET"||"POST"||"PATCH"||"DELETE"} method
 * @param {boolean} onLoad
 * @returns {Object,boolean,function,function}
 */

// simplify fetch into a streamlined setup for repeated use
// defaulting method to GET and onLoad to true so GET requests meant to run on load only need the url provided
export default function useFetch(url, method = "GET", onLoad = true) {
  const [loading, setLoading] = useState(onLoad);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (onLoad && localStorage.getItem("token")) {
      runFetch();
    } else if (onLoad) {
      setLoading(false);
    }
  }, []);

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
          throw new Error(data.error);
        }

        return data;
      })
      .then((data) => {
        setResponse(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }

  function compileUrl(urlParams = [], searchParams = []) {
    let parsedUrl = `${API_URL||''}/api/${url}`;
    if (urlParams.length) {
      urlParams.forEach((param) => {
        parsedUrl = parsedUrl.replace(param.key, param.value);
      });
    }
    
    if(searchParams.length){
      parsedUrl+="?"
      searchParams.forEach(param=>{
        parsedUrl+=`&${param.key}=${param.value}`
      })
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

  return { response, loading, runFetch, setResponse }; // returning setResponse for greater control when using response in useEffect blocks
}
