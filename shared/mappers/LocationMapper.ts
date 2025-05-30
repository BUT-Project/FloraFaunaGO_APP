import Location from "@/model/domain/Location";
import { LocationDto } from "../scheme/LocationDtoSchema";

export interface ILocationMapper {
    toDomain(dto: LocationDto): Location;
    toDto(domain: Location): LocationDto;
}

export class LocationMapper implements ILocationMapper {
    toDomain(dto: LocationDto): Location {
        return new Location(dto.latitude,dto.longitude,0,dto.rayon,1);
    }
    toDto(domain: Location): LocationDto {
        return {
            id:"",
            latitude:domain.latitude,
            longitude: domain.longitude,
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