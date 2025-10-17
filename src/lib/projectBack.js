// Map current pathnames to project-defined back routes

function match(pathname, pattern) {
  if (pattern.includes(":")) {
    // Convert simple ":param" segments to a regex matcher
    const regex = new RegExp(
      "^" + pattern.replace(/:[^/]+/g, "[^/]+").replace(/\//g, "\\/") + "$"
    );
    return regex.test(pathname);
  }
  return pathname === pattern;
}

export function getBackPath(pathname) {
  // Ordered rules, first match wins
  const rules = [
    { when: "/register", back: "/" },
    { when: "/forget-password", back: "/" },

    { when: "/user-dash", back: "/" },
    { when: "/user-profile", back: "/user-dash" },
    { when: "/blog-details/:id", back: "/user-dash" },

    { when: "/admin-dash", back: "/" },
    { when: "/admin-view-blog", back: "/admin-dash" },
    { when: "/admin-add-blog", back: "/admin-view-blog" },
    { when: "/admin-update-blog/:id", back: "/admin-view-blog" },
    { when: "/admin-manage-users", back: "/admin-dash" },
    { when: "/admin-view-user/:id", back: "/admin-manage-users" },
    { when: "/admin-view-single-blog/:id", back: "/admin-view-blog" },
  ];

  for (const rule of rules) {
    if (match(pathname, rule.when)) return rule.back;
  }
  return "/";
}




