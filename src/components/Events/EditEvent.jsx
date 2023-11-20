import { Link, useNavigate, useParams } from "react-router-dom";

import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchEvent, queryClient, updateEvent } from "../../util/http.js";
import ErrorBlock from "../UI/ErrorBlock.jsx";
import LoadingIndicator from "../UI/LoadingIndicator.jsx";
import Modal from "../UI/Modal.jsx";
import EventForm from "./EventForm.jsx";

export default function EditEvent() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["events", id],
    queryFn: ({ signal }) => fetchEvent({ signal, id }),
  });

  const { mutate } = useMutation({
    mutationFn: updateEvent,
    //optimistic update
    onMutate: async ({ event }) => {
      await queryClient.cancelQueries({ queryKey: ["events", id] });
      const previousEvent = queryClient.getQueryData(["events", id]);

      queryClient.setQueryData(["events", id], event);

      return { previousEvent }; //onError의 context로 전달
    },
    onError: (err, context) => {
      queryClient.setQueryData(["events", id], context.previousEvent);
    },
    //성공여부와 상관없이 뮤테이션펑션이 완료될때마다 호출
    onSettled: () => {
      queryClient.invalidateQueries(["events", id]);
    },
  });

  function handleSubmit(formData) {
    //onMutate로 인수를 전해준다
    mutate({ id, event: formData });
    navigate("../");
  }

  function handleClose() {
    navigate("../");
  }

  let content;

  if (isPending) {
    content = (
      <div className="center">
        <LoadingIndicator />
      </div>
    );
  }

  if (isError) {
    content = (
      <>
        <ErrorBlock
          title="이벤트를 불러올 수 없어요!"
          message={error.info?.message || "이벤트 로드에 실패했어요"}
        />
        <div className="form-actions">
          <Link to="../" className="button">
            확인
          </Link>
        </div>
      </>
    );
  }
  if (data) {
    content = (
      <EventForm inputData={data} onSubmit={handleSubmit}>
        <Link to="../" className="button-text">
          Cancel
        </Link>
        <button type="submit" className="button">
          Update
        </button>
      </EventForm>
    );
  }
  return <Modal onClose={handleClose}>{content}</Modal>;
}
