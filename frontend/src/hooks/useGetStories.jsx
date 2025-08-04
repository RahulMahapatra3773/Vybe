import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setStories } from "@/redux/storySlice";

const useGetStories = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    let isMounted = true;

    const fetchStories = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/v1/story", {
          withCredentials: true,
        });

        if (res.data.success && isMounted) {
          dispatch(setStories(res.data.stories));
        }
      } catch (err) {
        console.error("Error fetching stories:", err);
      }
    };

    fetchStories();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);
};

export default useGetStories;
