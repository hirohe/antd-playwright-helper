# antd-playwright-helper

some helper for playwright to interact with antd components

ant design components are quite complex, and it's hard to interact with them directly. such as `DateRangePicker` and `Select`. you need various steps to set the value of these components (locate the form item, find the input element, click or fill some text to search...).

## Usage

### Antd Form Helper

```ts
test('test all kinds of form items', async ({ page }) => {
  await page.goto('...')
  
  const formHelper = new AntdFormHelper(page)
  await formHelper.fillFormValues([
    {
      label: 'date-range',
      type: AntdInputType.DateRangePicker,
      value: ['2022-01-01', '2022-01-24'],
    },
    {
      label: 'city',
      type: AntdInputType.SearchSelect,
      value: 'Beijing',
    }
  ])
})
```
