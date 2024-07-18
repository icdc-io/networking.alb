import React from "react";
import { useSelector } from "react-redux";
import { copyInfo } from "../utilities/copyInfo";
import { getPublicHostname } from "../utilities/getPublicHostname";

const CopyPublicHostname = () => {
  const user = useSelector((state) => state.host.user);
  const baseUrls = useSelector((state) => state.host.baseUrls);

  const publicHostname = getPublicHostname(user, baseUrls);

  return (
    <span>
      {publicHostname}
      {copyInfo(publicHostname)}
    </span>
  );
};

export default CopyPublicHostname;
