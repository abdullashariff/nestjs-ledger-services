import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];

    // For demo purposes: checking for a hardcoded key
    if (apiKey === 'my-secret-ledger-key') {
      return true;
    }

    throw new UnauthorizedException('Invalid or missing API Key');
  }
}