  "use client";
  import React, { useState, useEffect } from "react";
  import Link from "next/link";
  import Navbar from "@/components/header/Navbar";
  import { CardAnime } from "@/components/main/Card";
  import { Pagination } from "@/utilities/pagination/Pagination";
  
  const completeAnime = () => {
    const [page, setPage] = useState(1);
    const [animeList, setAnimeList] = useState({ data: [] }); // Menginisialisasi animeList sebagai objek dengan properti data berupa array kosong
  
    useEffect(() => {
      const fetchAnimeList = async () => {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL_ANIME}/complete-anime/${page}`
        );
        const data = await response.json();
        setAnimeList(data);
      };
  
      fetchAnimeList();
    }, [page]);
  
    return (
      <>
        <main className="min-h-screen pb-20 bg-gray-900 text-gray-300">
          <Navbar />
          <section className="p-4">
              <div className="flex justify-between items-center mb-4">
                <p className="text-gray-300 text-lg font-bold">Complete Anime</p>
                <Link
                  href={"#"}
                  className="bg-gray-800 px-4 py-2 rounded text-gray-300"
                >
                  Jadwal Tayang Anime
                </Link>
              </div>
              <CardAnime api={animeList.data}  simbolRate={"💫"} episode={" Episode"} />
          </section>
          <Pagination api={animeList}  page={page} setPage={setPage} />
        </main>
      </>
    );
  };
  
export default completeAnime;
