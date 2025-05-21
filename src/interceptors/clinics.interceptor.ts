import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, from } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { map, switchMap } from 'rxjs/operators';
import { User } from 'src/entites/user.entity';

@Injectable()
export class AddClinicInterceptor implements NestInterceptor {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user?.id) {
      // If no user is found on the request, proceed without adding clinics
      return next.handle();
    }

    return from(
      this.userRepository.findOne({
        where: { id: user.id },
        relations: ['clinics'], // Load clinics relation
      }),
    ).pipe(
      switchMap((fullUser) =>
        next.handle().pipe(
          map((data) => ({
            ...data,
            clinics: fullUser?.clinics || [],
          })),
        ),
      ),
    );
  }
}