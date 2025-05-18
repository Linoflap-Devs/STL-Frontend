import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { fetchOperatorById } from "~/services/userService";
import OperatorsView from "../operators-view";
import { Operator } from "~/types/types";

const OperatorSlugPage = () => {
  const router = useRouter();
  const { slug, id } = router.query;

  const [operator, setOperator] = useState<Operator | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const operatorId = typeof id === "string" ? Number(id) : null;

    if (!slug || typeof slug !== "string" || !operatorId) return;

    console.log("Fetching operator for slug:", slug, "and ID:", operatorId);

    fetchOperatorById(operatorId)
      .then((data) => {
        setOperator(data);
      })
      .catch((err) => {
        console.error("Error fetching operator by ID:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug, id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!operator) {
    return <p className="text-center text-red-500">No operator found.</p>;
  }

  return <OperatorsView operator={operator} slug={slug as string} />;
};

export default OperatorSlugPage;
