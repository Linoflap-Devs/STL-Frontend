// src/pages/Protected/operators/[slug].tsx

import React, { useEffect } from "react";
import { useRouter } from "next/router";
import OperatorsView from "../operators-view";

const OperatorSlugPage = () => {
  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    console.log("Router query updated:", router.query);
  }, [router.query]);

  // Wait for slug to be available (on first render, it's undefined)
  if (!slug || Array.isArray(slug)) {
    return <p>Loading...</p>;
  }

  return <OperatorsView slug={slug} />;
};

export default OperatorSlugPage;
