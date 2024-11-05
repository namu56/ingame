import { PrometheusInterceptor } from '@core/interceptors/prometheus.interceptor';
import { DynamicModule, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

@Module({})
export class MetricsModule {
  static register(): DynamicModule {
    const isProduction = process.env.NODE_ENV === 'production';

    return {
      module: MetricsModule,
      imports: !isProduction
        ? [PrometheusModule.register({ path: '/metrics', defaultMetrics: { enabled: true } })]
        : [],
      providers: !isProduction
        ? [{ provide: APP_INTERCEPTOR, useClass: PrometheusInterceptor }]
        : [],
    };
  }
}
