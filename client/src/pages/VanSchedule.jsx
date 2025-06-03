import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const VanSchedule = () => {
  const sheetEmbedUrl =
    "https://docs.google.com/spreadsheets/d/1_naPPaHl2Tkhzty6MN6VKEvWsbE-aWlgdETIhhd990I/edit?gid=734187600#gid=734187600";

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <div className="mt-12 mx-auto w-11/12 max-w-6xl">
          <h1 className="text-[#5937E0] text-[50px] font-work-sans font-bold mb-8 md:text-[40px]">
            Van Schedule
          </h1>
          <div className="w-full aspect-[4/3] border border-gray-200 rounded-lg overflow-hidden">
            <iframe
              src={sheetEmbedUrl}
              title="Van Schedule"
              className="w-full h-full"
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VanSchedule;
