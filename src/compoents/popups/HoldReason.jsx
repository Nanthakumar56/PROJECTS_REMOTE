import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { ImInfo } from "react-icons/im";

const HoldReason = ({ onClose, taskid }) => {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!reason.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:6262/tasks/update-reason?taskid=${taskid}&reason=${reason}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update reason");
      }

      onClose(true, reason);
    } catch (error) {
      console.error("Error updating reason:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-4 w-72 lg:w-80 xl:w-96">
        <div className="flex justify-between mb-2">
          <p className="text-xs lg:text-sm font-semibold">Reason for Hold</p>
        </div>

        <div className="relative">
          <div className="mb-2">
            <label htmlFor="taskSearch" className="text-[10px] lg:text-xs">
              Reason
            </label>
            <textarea
              name="description"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter the reason for hold"
              className="w-full text-[10px] lg:text-xs py-1 lg:py-1.5 px-2 lg:px-3 border border-gray-200 rounded-md lg:rounded-lg bg-white"
              rows="3"
              required
            ></textarea>
          </div>
        </div>

        <div className="mt-6 text-[10px] lg:text-xs text-gray-500 flex items-start gap-x-2">
          <ImInfo className="text-lg lg:text-xl" />
          <p className="pt-[3px]">
            Every task moves us forward! If it's on hold, share the reason so we
            can keep progress on track!
          </p>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="py-1 px-3 bg-[#18636f] text-white rounded-md text-[10px] lg:text-xs"
            disabled={!reason.trim() || loading}
          >
            {loading ? "Saving..." : "Done"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HoldReason;
