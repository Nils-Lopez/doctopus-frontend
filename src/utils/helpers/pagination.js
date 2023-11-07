import getContent from "./language";

export const nextPage = (list, currentPage, setNewPage, next, rowSize, page) => {
  if (next) {
    if (list.length > currentPage * rowSize) {
      setNewPage(currentPage + 1);
    }
  } else {
    if (page !== 1) {
      let newPage = currentPage - 1;
      setNewPage(newPage);
    }
  }
};

export const getDocTypes = (docs, i18n, setFiltersOptions, t) => {
  const newOptions = [{ value: "all", label: t("all") }];

  docs.forEach((child) => {
    if (
      child.doc &&
      child.doc.types &&
      child.doc.types[0] &&
      child.doc.types[0].title &&
      getContent(child.doc.types[0].title, i18n.language) !== "Error"
    ) {
      const newOption = {
        value: child.doc.types[0]._id,
        label: getContent(child.doc.types[0].title, i18n.language),
      };
      let unique = true;
      newOptions.forEach((opt) => {
        if (opt.value === newOption.value) unique = false;
      });
      if (unique) {
        newOptions.push(newOption);
      }
    }
  });
  setFiltersOptions([...new Set(newOptions)]);
};

export const filterDocList = (docs, setDocsPage, setFilteredList, filters, filterBtn) => {
  let newFilteredList = [];
  if (filters && filters.value !== "all") {
    docs.forEach((child) => {
      if (
        child.doc &&
        child.doc.types &&
        child.doc.types[0] &&
        child.doc.types[0]._id &&
        filters &&
        filters.value
      ) {
        if (child.doc.types[0]._id === filters.value) {
          newFilteredList.push(child);
        }
      }
    });
    setFilteredList(newFilteredList);
    setDocsPage(1);
  }
  if (!filterBtn || filters.value === "all") setFilteredList(docs);
};

