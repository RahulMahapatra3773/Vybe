import { setMessages } from "@/redux/chatSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetMessagesPaginated = (page = 1, limit = 20) => {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector(store => store.auth);

  useEffect(() => {
    if (!selectedUser?._id) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/v1/message/all/${selectedUser._id}?page=${page}&limit=${limit}`,
          { withCredentials: true }
        );

        if (res.data.success) {
          if (page === 1) {
            dispatch(setMessages(res.data.messages));
          } else {
            dispatch(setMessages(prev => [...res.data.messages, ...prev]));
          }
        }
      } catch (error) {
        console.log("Error fetching paginated messages:", error);
      }
    };

    fetchMessages();
  }, [selectedUser, page]);
};

export default useGetMessagesPaginated;
