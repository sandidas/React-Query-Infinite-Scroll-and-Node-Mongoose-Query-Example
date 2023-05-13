import React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

const Home = () => {
  // step 1:
  const fetchData = async (pageParam = 0) => {
    const response = await fetch(`http://localhost:5000/api/notification/notifications?cursor=${pageParam}`);
    const data = await response.json();
    return data;
  };

  const { data, fetchNextPage, refetch, hasNextPage, isFetching, isFetchingNextPage, status } = useInfiniteQuery({
    queryKey: ["notifications"],
    queryFn: ({ pageParam = 0 }) => fetchData(pageParam),
    getNextPageParam: (lastPage, allPages) => {
      // console.log("lastPage", lastPage?.notifications.length);
      // console.log("allPages", allPages);
      if (lastPage?.notifications.length < 10) {
        return false;
      } else {
        return lastPage.nextCursor;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes (data considered fresh for 5 minutes)
    cacheTime: 5 * 60 * 1000, // 5 minutes (data expires and triggers background fetch after 10 minutes)
  });

  return status === "loading" ? (
    <p>Loading...</p>
  ) : status === "error" ? (
    "Error loading....."
  ) : (
    <>
      {data?.pages?.map((page, pageIndex) => (
        <div key={pageIndex}>
          {page?.notifications?.map((notification: INotificationAgent, index: number) => (
            <NotificationItem key={index} item={notification} />
          ))}
        </div>
      ))}
      <div>
        <button onClick={() => fetchNextPage()} disabled={!hasNextPage || isFetchingNextPage}>
          {isFetchingNextPage ? Loading.... : hasNextPage ? "Load More" : "Nothing more to load"}
        </button>
      </div>
      <div>{isFetching && !isFetchingNextPage ? <>Loading.... </> : null}</div>
    </>
  );
};

export default Home;
