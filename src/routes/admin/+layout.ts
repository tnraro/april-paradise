export const load = async ({ url, data }) => {
  const pages = [
    { pathname: "/admin", title: "관리 페이지" },
    { pathname: "/admin/runners", title: "러너 목록", subtree: true },
  ].map((page) => ({
    ...page,
    current: page.subtree ? url.pathname.startsWith(page.pathname) : url.pathname === page.pathname,
  }));

  return {
    ...data,
    pages,
  };
};
