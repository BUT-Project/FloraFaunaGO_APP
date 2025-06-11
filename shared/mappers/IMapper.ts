export interface IMapper<DTO,D,DTOLIST = DTO> {
    toDomain(dto: DTO): D;
    toDto(domain: D): DTO;
    toUpdateDto(domain: Partial<D>): Partial<DTO>;
    toDomains(dtos: DTOLIST[]): D[];
}