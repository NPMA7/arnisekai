"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function DonghuaSearchPageWithPagination() {
  const params = useParams();
  const router = useRouter();
  const searchQuery = params.query || "";
  const page = params.page || "1";
  
  useEffect(() => {
    // Redirect to the search page with the page parameter in the query string
    router.replace(`/donghua/search/${searchQuery}`);
  }, [searchQuery, page, router]);
  
  return null;
} 