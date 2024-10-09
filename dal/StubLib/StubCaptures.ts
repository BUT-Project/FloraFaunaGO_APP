import Capture from "@/model/Capture";
import {useState} from "react";

export default function StubCaptures(Captures: Capture[]) {
    const [captures, setCaptures] = useState<Capture[]>(Captures);

    // CREATE: Add a new capture to the list
    function createCapture(newCapture: Capture) {
        setCaptures([...captures, newCapture]);
    }

    // READ: Get all captures or a specific one by ID
    function readCapture(id?: number): Capture | Capture[] | null {
        if (id !== undefined) {
            return captures.find(capture => capture.id === id) || null;
        }
        return captures;
    }

    // UPDATE: Update a capture by ID
    function updateCapture(updatedCapture: Capture) {
        setCaptures(
            captures.map(capture =>
                capture.id === updatedCapture.id ? { ...capture, ...updatedCapture } : capture
            )
        );
    }

    // DELETE: Remove a capture by ID
    function deleteCapture(id: number) {
        setCaptures(captures.filter(capture => capture.id !== id));
    }

    return {
        createCapture,
        readCapture,
        updateCapture,
        deleteCapture,
    };
}