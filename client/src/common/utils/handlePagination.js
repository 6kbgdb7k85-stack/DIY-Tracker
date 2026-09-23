export function handleDeletePagination(pageData, getCall) {
  if (pageData.total - 1 > (pageData.page - 1) * pageData.perPage) {
    getCall({
      searchParams: [
        { key: "page", value: pageData.page },
        { key: "per_page", value: pageData.perPage },
      ],
    });
  } else {
    getCall({
      searchParams: [
        {
          key: "page",
          value: pageData.page > 1 ? pageData.page - 1 : 1,
        },
        { key: "per_page", value: pageData.perPage },
      ],
    });
  }
}

export function handleAddPagination(pageData, getCall) {
  const searchParams = [
    { key: "page", value: pageData.page },
    { key: "perPage", value: pageData.perPage },
  ];
  console.log("total:",pageData.total+1)
  console.log("page:",pageData.page)
  console.log("perPage:",pageData.perPage)
  if (pageData.total + 1 > pageData.page * pageData.perPage) {
    searchParams[0].value += 1;
  }
  getCall({ searchParams });
}
