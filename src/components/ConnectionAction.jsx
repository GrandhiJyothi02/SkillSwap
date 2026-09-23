import { useNavigate } from "react-router-dom";
import { UserPlus, Check, X, MessageCircle, Clock } from "lucide-react";
import { useConnections } from "../context/ConnectionsContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

// Renders the right action(s) for the relationship between the current user
// and `email`, and keeps them working consistently everywhere a tutor/user
// shows up (skill details, tutor profile, connections list, search).
export default function ConnectionAction({ email, size = "md" }) {
  const { getStatusWith, sendRequest, acceptRequest, rejectRequest, cancelRequest } = useConnections();
  const toast = useToast();
  const navigate = useNavigate();
  const btnSize = size === "sm" ? "btn-sm" : "";

  const { status, connection } = getStatusWith(email);

  function handleConnect() {
    const result = sendRequest(email);
    if (result.error) toast.error(result.error);
    else toast.success("Connection request sent");
  }

  function handleAccept() {
    const result = acceptRequest(connection.id);
    if (result.error) toast.error(result.error);
    else toast.success("Connection accepted — you can now message each other");
  }

  function handleReject() {
    const result = rejectRequest(connection.id);
    if (result.error) toast.error(result.error);
    else toast.success("Request declined");
  }

  function handleCancel() {
    const result = cancelRequest(connection.id);
    if (result.error) toast.error(result.error);
    else toast.success("Request cancelled");
  }

  function handleMessage() {
    navigate(`/dashboard/messages/${encodeURIComponent(email)}`);
  }

  if (status === "self") return null;

  if (status === "accepted") {
    return (
      <button className={`btn btn-primary ${btnSize}`} onClick={handleMessage}>
        <MessageCircle size={16} /> Message
      </button>
    );
  }

  if (status === "pending_received") {
    return (
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button className={`btn btn-primary ${btnSize}`} onClick={handleAccept}>
          <Check size={16} /> Accept
        </button>
        <button className={`btn btn-danger ${btnSize}`} onClick={handleReject}>
          <X size={16} /> Reject
        </button>
      </div>
    );
  }

  if (status === "pending_sent") {
    return (
      <button className={`btn btn-secondary ${btnSize}`} onClick={handleCancel}>
        <Clock size={16} /> Request Sent
      </button>
    );
  }

  // "none" or "rejected" — free to (re)send a request.
  return (
    <button className={`btn btn-secondary ${btnSize}`} onClick={handleConnect}>
      <UserPlus size={16} /> Connect
    </button>
  );
}
