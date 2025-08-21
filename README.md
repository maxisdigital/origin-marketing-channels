# Marketing Channel Tester

## Summary

Marketing Channel reports tell you how users arrived on your site (e.g., Paid Search, Social Networks), categorising the traffic source itself. eVars (conversion variables) tell you what happened after they arrived, capturing specific values related to conversions or user actions (Button/Link clicks, Application Names, Conversions).

* [Marketing Channels Explained](https://experienceleague.adobe.com/en/docs/analytics/components/marketing-channels/c-getting-started-mchannel)

This repository aims to codify the marketing channel processing rules in the Adobe Analytics admin console into a series of Javascript rules for Adobe Launch so that the data can be mapped to a different eVar, and the business can restructure the regular Marketing Channel rules per Adobe's guidance: [Attribution with Marketing Channels - Best Practices](https://experienceleague.adobe.com/en/docs/analytics/components/marketing-channels/mchannel-best-practices), while still retaining the old channels and providing a benchmark.


## Interactive test tool

1. Choose an example from the drop down,
2. Or enter a combination of url, referrer, and page views in session.
3. Click Run Test to see the assessment

https://maxisdigital.github.io/origin-marketing-channels/

![Screenshot](screenshot.png?raw=true "Screenshot")

## Todo

- [X] HTML test page
- [ ] Complete scripting for rules:
  - [ ] Rule 16 Origin App,
  - [ ] Rule 17 Internal,
  - [ ] Rule 18 Personalisation,
  - [ ] Rule 19 Direct
- [ ] Script based test runner
- [ ] Test against a CSV file.