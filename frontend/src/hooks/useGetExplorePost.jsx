import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setPosts } from "@/redux/postSlice";

const useGetExplorePost = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        let isMounted = true;

        const fetchExplorePosts = async () => {
            try {
                const res = await axios.get(
                    "https://vybe-1.onrender.com/api/v1/post/explore",
                    { withCredentials: true }
                );
                if (res.data.success && isMounted) {
                    dispatch(setPosts(res.data.posts));
                }
            } catch (error) {
                console.error("Error fetching explore posts:", error);
            }
        };

        fetchExplorePosts();

        return () => {
            isMounted = false;
        };
    }, [dispatch]);
};

export default useGetExplorePost;
