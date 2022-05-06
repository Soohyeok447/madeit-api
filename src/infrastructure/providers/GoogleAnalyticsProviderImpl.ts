import { GoogleAnalyticsProvider } from '../../domain/providers/GoogleAnalyticsProvider';
import { BetaAnalyticsDataClient } from '@google-analytics/data';

const analyticsDataClient: BetaAnalyticsDataClient =
  new BetaAnalyticsDataClient();

export class GoogleAnalyticsProviderImpl implements GoogleAnalyticsProvider {
  public async getActiveUsers(): Promise<number> {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${process.env.GOOGLE_ANALYTICS_PROPERTY_ID}`,
      dateRanges: [
        {
          startDate: '2020-03-31',
          endDate: 'today',
        },
      ],
      dimensions: [
        {
          name: 'city',
        },
      ],
      metrics: [
        {
          name: 'activeUsers',
        },
      ],
    });

    return response.rows.reduce(
      (acc, cur) => acc + parseInt(cur.metricValues[0].value),
      0,
    );
  }
}

/**
 * row
 * 
 *  {
      dimensionValues: [ { value: '(not set)', oneValue: 'value' } ],
      metricValues: [ { value: '63', oneValue: 'value' } ]
    }
 */

/**
 * RunReportResponse
 * 
 * {
  "dimensionHeaders": [
    {
      object (DimensionHeader)
    }
  ],
  "metricHeaders": [
    {
      object (MetricHeader)
    }
  ],
  "rows": [
    {
      object (Row)
    }
  ],
  "totals": [
    {
      object (Row)
    }
  ],
  "maximums": [
    {
      object (Row)
    }
  ],
  "minimums": [
    {
      object (Row)
    }
  ],
  "rowCount": integer,
  "metadata": {
    object (ResponseMetaData)
  },
  "propertyQuota": {
    object (PropertyQuota)
  },
  "kind": string
}
 */
