export interface IMapper<DTO,D> {
    toDomain(dto: DTO): D;
    toDto(domain: D): DTO;
    toUpdateDto(domain: Partial<D>): Partial<DTO>;
}