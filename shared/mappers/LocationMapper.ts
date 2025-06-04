import Location from "@/model/domain/Location";
import { LocationDto } from "../scheme/LocationDtoSchema";
import {IMapper} from "@/shared/mappers/IMapper";

export class LocationMapper implements IMapper<LocationDto,Location> {
    toDomain(dto: LocationDto): Location {
        return new Location(dto.latitude,dto.longitude,dto.altitude,dto.rayon,1);
    }
    toDto(domain: Location): LocationDto {
        return {
            id:"",
            latitude:domain.latitude,
            longitude: domain.longitude,
            altitude: domain.altitude,
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