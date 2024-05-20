# booking-playwright-automation

Tests are designed to have full control over the data with which they intaract. For each test scenario rooms are genereted or deleted trough http requests. Failing tests indicate bugs in the product. Tests do not run concurrently because the product messes up the user session - as a single user is available tests run one after another. Auth data is extracted before the whole test run and seeded to every scenario uing `auth.setup.ts`. 

As there is no access to the product in order to change selectors in it a mix of techniques was used to interact with the elements. The following priority was used to determine which selector to choose:
1. ARIA attributes
2. data-test-id
3. id
4. CSS selector
5. xpath

Also selectors are designed to work with any localization of the product. This means that if ex. German language is implemented and the DOM structure is unchanged all selectors will work with German language as well.

# How to install

The solution uses npm. Please, use `npm i`. 

# Run all tests

With `npm run test` you can run all tests in the solution. 

# Reporting

Allure report is used. In order to open the report, please, run the command `npm run report`. The report includes the following details for each test:
- details about the Auth setup beforeAll scenario;
- details about each before hook;
- details about the tests:
    - screenshots on failures
    - full Playwright trace available as attachment