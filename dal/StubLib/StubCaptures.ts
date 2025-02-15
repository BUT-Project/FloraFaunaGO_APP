import {FilterPredicate} from "@/shared/FilterPredicate";
import {PagingResult} from "@/shared/PagingResult";
import {ICaptureRepository} from "@/model/service/ICaptureRepository";
import Capture from "@/model/domain/Capture";
import {PagedRequest} from "@/shared/PagedRequest";
import {Family} from "@/model/domain/Family";
import Specie from "@/model/domain/Specie";
import CaptureDetail from "@/model/domain/CaptureDetail";
import StubData from "@/dal/StubLib/StubData";
import {CaptureList} from "@/dal/StubLib/Data";
import User from "@/model/domain/User";
import Location from "@/model/domain/Location";
export default class StubCaptures implements ICaptureRepository {
    constructor(public Captures: Capture[],
                public Users: User[]
    ) {
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
            if (capture !== null) {
                resolve(capture)
            }
        });
    }

    getAll(request: PagedRequest): Promise<PagingResult<Capture>> {
        return new Promise((resolve) => {
            const startIndex = (request.index - 1) * request.count;
            const endIndex = startIndex + request.count;
            const items = this.Captures.slice(startIndex, endIndex);
            const total = this.Captures.length;
            const pagingResult = new PagingResult<Capture>(request.index, items.length, total, items);
            resolve(pagingResult);
        });
    }

    getByFamily(family: Family, page: number = 1, pageSize: number = 10, selfId?: number): Promise<PagingResult<Capture>> {
        return new Promise((resolve) => {
            const startIndex = (page - 1) * pageSize;
            const endIndex = startIndex + pageSize;
            const items = this.Captures.filter((capture) =>
                capture.specie.family === family &&
                (selfId === undefined || capture.id !== selfId)
            );
            const pageItems = items.slice(startIndex, endIndex);
            const total = items.length;
            const pagingResult = new PagingResult<Capture>(page, pageItems.length, total, pageItems);
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
            this.Captures[index] = {...this.Captures[index], ...updatedCapture};
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

    addSpecieToUser(userId: number, specie: Specie, userLocation: Location, capturedImageUri: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const user = this.Users.find(user => user.id === userId);

            if (!user) {
                reject(new Error('User not found'));
                return;
            }

            if (!user.captures) {
                user.captures = [];
            }

            // Check if species is already added
            const specieInUserCaptures = user.captures.find(s => s.id === specie.id);

            const newCaptureDetail = new CaptureDetail(
                Date.now(),
                new Date(),
                false, // Default shiny value [TODO]
                userLocation
            );
            if (specieInUserCaptures) {
                specieInUserCaptures.capturesDetails.push(newCaptureDetail)
            } else {
                const newCapture = new Capture(
                    Date.now(),
                    capturedImageUri,
                    specie,
                    [newCaptureDetail]
                );
                console.log("On ajoute une capture des captures", newCapture, user.captures);

                user.captures.push(newCapture);
            }

            resolve();
        });

    }
}
