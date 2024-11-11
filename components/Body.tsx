"use client";
import React from "react";
import { motion } from "framer-motion";
import SendTokensCard from "./SendTokenCard";
import SignMessageCard from "./SignMessageCard";
import WalletCard from "./WalletCard";

const Body = () => {
    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-5 lg:p-6 lg:px-0">
            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 100 }}
                transition={{ duration: 0.8 }}
            >
                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 1.01 }}>
                    <WalletCard />
                </motion.div>
                {/* <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 1.01 }}>
                    <SendTokensCard />
                </motion.div>
                <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 1.01 }}
                    className="md:col-span-2"
                >
                    <SignMessageCard />
                </motion.div> */}
            </motion.div>
        </div>
    );
};

export default Body;

