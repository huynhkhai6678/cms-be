import { Injectable } from '@nestjs/common';
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
    selectFields = [],
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
    let returnQueryRaw = false;

    const qb: SelectQueryBuilder<T> = repository.createQueryBuilder(alias);

    // // Apply selected fields if specified
    // if (selectFields && selectFields.length > 0) {
    //   qb.select(selectFields.map((field) => `${alias}.${field}`));
    // }

    // Apply selected fields if specified
    if (selectFields && selectFields.length > 0) {
      qb.select([]);
      for (const field of selectFields) {
        if (Array.isArray(field)) {
          // Raw SQL with alias
          // If raw query then need return raw query
          returnQueryRaw = true;
          qb.addSelect(field[0], field[1]);
        } else {
          qb.addSelect(`${alias}.${String(field)}`);
        }
      }
    } else {
      qb.select(`${alias}`);
    }

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

    for (const field of filterFields) {
      const value = query[field];

      if (value === undefined || value === '') continue;

      if (typeof value === 'object' && value.where) {
        const condition = value.where;
        if ('not' in condition) {
          qb.andWhere(`${alias}.${field} != :${field}`, {
            [field]: condition.not,
          });
        } else if ('in' in condition) {
          qb.andWhere(`${alias}.${field} IN (:...${field})`, {
            [field]: condition.in,
          });
        } else if ('lt' in condition) {
          qb.andWhere(`${alias}.${field} < :${field}`, {
            [field]: condition.lt,
          });
        } else if ('lte' in condition) {
          qb.andWhere(`${alias}.${field} <= :${field}`, {
            [field]: condition.lte,
          });
        } else if ('gt' in condition) {
          qb.andWhere(`${alias}.${field} > :${field}`, {
            [field]: condition.gt,
          });
        } else if ('gte' in condition) {
          qb.andWhere(`${alias}.${field} >= :${field}`, {
            [field]: condition.gte,
          });
        } else if ('like' in condition) {
          qb.andWhere(`${alias}.${field} LIKE :${field}`, {
            [field]: `%${condition.like}%`,
          });
        }
      } else {
        // simple value
        qb.andWhere(`${alias}.${field} = :${field}`, { [field]: value });
      }
    }

    // Order
    const safeOrderBy = allowedOrderFields.includes(query.orderBy)
      ? query.orderBy
      : defaultOrderField;

    const safeOrder = ['asc', 'desc'].includes(
      (query.order || '').toLowerCase(),
    )
      ? (query.order || '').toUpperCase()
      : defaultOrderDirection;

    qb.orderBy(`${alias}.${safeOrderBy}`, safeOrder as 'ASC' | 'DESC');
    qb.skip(skip).take(take);
    
    let data : T[] = [];
    let total : number = 0;
    [data, total] = await qb.getManyAndCount();

    console.log(returnQueryRaw);
    if (returnQueryRaw) {
      data = await qb.getRawMany();
      total = await qb.getCount();
    } else {
      [data, total] = await qb.getManyAndCount();
    }

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
  selectFields: (keyof T | [string, string])[];
  relations?: string[];
}
