import Capture from "@/model/Capture";
import {useState} from "react";
import {Sucess} from "@/model/Sucess";
import Specie from "@/model/Specie";

export default class StubCaptures {

    constructor(public Captures: Capture[]) {
    }
     createCapture(newCapture: Capture) {
        this.Captures.push(newCapture)
    }

    // READ: Get all captures or a specific one by ID
     readCapture(id: number): Capture | null {
        return this.Captures.find(capture => capture.id === id) || null;

    }


     readAllCaptures(page: number = 1, pageSize: number = 10): Capture[]  {
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return this.Captures.slice(startIndex, endIndex)
    }

    // UPDATE: Update a capture by ID
     updateCapture(updatedCapture: Capture) {
        return this.Captures.map(capture =>
            capture.id === updatedCapture.id ? { ...capture, ...updatedCapture } : capture
        );
    }

    // DELETE: Remove a capture by ID
       deleteCapture(id: number) {
           this.Captures.filter(capture => capture.id !== id);
    }
}