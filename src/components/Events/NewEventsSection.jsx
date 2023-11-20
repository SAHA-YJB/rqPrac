import { useQuery } from "@tanstack/react-query";
import ErrorBlock from "../UI/ErrorBlock.jsx";
import LoadingIndicator from "../UI/LoadingIndicator.jsx";
import EventItem from "./EventItem.jsx";
import { fetchEvents } from "../../util/http.js";

export default function NewEventsSection() {
  const { data, isPending, isError, error } = useQuery({
    //get http요청에는 쿼리키가 항상 있다.
    //쿼리키를 이용해 생성도힌 데이터를 캐시처리
    //키는 배열
    queryKey: ["events"],
    //프로미스를 반환하는 함수를 필요로 한다
    queryFn: fetchEvents,
  });
  let content;

  if (isPending) {
    content = <LoadingIndicator />;
  }

  if (isError) {
    content = (
      <ErrorBlock
        title="An error occurred"
        message={error.info?.message || "데이터를 가져올 수 없습니다."}
      />
    );
  }

  if (data) {
    content = (
      <ul className="events-list">
        {data.map((event) => (
          <li key={event.id}>
            <EventItem event={event} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section className="content-section" id="new-events-section">
      <header>
        <h2>Recently added events</h2>
      </header>
      {content}
    </section>
  );
}
