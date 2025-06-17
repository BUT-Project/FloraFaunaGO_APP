import {FilterPredicate} from "@/shared/FilterPredicate";
import {PagingResult} from "@/shared/PagingResult";
import {ICaptureRepository} from "@/dal/repository/ICaptureRepository";
import Capture from "@/model/domain/Capture";
import {PagedRequest} from "@/shared/PagedRequest";
import Specie from "@/model/domain/Specie";
import CaptureDetail from "@/model/domain/CaptureDetail";
import User from "@/model/domain/User";
import Location from "@/model/domain/Location";

export default class StubCaptures implements ICaptureRepository {
    constructor(public Captures: Capture[],
                public Users: User[]
    ) {
    }

    getCaptureByUserId(userId: string): Promise<PagingResult<Capture>> {
        return new Promise((resolve, reject) => {
            try {
                const user = this.Users.find(user => user.id === userId);
                if (!user || !user.captures) {
                    resolve(new PagingResult<Capture>(1, 0, 0, []));
                    return;
                }

                const pagingResult = new PagingResult<Capture>(
                    1,
                    user.captures.length,
                    user.captures.length,
                    user.captures
                );
                resolve(pagingResult);
            } catch (error) {
                reject(new Error('An error occurred while fetching captures for the user'));
            }
        });
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

    getById(id: string): Promise<Capture> {
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

    update(id: string, updatedCapture: Capture): Promise<void> {
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

    delete(id: string): Promise<void> {
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

    addSpecieToUser(userId: string, specie: Specie, userLocation: Location, capturedImageUri: string): Promise<void> {
        // Assuming SuccessManager is a data
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
                Date.now().toString(),
                new Date(),
                false, // Default shiny value [TODO]
                userLocation
            );
            if (specieInUserCaptures) {
                specieInUserCaptures.capturesDetails = [
                    ...specieInUserCaptures.capturesDetails,
                    newCaptureDetail
                ];
            } else {
                const newCapture = new Capture(
                    Date.now().toString(),
                    capturedImageUri,
                    specie,
                    [newCaptureDetail]
                );

                user.captures = [...user.captures, newCapture];
                this.Captures = [...this.Captures, newCapture];
            }

            resolve();
        });

    }
}
