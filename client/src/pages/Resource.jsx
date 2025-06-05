import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const VanSchedule = () => {
  const driveEmbedUrl =
    "https://drive.google.com/file/d/15e67OtkgaQHt8ln0RrdYVmQ2EeYO7Tcy/preview";
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <div className="mt-12 mx-auto w-11/12 max-w-6xl">
          <h1 className="text-[#5937E0] text-[50px] font-work-sans font-bold mb-8 md:text-[40px]">
            Resource
          </h1>
          <h2 className="text-black text-[42px] font-work-sans font-bold mb-8 md:text-[40px]">
            CSC Driver Training Video
          </h2>
          <div className="w-full aspect-[4/3] border border-gray-200 rounded-lg overflow-hidden">
            <iframe
              src={driveEmbedUrl}
              title="Resource Video"
              className="w-full h-full"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VanSchedule;
