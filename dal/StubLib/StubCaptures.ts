import Capture from "@/model/Capture";
import {useState} from "react";
import {Sucess} from "@/model/Sucess";
import Specie from "@/model/Specie";
import {FilterPredicate} from "@/dal/StubLib/FilterPredicate";
import {GenericRepository} from "@/dal/StubLib/IGenericRepository";
import {PagingResult} from "@/dal/StubLib/PagingResult";

export default class StubCaptures extends GenericRepository<Capture> {
    constructor(public Captures: Capture[]) {
        super();
    }

    count(filter: FilterPredicate<Capture>): Promise<number> {
        return new Promise((resolve, reject) => {
            try {
                const filteredItems = this.Captures.filter(filter);
                resolve(filteredItems.length);
            } catch (error) {
                reject(new Error('An error occurred while counting items'));
            }
        });
    }

    create(newCapture: Capture): Promise<void> {
        return new Promise((resolve) => {
            this.Captures.push(newCapture);
            resolve();
        });
    }

    getById(id: number): Promise<Capture> {
        return new Promise((resolve) => {
            const capture = this.Captures.find(capture => capture.id === id) || null;
        });
    }

    getAll(page: number = 1, pageSize: number = 10): Promise<PagingResult<Capture>> {
        return new Promise((resolve) => {
            const startIndex = (page - 1) * pageSize;
            const endIndex = startIndex + pageSize;
            const items = this.Captures.slice(startIndex, endIndex);
            const total = this.Captures.length;
            const pagingResult = new PagingResult<Capture>(page, items.length, total, items);
            resolve(pagingResult);
        });
    }

    update(id: number, updatedCapture: Capture): Promise<void> {
        return new Promise((resolve, reject) => {
            const index = this.Captures.findIndex(capture => capture.id === id);
            if (index === -1) {
                reject(new Error('Capture not found'));
                return;
            }
            this.Captures[index] = { ...this.Captures[index], ...updatedCapture };
            resolve();
        });
    }

    delete(id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            const initialLength = this.Captures.length;
            this.Captures = this.Captures.filter(capture => capture.id !== id);

            if (this.Captures.length === initialLength) {
                reject(new Error('Capture not found'));
                return;
            }

            resolve();
        });
    }
}