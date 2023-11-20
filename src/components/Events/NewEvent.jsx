import { Link, useNavigate } from "react-router-dom";

import { useMutation } from "@tanstack/react-query";
import Modal from "../UI/Modal.jsx";
import EventForm from "./EventForm.jsx";
import { createNewEvent } from "../../util/http.js";
import ErrorBlock from "../UI/ErrorBlock.jsx";

export default function NewEvent() {
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: createNewEvent,
  });
  const navigate = useNavigate();

  function handleSubmit(formData) {
    mutate({ event: formData });
  }

  return (
    <Modal onClose={() => navigate("../")}>
      <EventForm onSubmit={handleSubmit}>
        {isPending && "기다리는 중!"}
        {!isPending && (
          <>
            <Link to="../" className="button-text">
              Cancel
            </Link>
            <button type="submit" className="button">
              Create
            </button>
          </>
        )}
      </EventForm>
      {isError && (
        <ErrorBlock
          title="게시물을 생성할 수 없습니다."
          message={error.info?.message || "잠시 후 다시 실행해주세요"}
        />
      )}
    </Modal>
  );
}
