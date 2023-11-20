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
    //해당 시간 동안은 캐시된 데이터를 재사용하고 서버에 다시 요청하지 않음
    //ex)staleTime을 5초로 설정하면, 해당 데이터를 처음 가져온 후 5초 동안은 캐시된 데이터를 사용하고,
    //5초 후에는 데이터가 'stale' 상태가 되어 다음 데이터 요청시 서버에 다시 요청
    //기본값 0
    staleTime: 5000,
    //데이터와 캐시를 얼마동안 유지할지 설정 기본값 5분
    // gcTime: 30000,
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
