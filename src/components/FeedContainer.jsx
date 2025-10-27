import React, { useEffect, useState } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { Base_URL } from "../utils/constants";
import { setLoading } from "../Store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { addFeed } from "../Store/feedSlice";

const FeedContainer = () => {
  const [moveFeed, setMoveFeed] = useState(0);
  const dispatch = useDispatch();
  const feedData = useSelector((state => state.feed))

  useEffect(() => {
    fetchFeedUsers();
  }, []);

  const fetchFeedUsers = async () => {
    if(feedData.length > 0) return;
    dispatch(setLoading(true));
    try {
      const response = await axios.get(`${Base_URL}/feed`, {
        withCredentials: true,
      });
      console.log("Feed users fetched:", response.data);
      
      dispatch(addFeed(response.data.data));
    } catch (err) {
      console.error("Error fetching feed users:", err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="flex justify-center items-center h-[calc(100vh-10rem)] overflow-hidden">
      <AnimatePresence mode="wait">
        {feedData.length > 0 && moveFeed < feedData.length ? (
          <motion.div
            key={feedData[moveFeed]._id || moveFeed}
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, x: 150, rotate: 8 }}
            transition={{ duration: 0.4 }}
            className="flex justify-center items-center"
          >
            <UserCard
              feedData={feedData[moveFeed]} 
              setMoveFeed={setMoveFeed}
              moveFeed={moveFeed}
            />
          </motion.div>
        ) : (
          <motion.div
            key="end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xl font-semibold text-base-content"
          >
            🎉 You’ve reached the end of the feed!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FeedContainer;
