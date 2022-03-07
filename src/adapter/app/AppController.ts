import { HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';

export class AppController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
  ) {}

  exception() {
    return;
  }

  check() {
    return this.health.check([
      () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
    ]);
  }
}
