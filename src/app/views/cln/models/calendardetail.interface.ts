

export interface ICalendarDetail {
    details: {
      id: number;
      name: string;
      code: string;
      currency: string;
      currencySymbol: string;
      title: string;
      browserTitle: string;
      description: string;
    };
    lastWeek: [
      {
        id: number;
        date_: string;
        time_: string;
        actual_Value: string;
        prev_Value: string;
        forecast_Value: string;
        impact_Type: string;
        name: string;
        type: number;
        sector: number;
        time_Mode: number;
        unit: number;
        multiplier: number;
        importance: number;
        currency: string;
        code: string;
        currencySymbol: string;
        eventID: number;
        secondName: string;
      }
    ];
    lastValues: [
      {
        id: number;
        date_: string;
        time_: string;
        actual_Value: string;
        prev_Value: string;
        forecast_Value: string;
        impact_Type: string;
        name: string;
        type: number;
        sector: number;
        time_Mode: number;
        unit: number;
        multiplier: number;
        importance: number;
        currency: string;
        code: string;
        currencySymbol: string;
        eventID: number;
        secondName: string;
      }
    ];
    linkTags: [
      {
        title: string;
        value: number;
      }
    ];
    sharpLinkTags: [
      {
        title: string;
        value: number;
      }
    ];
    indicators: [
      {
        id: number;
        title: string;
        secondTitle: string;
        changePercent: number;
        lastValue: number;
      }
    ]
}