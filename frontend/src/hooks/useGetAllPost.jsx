import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setPosts } from "@/redux/postSlice";

const useGetFeedPosts = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        let isMounted = true; // to prevent dispatch after unmount

        const fetchFeedPosts = async () => {
            try {
                const res = await axios.get(
                    "https://vybe-1.onrender.com/api/v1/post/feed",
                    { withCredentials: true }
                );

                if (res.data.success && isMounted) {
                    dispatch(setPosts(res.data.posts));
                }
            } catch (error) {
                console.error("Failed to fetch feed posts:", error);
            }
        };

        fetchFeedPosts();

        return () => {
            isMounted = false; // cleanup on unmount
        };
    }, [dispatch]);
};

export default useGetFeedPosts;
