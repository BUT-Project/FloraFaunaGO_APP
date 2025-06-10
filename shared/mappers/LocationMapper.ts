import Location from "@/model/domain/Location";
import { LocationDto } from "../scheme/LocationDtoSchema";
import {IMapper} from "@/shared/mappers/IMapper";

export class LocationMapper implements IMapper<LocationDto,Location> {
    toUpdateDto(domain: Partial<Location>): Partial<{ id: string; latitude: number; longitude: number; altitude: number; rayon: number; }> {
        throw new Error("Method not implemented We should not update a location in the database, only create it");
    }
    toDomain(dto: LocationDto): Location {
        return new Location(dto.latitude,dto.longitude,dto.altitude,dto.rayon,1);
    }
    toDto(domain: Location): LocationDto {
        return {
            id:"",
            latitude:domain.latitude,
            longitude: domain.longitude,
            altitude: domain.altitude,
            exactitude: domain.accuracy,
            rayon: domain.radius,
        }
    }
    toDomains(dtos:LocationDto[]):Location[]{
        return dtos.map(dto=> this.toDomain(dto));
    }
    toDtos(domains:Location[]):LocationDto[]{
        return domains.map(domain => this.toDto(domain));
    }
   
}