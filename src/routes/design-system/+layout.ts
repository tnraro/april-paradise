export const load = ({ url }) => {
  url.pathname;
  const pages = [
    { href: "/design-system/text", title: "글자" },
    { href: "/design-system/button", title: "버튼" },
    { href: "/design-system/input", title: "입력" },
    { href: "/design-system/anchor", title: "연결" },
    { href: "/design-system/select", title: "선택" },
  ].map((page) =>
    page.href === url.pathname ? { ...page, current: true } : { ...page, current: false },
  );

  return {
    pages,
  };
};
