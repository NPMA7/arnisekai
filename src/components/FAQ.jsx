"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "Apa itu Arnisekai?",
      answer:
        "Arnisekai adalah situs gratis untuk menonton anime sekaligus donghua dan bahkan kamu dapat mengunduh anime atau donghua dengan sub atau dub dalam kualitas ultra HD tanpa registrasi atau pembayaran. Dengan tidak menampilkan iklan apa pun, kami berusaha membuatnya menjadi situs teraman untuk menonton anime dan donghua gratis.",
    },
    {
      question: "Apakah Arnisekai aman?",
      answer:
        "Ya, kami tidak meminta dan mengambil data diri anda. Situs kami hanya untuk menonton dan mengunduh anime dan donghua.",
    },
    {
      question:
        "Faktor apa yang menjadikan Arnisekai sebagai situs terbaik untuk menonton anime dan donghua?",
      answer: "",
      details: [
        {
          title: "Keamanan",
          content:
            "Kami berusaha sebaik mungkin untuk tidak menampilkan iklan di Arnisekai.",
        },
        {
          title: "Perpustakaan konten",
          content:
            "Fokus utama kami adalah anime dan donghua. Kamu dapat menemukan di sini judul-judul populer, klasik, serta judul-judul terbaru dari semua genre seperti aksi, drama, anak-anak, fantasi, horor, misteri, polisi, romansa, sekolah, komedi, musik, game, dan masih banyak lagi.",
        },
        {
          title: "Kualitas/Resolusi",
          content:
            "Semua judul tersedia dalam resolusi yang sangat baik, dengan kualitas terbaik yang mungkin ada. Arnisekai juga dilengkapi dengan pengaturan kualitas, sehingga kamu bisa menikmati streaming anime tanpa masalah, tidak peduli seberapa cepat kecepatan internet kamu.",
        },
        {
          title: "Pengalaman Streaming",
          content:
            "Dibandingkan dengan situs streaming anime lainnya, kecepatan loading di Arnisekai lebih cepat. Selain itu, mengunduh anime juga sangat mudah seperti menonton streaming.",
        },
        {
          title: "Update Konten",
          content:
            "Kami selalu memperbarui judul-judul anime terbaru dan memenuhi permintaan pengguna setiap hari, jadi jangan khawatir, kamu tidak akan kehabisan tontonan seru yang akan ditonton di Arnisekai.",
        },
        {
          title: "Antarmuka Pengguna",
          content:
            "Antarmuka pengguna kami dirancang agar mudah digunakan oleh siapa saja. Kamu dapat dengan mudah memahami cara navigasi situs kami setelah melihat sekilas.",
        },
        {
          title: "Kompatibilitas Perangkat",
          content:
            "Arnisekai bekerja dengan baik pada perangkat seluler maupun desktop. Namun, kami merekomendasikan penggunaan desktop agar pengalaman streaming menjadi lebih lancar.",
        },
        {
          title: "Layanan Pelanggan",
          content:
            "Kami selalu siap membantu selama 24/7. Kamu dapat selalu menghubungi kami untuk mendapatkan bantuan, atau menanyakan sesuatu. Kami terkenal karena layanan pelanggan yang sangat baik, di mana kami cepat dalam memperbaiki tautan yang rusak atau mengunggah konten yang diminta.",
        },
      ],
    },
  ];

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="max-w-5xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 inline-block">
          Pertanyaan yang Sering Diajukan
        </h2>
        <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mt-4 rounded-full"></div>
        <p className="text-gray-300 mt-6 text-lg max-w-3xl mx-auto">
          Temukan jawaban untuk pertanyaan-pertanyaan umum tentang Arnisekai, situs anime dan donghua terbaik untuk kamu.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-gray-800/30 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
          >
            <button
              onClick={() => toggleAccordion(index)}
              className="w-full p-5 text-left flex justify-between items-center gap-4"
            >
              <h3 className="text-lg md:text-xl font-semibold text-white">
                {faq.question}
              </h3>
              <div
                className={`bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-1 transition-transform duration-300 ${
                  activeIndex === index ? "rotate-180" : ""
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </button>

            <AnimatePresence>
              {activeIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="p-5 pt-0 text-gray-300 border-t border-gray-700/50">
                    {faq.answer && <p className="my-4">{faq.answer}</p>}

                    {faq.details && (
                      <div className="space-y-6 mt-4">
                        {faq.details.map((detail, detailIndex) => (
                          <div key={detailIndex} className="bg-gray-700/30 rounded-lg p-4 hover:bg-gray-700/40 transition-colors">
                            <h4 className="text-blue-400 font-medium mb-2">
                              {detail.title}:
                            </h4>
                            <p className="text-gray-300">{detail.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <div className="text-center mt-14 pt-10 border-t border-gray-800">
        <div className="inline-block relative">
          <p className="text-xl font-bold text-white">
            Terima Kasih Telah Menggunakan Arnisekai!
          </p>
          <div className="absolute -top-2 -right-2 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
          <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: "0.5s" }}></div>
        </div>
        <p className="text-gray-400 mt-2">
          Masih punya pertanyaan? Silakan hubungi kami melalui halaman Kontak.
        </p>
      </div>
    </div>
  );
};

export default FAQ;
