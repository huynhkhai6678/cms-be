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

    // Apply selected fields if specified
    if (selectFields && selectFields.length > 0) {
      qb.select([]);
      for (const field of selectFields) {
        if (Array.isArray(field)) {
          // Raw SQL with alias
          // If raw query then need return raw query
          returnQueryRaw = true;
          qb.addSelect(field[0], field[1]);
        } else if (typeof field === 'string') {
          const match = field.match(/^([\w.]+)\s+as\s+(\w+)$/i);
          if (match) {
            // Pattern: "table.column as alias"
            const [, expression, aliasName] = match;
            returnQueryRaw = true;
            qb.addSelect(expression, aliasName);
          } else if (field.includes('.')) {
            // e.g., "category.id"
            qb.addSelect(field);
          } else {
            // e.g., "name" (from base alias)
            qb.addSelect(`${alias}.${field}`);
          }
        }
      }
    } else {
      qb.select(`${alias}`);
    }

    // Join relations
    for (const relation of relations) {
      qb.leftJoinAndSelect(`${alias}.${relation}`, relation);
    }

    const { finalQuery, params } = this.buildFinalQuery(
      query,
      searchFields,
      filterFields,
      alias,
    );
    qb.andWhere(finalQuery, params);

    // Order
    const { field: orderByField, direction: orderDirection } =
      this.buildOrderBy({
        queryOrderBy: query.orderBy,
        queryOrder: query.order,
        alias,
        allowedOrderFields,
        defaultOrderField,
        defaultOrderDirection: defaultOrderDirection,
      });

    qb.orderBy(orderByField, orderDirection);

    // Pagination
    qb.skip(skip).take(take);

    let data: T[] = [];
    let total: number = 0;
    [data, total] = await qb.getManyAndCount();

    if (returnQueryRaw) {
      // Monitor me for other case
      qb.groupBy(`${alias}_id`);
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

  buildSearchQuery(
    query: any,
    searchFields: string[],
    alias: string,
  ): { searchQuery: string; searchParams: SearchParams } {
    let searchQuery = '';
    const searchParams: SearchParams = {};

    if (query.search && searchFields.length) {
      searchQuery = searchFields
        .map((field) => `${alias}.${field} LIKE :search`)
        .join(' OR ');
      searchParams.search = `%${query.search}%`;
    }

    return { searchQuery, searchParams };
  }

  buildFilterQuery(
    query: any,
    filterFields: string[],
    alias: string,
    searchQuery: string,
  ): { filterQuery: string; filterParams: FilterParams } {
    let filterQuery = '';
    let filterParams: FilterParams = {};

    // Only start appending 'AND' if searchQuery exists
    let firstCondition = true;

    for (const field of filterFields) {
      const value = query[field];
      if (value === undefined || value === '') continue;

      // If searchQuery exists, we don't need to prepend 'AND' before the first filter condition.
      if (firstCondition) {
        firstCondition = false; // After the first condition, subsequent ones should prepend 'AND'
      } else {
        filterQuery += ' AND ';
      }

      if (typeof value === 'object') {
        const { queryPart, params } = this.buildConditionQuery(
          alias,
          field,
          value,
        );
        filterQuery += queryPart;
        filterParams = { ...filterParams, ...params };
      } else {
        filterQuery += `${alias}.${field} = :${field}`;
        filterParams[field] = value;
      }
    }
    return { filterQuery, filterParams };
  }

  buildFinalQuery(
    query: any,
    searchFields: string[],
    filterFields: string[],
    alias: string,
  ): { finalQuery: string; params: { [key: string]: any } } {
    const { searchQuery, searchParams } = this.buildSearchQuery(
      query,
      searchFields,
      alias,
    );
    const { filterQuery, filterParams } = this.buildFilterQuery(
      query,
      filterFields,
      alias,
      searchQuery,
    );

    let finalQuery = '';
    // Add the search query if it exists
    if (searchQuery) {
      finalQuery += `(${searchQuery})`;
    }

    // Add the filter query if it exists
    if (filterQuery) {
      if (searchQuery) {
        finalQuery += ` AND ${filterQuery.trim()}`;
      } else {
        finalQuery += filterQuery.trim();
      }
    }
    return { finalQuery, params: { ...searchParams, ...filterParams } };
  }

  buildConditionQuery(alias, field, condition) {
    let queryPart = '';
    const params = {};
    if ('not' in condition) {
      queryPart = `AND ${alias}.${field} != :${field}`;
      params[field] = condition.not;
    } else if ('in' in condition) {
      queryPart = `AND ${alias}.${field} IN (:...${field})`;
      params[field] = condition.in;
    } else if ('lt' in condition) {
      queryPart = `AND ${alias}.${field} < :${field}`;
      params[field] = condition.lt;
    } else if ('lte' in condition) {
      queryPart = `AND ${alias}.${field} <= :${field}`;
      params[field] = condition.lte;
    } else if ('gt' in condition) {
      queryPart = `AND ${alias}.${field} > :${field}`;
      params[field] = condition.gt;
    } else if ('gte' in condition) {
      queryPart = `AND ${alias}.${field} >= :${field}`;
      params[field] = condition.gte;
    } else if ('like' in condition) {
      queryPart = `AND ${alias}.${field} LIKE :${field}`;
      params[field] = `%${condition.like}%`;
    }

    return { queryPart, params };
  }

  buildOrderBy({
    queryOrderBy,
    queryOrder,
    alias,
    allowedOrderFields,
    defaultOrderField,
    defaultOrderDirection,
  }: {
    queryOrderBy?: string;
    queryOrder?: string;
    alias: string;
    allowedOrderFields: string[];
    defaultOrderField: string;
    defaultOrderDirection: 'ASC' | 'DESC';
  }): { field: string; direction: 'ASC' | 'DESC' } {
    const rawOrderBy = String(queryOrderBy || '');
    const safeOrder = ['asc', 'desc'].includes((queryOrder || '').toLowerCase())
      ? ((queryOrder || '').toUpperCase() as 'ASC' | 'DESC')
      : defaultOrderDirection;

    if (allowedOrderFields.includes(rawOrderBy)) {
      if (rawOrderBy.includes('.')) {
        return { field: rawOrderBy, direction: safeOrder };
      }
      return { field: `${alias}.${rawOrderBy}`, direction: safeOrder };
    }

    return {
      field: `${alias}.${defaultOrderField}`,
      direction: defaultOrderDirection,
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
  selectFields: (keyof T | string | [string, string])[];
  relations?: string[];
}

interface SearchParams {
  search?: string;
  [key: string]: any;
}

interface FilterParams {
  [key: string]: any;
}
