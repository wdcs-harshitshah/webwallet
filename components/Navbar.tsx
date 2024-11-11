'use client'
import { Box } from "lucide-react";
import React, { useState } from "react";
import { ModeToggle } from "./ui/theme-button";

const Navbar = () => {



  return (
    <nav className="flex justify-between items-center py-4">
      <div className="flex items-center gap-2">
        <Box className="size-8" />
        <div className="flex flex-col gap-4">
          <span className="tracking-tighter text-3xl font-extrabold text-primary flex gap-2 items-center">
            My Web 3 Wallet
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4">
      
        <ModeToggle />
      </div>
    </nav>
  );
};

export default Navbar;
