import { IMapper } from "@/shared/mappers/IMapper";
import { CaptureCompleteDto } from "../scheme/CaptureDtoSchema";
import Capture from "@/model/domain/Capture";
import CaptureDetail from "@/model/domain/CaptureDetail";
import { LocationMapper } from "./LocationMapper";
import { SpecieMapper } from "./SpecieMapper";

export class CaptureMapper implements IMapper<CaptureCompleteDto, Capture> {
    private locationMapper: LocationMapper = new LocationMapper();
    private specieMapper: SpecieMapper = new SpecieMapper();

    toDomain(dto: CaptureCompleteDto): Capture {
        // Use full specie data if available, otherwise create minimal specie with ID
        const specie = dto.specie ? 
            this.specieMapper.toDomain(dto.specie) :
            this.specieMapper.toDomain({
                id: dto.capture.idEspece,
                nom: "Unknown Species",
                nom_Scientifique: "",
                description: "",
                image: "",
                image3D: null,
                class: null as any,
                kingdom: null as any,
                famille: null as any,
                zone: "",
                climat: null as any,
                regime: null as any,
                localisations: []
            });

        const captureDetails = dto.captureDetails.map(detail => 
            new CaptureDetail(
                detail.captureDetail.id,
                new Date(detail.captureDetail.date),
                detail.captureDetail.shiny,
                this.locationMapper.toDomain(detail.localisationNormalDtos)
            )
        );

        return new Capture(
            dto.capture.id,
            dto.capture.photo,
            specie,
            captureDetails
        );
    }

    toDto(domain: Capture): CaptureCompleteDto {
        const captureDetails = domain.capturesDetails.map(detail => ({
            captureDetail: {
                id: detail.id,
                date: detail.date.toISOString(),
                shiny: detail.shiny
            },
            localisationNormalDtos: this.locationMapper.toDto(detail.location)
        }));

        return {
            capture: {
                id: domain.id,
                idEspece: domain.specie.id,
                photo: domain.photo || "",
                localisationNormalDto: captureDetails[0]?.localisationNormalDtos || {
                    id: "",
                    latitude: 0,
                    longitude: 0,
                    altitude: 0,
                    exactitude: 0,
                    rayon: 0
                },
                shiny: captureDetails[0]?.captureDetail.shiny || false
            },
            captureDetails,
            idUtilisateur: "",
            specie: this.specieMapper.toDto(domain.specie)
        };
    }

    toUpdateDto(domain: Partial<Capture>): Partial<CaptureCompleteDto> {
        throw new Error("Method not implemented - captures are not updated");
    }

    toDomains(dtos: CaptureCompleteDto[]): Capture[] {
        return dtos.map(dto => this.toDomain(dto));
    }
}