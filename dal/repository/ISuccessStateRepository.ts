import { FilterPredicate } from "@/shared/FilterPredicate";
import { PagedRequest } from "@/shared/PagedRequest";
import { PagingResult } from "@/shared/PagingResult";
import { SuccessStateCompleteItem } from "@/shared/scheme/SuccessStateNormalDtoSchema";


export interface ISuccessStateRepository {
  getById(id: string): Promise<SuccessStateCompleteItem>;
  getAll(request: PagedRequest): Promise<PagingResult<SuccessStateCompleteItem>>;
  create(item: SuccessStateCompleteItem): Promise<void>;
  update(id: string, item: SuccessStateCompleteItem): Promise<void>;
  delete(id: string): Promise<void>;
  count(filter?: FilterPredicate<SuccessStateCompleteItem>): Promise<number>;
}