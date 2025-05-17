import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../../../generated/prisma';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async paginateAndSearch<T>({
    prismaModel,
    query,
    searchFields = [],
    filterFields = [],
    include = {},
    allowedOrderFields = [],
    defaultOrderField = 'created_at',
    defaultOrderDirection = 'desc',
  }: PaginateAndSearchOptions): Promise<{
    data: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const {
      search,
      page = 1,
      limit = 10,
      orderBy,
      order,
      ...restFilters
    } = query;

    const take = Number(limit);
    const skip = (Number(page) - 1) * take;

    // Construct `where` filter
    const filters: any = [];

    // Search logic
    if (search && searchFields.length) {
      filters.push({
        OR: searchFields.map((field) => ({
          [field]: {
            contains: search,
            mode: 'insensitive',
          },
        })),
      });
    }

    // Exact field filters
    for (const field of filterFields) {
      const value = restFilters[field];
      if (value !== undefined && value !== '') {
        filters.push({
          [field]: value,
        });
      }
    }

    // Combine all filters into Prisma's `where`
    const where = filters.length > 0 ? { AND: filters } : {};

    // Safe ordering
    const safeOrderBy = allowedOrderFields.includes(orderBy)
      ? orderBy
      : defaultOrderField;
    const safeOrder = ['asc', 'desc'].includes((order || '').toLowerCase())
      ? order.toLowerCase()
      : defaultOrderDirection;

    // Query database
    const [total, data] = await Promise.all([
      prismaModel.count({ where }),
      prismaModel.findMany({
        where,
        take,
        skip,
        orderBy: { [safeOrderBy]: safeOrder },
        include,
      }),
    ]);

    return {
      data: this.convertBigIntToString(data),
      pagination: {
        page: Number(page),
        limit: take,
        total,
        totalPages: Math.ceil(total / take),
      },
    };
  }

  convertBigIntToString(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map((item) => this.convertBigIntToString(item));
    }

    if (obj !== null && typeof obj === 'object') {
      const result: any = {};
      for (const key in obj) {
        result[key] = this.convertBigIntToString(obj[key]);
      }
      return result;
    }

    if (typeof obj === 'bigint') {
      return obj.toString(); // or use `Number(obj)` if safe
    }

    return obj;
  }
}

interface PaginateAndSearchOptions {
  prismaModel: any; // E.g., prisma.user
  query: Record<string, any>;
  searchFields?: string[];
  filterFields?: string[];
  include?: {}; // Optional include
  allowedOrderFields?: string[];
  defaultOrderField?: string;
  defaultOrderDirection?: 'asc' | 'desc';
}
