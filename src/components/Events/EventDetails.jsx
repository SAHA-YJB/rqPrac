import { Link, Outlet, useNavigate, useParams } from "react-router-dom";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { deleteEvent, fetchEvent, queryClient } from "../../util/http.js";
import Header from "../Header.jsx";
import ErrorBlock from "../UI/ErrorBlock.jsx";
import LoadingIndicator from "../UI/LoadingIndicator.jsx";
import Modal from "../UI/Modal.jsx";

export default function EventDetails() {
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const { data, isError, isPending, error } = useQuery({
    queryKey: ["events", id],
    queryFn: ({ signal }) => fetchEvent({ signal, id }),
  });

  const {
    mutate,
    isPending: isPendingDeletion,
    isError: isErrorDeletiong,
    error: deleteError,
  } = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      //exact: true를 사용하면 정확히 일치하는 쿼리키만 무효화
      queryClient.invalidateQueries({
        queryKey: ["events"],
        //쿼리를 무효화한 후 어떻게 다시 가져올지를 지정
        // "always": 항상 다시 가져옴 무효화된 쿼리와 관련된 모든 구성 요소에서 쿼리를 다시 가져옴
        // "inactive": 화면에 표시되지 않는 구성 요소에서만 쿼리를 다시 가져옴
        // "idle": 현재 'idle' 상태인 쿼리만 다시 가져옴 즉, 초기 로드가 아직 수행되지 않은 쿼리나, 데이터가 더 이상 필요하지 않아 다시 가져오지 않는 쿼리를 대상
        // "none": 쿼리를 다시 가져오지 않습니다. 쿼리는 무효화 / 쿼리 데이터가 다음에 필요할 때까지 다시 가져오는 것을 지연
        refetchType: "none",
      });
      navigate("/events");
    },
  });

  const startDeleteHandler = () => {
    setIsDeleting(true);
  };
  const stopDeleteHandler = () => {
    setIsDeleting(false);
  };
  const deleteHandler = () => {
    mutate({ id });
  };

  let content;

  if (isPending) {
    content = (
      <div id="event=details-content" className="center">
        <LoadingIndicator />
      </div>
    );
  }

  if (isError) {
    content = (
      <div id="event=details-content" className="center">
        <ErrorBlock
          title="데이터를 가져오지 못하고 있어요!"
          message={error.info?.message || "데이터를 가져올 수 없습니다."}
        />
      </div>
    );
  }

  if (data) {
    content = (
      <>
        <header>
          <h1>{data?.title}</h1>
          <nav>
            <button onClick={startDeleteHandler}>Delete</button>
            <Link to="edit">Edit</Link>
          </nav>
        </header>
        <div id="event-details-content">
          <img src={`http://localhost:3000/${data?.image}`} alt={data.title} />
          <div id="event-details-info">
            <div>
              <p id="event-details-location">{data?.location}</p>
              <time dateTime={`Todo-DateT$Todo-Time`}>
                {data?.date} @ {data?.time}
              </time>
            </div>
            <p id="event-details-description">{data?.description}</p>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      {isDeleting && (
        <Modal onClose={stopDeleteHandler}>
          <h2>정말로 삭제하시겠습니까?</h2>
          <p>이 작업은 되돌릴 수 없습니다.</p>
          <div className="form-actions">
            {isPendingDeletion && "삭제 중..."}
            {!isPendingDeletion && (
              <>
                <button onClick={stopDeleteHandler} className="button-text">
                  취소
                </button>
                <button onClick={deleteHandler} className="button">
                  삭제
                </button>
              </>
            )}
          </div>
          {isErrorDeletiong && (
            <ErrorBlock
              title="이벤트 삭제 실패"
              message={deleteError.info?.message || "삭제에 실패했습니다."}
            />
          )}
        </Modal>
      )}

      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      <article id="event-details">{content}</article>
    </>
  );
}
