import { Injectable,  } from '@nestjs/common';
import { SelectQueryBuilder, Repository, ObjectLiteral } from 'typeorm';

@Injectable()
export class DatabaseService {

  async paginateAndSearch<T extends ObjectLiteral>({
    repository,
    alias,
    query,
    searchFields = [],
    filterFields = [],
    allowedOrderFields = [],
    defaultOrderField = 'created_at',
    defaultOrderDirection = 'DESC',
    relations = [],
  }: PaginateAndSearchOptions<T>): Promise<{
    data: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const take = Number(query.limit || 10);
    const skip = (Number(query.page || 1) - 1) * take;

    const qb: SelectQueryBuilder<T> = repository.createQueryBuilder(alias);

    // Join relations
    for (const relation of relations) {
      qb.leftJoinAndSelect(`${alias}.${relation}`, relation);
    }

    // Search
    if (query.search && searchFields.length) {
      qb.andWhere(
        searchFields
          .map((field) => `${alias}.${field} LIKE :search`)
          .join(' OR '),
        { search: `%${query.search}%` },
      );
    }

    // Filters
    for (const field of filterFields) {
      const value = query[field];
      if (value !== undefined && value !== '') {
        qb.andWhere(`${alias}.${field} = :${field}`, { [field]: value });
      }
    }

    // Order
    const safeOrderBy = allowedOrderFields.includes(query.orderBy)
      ? query.orderBy
      : defaultOrderField;

    const safeOrder =
      ['asc', 'desc'].includes((query.order || '').toLowerCase())
        ? (query.order || '').toUpperCase()
        : defaultOrderDirection;

    qb.orderBy(`${alias}.${safeOrderBy}`, safeOrder as 'ASC' | 'DESC');
    qb.skip(skip).take(take);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      pagination: {
        page: Number(query.page || 1),
        limit: take,
        total,
        totalPages: Math.ceil(total / take),
      },
    };
  }

  async paginateAndSearchRelation<T extends ObjectLiteral>({
    repository,
    alias,
    query,
    searchFields = [],
    filterFields = [],
    allowedOrderFields = [],
    defaultOrderField = 'created_at',
    defaultOrderDirection = 'DESC',
    relations = [],
  }: PaginateAndSearchOptions<T>): Promise<{
    data: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const take = Number(query.limit || 10);
    const skip = (Number(query.page || 1) - 1) * take;

    const qb: SelectQueryBuilder<T> = repository.createQueryBuilder(alias);

    const joinedAliases = new Set<string>();

    for (const relationPath of relations) {
      const segments = relationPath.split('.');
      let parentAlias = alias;

      for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];
        // Generate unique alias for this join
        const joinAlias = [...segments.slice(0, i + 1)].join('_');

        if (!joinedAliases.has(joinAlias)) {
          const fullRelationPath = `${parentAlias}.${segment}`;

          if (i === segments.length - 1) {
            // For the last segment in the path, do leftJoinAndSelect so TypeORM hydrates nested object
            qb.leftJoinAndSelect(fullRelationPath, joinAlias);
          } else {
            // For intermediate segments, do leftJoin only
            qb.leftJoin(fullRelationPath, joinAlias);
          }

          joinedAliases.add(joinAlias);
        }

        parentAlias = joinAlias;
      }
    }

    // Search
    if (query.search && searchFields.length) {
      qb.andWhere(
        searchFields
          .map((field) => `${alias}.${field} LIKE :search`)
          .join(' OR '),
        { search: `%${query.search}%` },
      );
    }

    // Filters
    for (const field of filterFields) {
      const value = query[field];
      if (value !== undefined && value !== '') {
        qb.andWhere(`${alias}.${field} = :${field}`, { [field]: value });
      }
    }

    // Order
    const safeOrderBy = allowedOrderFields.includes(query.orderBy)
      ? query.orderBy
      : defaultOrderField;

    const safeOrder =
      ['asc', 'desc'].includes((query.order || '').toLowerCase())
        ? (query.order || '').toUpperCase()
        : defaultOrderDirection;

    qb.orderBy(`${alias}.${safeOrderBy}`, safeOrder as 'ASC' | 'DESC');
    qb.skip(skip).take(take);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      pagination: {
        page: Number(query.page || 1),
        limit: take,
        total,
        totalPages: Math.ceil(total / take),
      },
    };
  }
}

interface PaginateAndSearchOptions<T extends ObjectLiteral> {
  repository: Repository<T>;
  alias: string; // required for QueryBuilder aliasing
  query: any;
  searchFields?: string[];
  filterFields?: string[];
  allowedOrderFields?: string[];
  defaultOrderField?: string;
  defaultOrderDirection?: 'ASC' | 'DESC';
  relations?: string[];
}