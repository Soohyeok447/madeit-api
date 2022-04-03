import { HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';

export class AppController {
  public constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
  ) {}

  public exception(): any {
    return;
  }

  public check(): any {
    return this.health.check([
      (): any => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
    ]);
  }
}
