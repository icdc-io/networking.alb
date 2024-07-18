export const webRoutesPath = (menuGroup = ":menuGroup") =>
  `/${menuGroup}/web_routes`;
export const detailsPath = (menuGroup = ":menuGroup", id = ":id") =>
  `/${menuGroup}/web_routes/${id}`;
export const createroutePath = (menuGroup = ":menuGroup") =>
  `/${menuGroup}/web_routes/create`;
export const editroutePath = (menuGroup = ":menuGroup", id = ":id") =>
  `/${menuGroup}/web_routes/edit/${id}`;

export const certificatesPath = (menuGroup = ":menuGroup") =>
  `/${menuGroup}/certificates`;
export const createCertificatePath = (menuGroup = ":menuGroup") =>
  `/${menuGroup}/certificates/create`;
export const editCertificatePath = (menuGroup = ":menuGroup", id = ":id") =>
  `/${menuGroup}/certificates/edit/${id}`;
export const certificateDetailsPath = (menuGroup = ":menuGroup", id = ":id") =>
  `/${menuGroup}/certificates/${id}`;
