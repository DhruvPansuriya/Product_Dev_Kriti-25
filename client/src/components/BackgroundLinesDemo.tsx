import React from "react";
import  BackgroundLines  from "./ui/background-lines.tsx";
import Navbar from "./Navbar.tsx";
export default function BackgroundLinesDemo() {
  return (
    <BackgroundLines className="flex items-center justify-center w-full flex-col px-4">
      <Navbar/>
      <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-2xl md:text-4xl lg:text-7xl font-sans py-2 md:py-10  font-bold tracking-tight">
      Speak Your Idea. <br /> Watch It Turn Into a Website..
      </h2>
      <p className="max-w-xl mx-auto text-sm md:text-lg text-neutral-700 dark:text-neutral-400 text-center">
      Sign Up now to start building amazing websites...
      </p>
    </BackgroundLines>
  );
}
